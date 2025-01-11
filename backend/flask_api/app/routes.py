from flask import Blueprint, request, jsonify, current_app
import os
import time

from backend.services.ss_generating import extract_frames
from backend.services.transcirption_summary import transcribe_video, diarize_audio, format_transcription_with_speakers, summarize
from backend.services.OCR_text_generating import ocr_from_frames

routes_bp = Blueprint('routes', __name__)

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
        screenshots = [os.path.join(screenshots_dir, f) for f in os.listdir(screenshots_dir)]
    except Exception as e:
        current_app.logger.error(f"Error generating screenshots: {e}", exc_info=True)
        return jsonify({'message': f"Error generating screenshots: {e}"}), 500
    stop = time.time()
    return jsonify({
        'message': "Screenshots created successfully",
        'screenshots': screenshots,
        'execution_time': stop - start
    }), 200



import logging

logging.basicConfig(level=logging.DEBUG)

@routes_bp.route('/generate_notes', methods=['POST'])
def generate_notes():
    data = request.get_json()
    video_path = data.get('video_path')
    options = data.get('options')
    if not video_path:
       return jsonify({'message': "No video file path provided"}), 400

    transcription_precision = "base"
    try:
        logging.debug(f"Received video_path: {video_path}")
        formatted_transcription = ""

        if options['transcription']:
            logging.debug("Transcription is enabled.")
            transcription_result = transcribe_video(video_path, transcription_precision)
            transcription_text = transcription_result['text']
            if options['diarization']:
                logging.debug("Diarization is enabled.")
                diarization_result = diarize_audio(video_path)
                formatted_transcription = format_transcription_with_speakers(transcription_result, diarization_result)
            else:
                formatted_transcription = transcription_text

        if options['ocr']:
            logging.debug("OCR is enabled.")
            screenshots_dir = extract_frames(video_path)
            ocr_result = ocr_from_frames(screenshots_dir)
            formatted_transcription += str(ocr_result)

        if options['screenshot']:
            logging.debug("Screenshot generation is enabled.")
            screenshots_dir = extract_frames(video_path)
            formatted_transcription += f"\n\nScreenshots:\n{screenshots_dir}"

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