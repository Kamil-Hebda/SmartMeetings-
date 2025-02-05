import cv2
import os
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import quote  # Import funkcji quote
import shutil
from skimage.metrics import structural_similarity as ssim



def extract_frames(video_path):
    video_name = os.path.basename(video_path)
    ss_dir = mkdir_for_lecture(video_name)
    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise Exception(f"Nie można otworzyć pliku wideo: {video_path}")

    prev_frame = None
    frame_count = 0
    frame_skip = 15  # Przetwarzanie co 15 klatek

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_skip == 0:
            if prev_frame is None or is_significant_change(prev_frame, frame):
                frame_time = cap.get(cv2.CAP_PROP_POS_MSEC) / 1000.0
                frame_filename = os.path.join(ss_dir, f"{format_time(frame_time)}.jpg")
                cv2.imwrite(frame_filename, frame)
                prev_frame = frame

        frame_count += 1

    cap.release()
    print(f"Zapisano {frame_count // frame_skip} zrzutów ekranu do katalogu {ss_dir}")
    return ss_dir


def format_time(seconds):
    minutes = int(seconds // 60)
    seconds = seconds % 60
    milliseconds = int((seconds % 1) * 1000)
    return f"{minutes:02d}m{int(seconds):02d}s{milliseconds:03d}ms"

def resize_frame(frame, width=640):
    height = int(frame.shape[0] * (width / frame.shape[1]))
    return cv2.resize(frame, (width, height))

def is_significant_change(frame1, frame2, threshold=0.7):
    if frame1 is None or frame2 is None:
        print("Jedna z ramek jest pusta.")
        return False

    # Zmniejszenie rozdzielczości klatek
    frame1 = resize_frame(frame1)
    frame2 = resize_frame(frame2)

    gray_frame1 = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)
    gray_frame2 = cv2.cvtColor(frame2, cv2.COLOR_BGR2GRAY)
    ssim_value, _ = ssim(gray_frame1, gray_frame2, full=True)
    print(f"SSIM: {ssim_value}")
    return ssim_value < threshold


def mkdir_for_lecture(video_name):
    base_dir = 'static/screenshots/'# lub / przed

    new_dir_name = video_name.split('.')[0].replace(" ", "_")
    new_dir = os.path.join(base_dir, new_dir_name)
    
    # Usuń stary folder, jeśli istnieje
    old_dir_name_with_space = video_name.split('.')[0]
    old_dir_with_space = os.path.join(base_dir, old_dir_name_with_space)
    
    if os.path.exists(old_dir_with_space):
        shutil.rmtree(old_dir_with_space)

    os.makedirs(new_dir, exist_ok=True)
    return new_dir


def save_frame_async(path, frame):
    cv2.imwrite(path, frame)