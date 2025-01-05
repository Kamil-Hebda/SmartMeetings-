from flask import Blueprint, render_template, request, current_app, redirect, url_for
import os
import time

from backend.services.ss_generating import extract_frames

routes_bp = Blueprint('routes', __name__)


@routes_bp.route('/', methods=['GET'])
def index():
    return render_template('main_service.html')


@routes_bp.route('/upload_video', methods=['POST'])
def upload_video():
    if 'video_file' not in request.files:
        return redirect(url_for('routes.notes', message="No file part"))

    file = request.files['video_file']

    if file.filename == '':
         return redirect(url_for('routes.notes', message="No file selected"))

    if file:
        upload_folder = os.path.join(current_app.root_path, 'uploads')
        os.makedirs(upload_folder, exist_ok=True)

        file_path = os.path.join(upload_folder, file.filename)
        file.save(file_path)

        return render_template('main_service.html', message="File uploaded successfully!", video_path=file_path)
    return render_template('main_service.html', message="Upload failed")


@routes_bp.route('/generate_screenshots', methods=['GET','POST'])
def generate_screenshots():
    video_path = request.form.get('video_path')

    if not video_path:
        return render_template('main_service.html', message="No video file path provided"), 400

    start = time.time()
    try:
        screenshots_dir = extract_frames(video_path)
    except Exception as e:
        return render_template('main_service.html', message=f"Error generating screenshots: {e}"), 500
    stop = time.time()
    return render_template('main_service.html',
                           message="Screenshots created succesfully",
                           screenshots_dir=screenshots_dir,
                           execution_time= stop - start,
                           video_path=video_path)


