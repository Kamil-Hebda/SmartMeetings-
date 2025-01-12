import os
import time
from flask import Flask, Blueprint, request, jsonify, current_app
from flask_cors import CORS
from backend.services.ss_generating import extract_frames
from backend.services.transcirption_summary import transcribe_video, diarize_audio, format_transcription_with_speakers, summarize
from backend.services.OCR_text_generating import ocr_from_frames
from urllib.parse import quote
import re

routes_bp = Blueprint('routes', __name__)

# Inicjalizacja CORS dla wszystkich tras
CORS(routes_bp)

@routes_bp.route('/', methods=['GET'])
def index():
    return 'API is running'

@routes_bp.route('/upload_video', methods=['POST'])
def upload_video():
    if 'video_file' not in request.files:
        return jsonify({'message': "No file part"}), 400

    file = request.files['video_file']

    if file.filename == '':
        return jsonify({'message': "No file selected"}), 400

    if file:
        upload_folder = os.path.join(current_app.root_path, 'uploads')
        os.makedirs(upload_folder, exist_ok=True)

        file_path = os.path.join(upload_folder, file.filename)
        file.save(file_path)

        return jsonify({'message': "File uploaded successfully!", 'video_path': file_path}), 200
    return jsonify({'message': "Upload failed"}), 400


@routes_bp.route('/generate_screenshots', methods=['POST'])
def generate_screenshots():
    video_path = request.get_json().get('video_path')
    if not video_path:
        return jsonify({'message': "No video file path provided"}), 400

    start = time.time()
    try:
        screenshots_dir = extract_frames(video_path)
        print(f"Screenshots created successfully: {screenshots_dir}")
        # Pobieranie listy plików w katalogu ze zrzutami ekranu
        screenshots = [os.path.join(screenshots_dir, f) for f in os.listdir(screenshots_dir) if os.path.isfile(os.path.join(screenshots_dir, f))]
        
        # Konwertowanie ścieżek do URL-i, jeśli to konieczne
        base_url = request.host_url  # Uzyskanie adresu URL hosta
        
        
        screenshots_urls = [
            {"path": f"{base_url}{os.path.relpath(f, current_app.root_path).replace(os.sep, '/').replace('../', '')}"}
            for f in screenshots
        ]
    
    except Exception as e:
        current_app.logger.error(f"Error generating screenshots: {e}", exc_info=True)
        return jsonify({'message': f"Error generating screenshots: {e}"}), 500
    stop = time.time()
    return jsonify({
        'message': "Screenshots created successfully",
        'screenshots': screenshots_urls,
        'execution_time': stop - start
    }), 200

import logging

logging.basicConfig(level=logging.DEBUG)

def extract_time_from_filename(filename):
  match = re.search(r'(\d{2})m(\d{2})s(\d{3})ms', filename)
  if match:
    minutes = int(match.group(1))
    seconds = int(match.group(2))
    milliseconds = int(match.group(3))
    total_seconds = minutes * 60 + seconds + milliseconds / 1000
    return total_seconds
  return 0

@routes_bp.route('/generate_notes', methods=['POST'])
def generate_notes():
    data = request.get_json()
    video_path = data.get('video_path')
    options = data.get('options')
    screenshots= data.get('screenshots')
    if not video_path:
       return jsonify({'message': "No video file path provided"}), 400

    transcription_precision = "base"
    try:
        logging.debug(f"Received video_path: {video_path}")
        formatted_transcription = []


        if options['transcription']:
            logging.debug("Transcription is enabled.")
            transcription_result = transcribe_video(video_path, transcription_precision)
            if options['diarization']:
                logging.debug("Diarization is enabled.")
                diarization_result = diarize_audio(video_path)
                transcriptions = format_transcription_with_speakers(transcription_result, diarization_result)
                for trans in transcriptions:
                    formatted_transcription.append({"text": trans['text'], "time": trans['start']})
            else:
                for trans in transcription_result:
                    formatted_transcription.append({"text": trans['text'], "time": trans['start']})

        if options['ocr'] and screenshots:
            logging.debug("OCR is enabled.")
            # Konwersja URL-i na lokalne ścieżki plików
            ocr_paths = [os.path.join(current_app.root_path, os.path.relpath(screenshot, request.host_url)) for screenshot in screenshots]
            
            # Usunięcie 'http://localhost:8080/' z URL-a, aby uzyskać lokalną ścieżkę
            ocr_paths = [screenshot.replace(request.host_url, '').replace('/', os.sep) for screenshot in screenshots]
            
            ocr_result = ocr_from_frames(ocr_paths)

            for i, screenshot in enumerate(screenshots):
                time = extract_time_from_filename(screenshot)
                formatted_transcription.append({"text": f"<p>OCR: {ocr_result[i]}</p>", "time": time})


        if options['screenshot'] and screenshots:
           logging.debug("Screenshot generation is enabled.")
           for screenshot in screenshots:
                time = extract_time_from_filename(screenshot)
                formatted_transcription.append({"text": '', "time": time, "screenshot": screenshot})
        
        # Sortowanie po czasie
        formatted_transcription.sort(key=lambda item: item['time'])
        
        logging.debug(f"Generated transcription: {formatted_transcription}")
        
        return jsonify({
            'message': "Notes generated successfully",
            'notes': formatted_transcription
        }), 200
    except Exception as e:
        logging.error(f"Error generating notes: {str(e)}")
        return jsonify({'message': f"Error: {e}"}), 500

    
@routes_bp.route('/generate_chat_notes', methods=['POST'])
def generate_chat_notes():
    print("generate_chat_notes")
    data = request.get_json()
    text= data.get('text')
    prompt = data.get('prompt')
    print("porpawnie wywołano funkcje")
    try:
        summary_result = summarize(str(text) + f"\nPrompt: {prompt}")
        return jsonify({
            'message': "Chat response generated succesfully",
            'notes': summary_result
        }), 200
    except Exception as e:
        print(f"\n\nError: {e}\n\n")
        return jsonify({'message': f"Error: {e}"}), 500