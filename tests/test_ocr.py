import unittest
import base64
import os
from unittest.mock import patch, MagicMock
from backend.services.OCR_text_generating import encode_image, ocr_from_frames


class TestOCR(unittest.TestCase):

    @patch("builtins.open", new_callable=unittest.mock.mock_open, read_data=b"fake_image_data")
    def test_encode_image(self, mock_open):
        """Testuje poprawność kodowania obrazu do Base64."""
        result = encode_image("fake_image.jpg")
        expected = base64.b64encode(b"fake_image_data").decode('utf-8')
        self.assertEqual(result, expected)
        mock_open.assert_called_once_with("fake_image.jpg", "rb")

    @patch("backend.services.OCR_text_generating.genai.GenerativeModel")
    @patch("backend.services.OCR_text_generating.genai.configure")
    def test_ocr_from_frames(self, mock_configure, mock_model):
        """Testuje funkcję OCR przy użyciu mockowania API Google Gemini."""
        mock_model_instance = MagicMock()
        mock_model.return_value = mock_model_instance
        mock_model_instance.generate_content.return_value.text = "<p>Tekst z obrazu</p>"

        fake_base64_img = base64.b64encode(b"fake_image_data").decode("utf-8")
        frames = ["frame1.jpg", "frame2.jpg"]
        with patch("backend.services.OCR_text_generating.encode_image", side_effect=[fake_base64_img, fake_base64_img]):
            result = ocr_from_frames(frames)

        expected_output = [
            "Klatka 1:\n<p>Tekst z obrazu</p>\n",
            "Klatka 2:\n<p>Tekst z obrazu</p>\n"
        ]

        self.assertEqual(result, expected_output)
        self.assertEqual(mock_model_instance.generate_content.call_count, 2)
        mock_configure.assert_called_once_with(api_key=os.getenv("GOOGLE_API_KEY"))


if __name__ == "__main__":
    unittest.main()
