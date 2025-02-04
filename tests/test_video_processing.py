import unittest
import os
import numpy as np
import cv2
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from unittest.mock import patch, MagicMock
from backend.services.ss_generating import extract_frames, format_time, is_significant_change, mkdir_for_lecture, save_frame_async


class TestVideoProcessing(unittest.TestCase):
    
    @patch("cv2.VideoCapture")
    def test_extract_frames(self, mock_video_capture):
        """Test funkcji extract_frames z mockowaniem VideoCapture."""
        mock_cap = MagicMock()
        mock_video_capture.return_value = mock_cap
        
        mock_cap.isOpened.side_effect = [True, True, False]  # 2 iteracje
        mock_cap.read.side_effect = [(True, np.zeros((100, 100, 3), dtype=np.uint8)), (False, None)]
        mock_cap.get.side_effect = lambda x: 30 if x == cv2.CAP_PROP_FPS else 10  # 30 FPS, 10 klatek
        
        with patch("backend.services.ss_generating.mkdir_for_lecture", return_value="test_dir"), \
             patch("backend.services.ss_generating.save_frame_async") as mock_save_frame:
            
            result = extract_frames("test_video.mp4", frame_rate=1)
            
            self.assertEqual(result, "test_dir")
            mock_save_frame.assert_called()

    def test_format_time(self):
        """Test poprawnego formatowania czasu."""
        self.assertEqual(format_time(65.34), "01m05s340ms")
        self.assertEqual(format_time(0), "00m00s000ms")
        self.assertEqual(format_time(3601.123), "60m01s123ms")
    
    def test_is_significant_change(self):
        """Test wykrywania znaczącej zmiany między dwoma klatkami."""
        frame1 = np.zeros((100, 100, 3), dtype=np.uint8)
        frame2 = np.full((100, 100, 3), 255, dtype=np.uint8)  # Całkowita różnica
        self.assertTrue(is_significant_change(frame1, frame2, threshold=100000))
        self.assertFalse(is_significant_change(frame1, frame1, threshold=100000))
    
    @patch("os.makedirs")
    @patch("shutil.rmtree")
    def test_mkdir_for_lecture(self, mock_rmtree, mock_makedirs):
        """Test poprawnego tworzenia folderów dla wideo."""
        with patch("os.path.exists", return_value=True):
            result = mkdir_for_lecture("example video.mp4")
            mock_rmtree.assert_called_once()
        
        expected_dir = "static/screenshots/example_video"
        self.assertEqual(result, expected_dir)
        mock_makedirs.assert_called_with(expected_dir, exist_ok=True)
    
    @patch("cv2.imwrite")
    def test_save_frame_async(self, mock_imwrite):
        """Test asynchronicznego zapisywania klatek."""
        frame = np.zeros((100, 100, 3), dtype=np.uint8)
        save_frame_async("test_path.jpg", frame)
        mock_imwrite.assert_called_with("test_path.jpg", frame)

if __name__ == "__main__":
    unittest.main()
