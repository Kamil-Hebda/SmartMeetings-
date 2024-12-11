from flask_cors import CORS
from flask import Flask, request, jsonify, render_template
import whisper
import cohere

co = cohere.Client("8Qf5d4Kl0WjCJ2DXCwWzcLZRzceN1I71yytMxVRL")


def transcribe_video(video_path, transcription_precision):
    try:
        model = whisper.load_model(transcription_precision)# basic- najprostszy model, small- model z większą ilością warstw, large- model z największą ilością warstw
        result = model.transcribe(video_path)
        return result
    except Exception as e:
        raise Exception(str(e))
    
#"C:\\Users\\kamil\\Documents\\ProjektIO\\SmartMettings\\Potop W 2 Minuty.mp3"
def summarize(transcription):
    try:
        meet_data=transcription
        prompt=f'''Summarize the following text "{meet_data}".'''
        response = co.generate( model="command-r-plus-08-2024",\
        prompt=prompt, max_tokens=200\
        )

        return response.generations[0].text
    except Exception as e:
        raise Exception(str(e))

        

@app.route('/transcription', methods=['POST'])
def create_transcription():
    try:
        data = request.get_json()
        video_id = data['video_id']
        video_path = data['video_path']
        transcription_precision= data['transcription_precision']
        transcription = transcribe_video(video_path, transcription_precision)['text']
        summary = summarize(transcription)

        if data is None:
            return jsonify({'error': 'No data provided'})
        if 'video_id' not in data:
            return jsonify({'error': 'No video_id provided'})
        if 'video_path' not in data:
            return jsonify({'error': 'No video_path provided'})
        
        return jsonify({'transcription': transcription, 'summary': summary})
    except Exception as e:
        return jsonify({'error': str(e)})

"""video_path = "C:\\Users\\kamil\\Documents\\ProjektIO\\SmartMettings\\Potop W 2 Minuty.mp3"
transcription_precision = "base"

try:
    transcription_result = transcribe_video(video_path, transcription_precision)
    transcription_text = transcription_result['text']
    print("Transcription:")
    print(transcription_text)

    summary_result = summarize(transcription_text)
    print("\nSummary:")
    print(summary_result)
except Exception as e:
    print(f"Error: {e}")"""