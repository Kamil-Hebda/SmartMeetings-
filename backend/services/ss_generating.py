import cv2
import os
import numpy as np
from concurrent.futures import ThreadPoolExecutor


def extract_frames(video_path, frame_rate=1):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Nie można otworzyć pliku wideo: {video_path}")
        return

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_interval = fps * frame_rate

    video_name = os.path.basename(video_path).split('/')[-1]
    ss_dir = mkdir_for_lecture(video_name)

    frame_count = 0
    saved_count = 0
    prev_frame = None

    executor = ThreadPoolExecutor(max_workers=4)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if prev_frame is None or is_significant_change(prev_frame, frame):
            time_in_seconds = frame_count / fps
            timestamp = format_time(time_in_seconds)

            frame_path = os.path.join(ss_dir, f'{timestamp}.jpg')
            executor.submit(save_frame_async, frame_path, frame)
            saved_count += 1
            prev_frame = frame

        frame_count += frame_interval
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_count)

    cap.release()
    executor.shutdown()


def format_time(seconds):
    minutes = int(seconds // 60)
    seconds = seconds % 60
    milliseconds = int((seconds % 1) * 1000)
    return f"{minutes:02d}m{int(seconds):02d}s{milliseconds:03d}ms"


def is_significant_change(frame1, frame2, threshold=18000000):
    diff = cv2.absdiff(frame1, frame2)
    diff_sum = np.sum(diff)
    print(diff_sum)
    return diff_sum > threshold


def mkdir_for_lecture(video_name):
    new_dir = 'screenshots/' + video_name.split('.')[0]
    os.makedirs(new_dir, exist_ok=True)
    return new_dir


def save_frame_async(path, frame):
    cv2.imwrite(path, frame)


