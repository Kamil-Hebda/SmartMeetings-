import unittest
import os
from unittest.mock import patch, MagicMock
from backend.services.transcirption_summary import (
    convert_mp3_webm_to_wav, transcribe_video, diarize_audio,
    format_transcription_with_speakers, summarize
)


class TestAudioProcessing(unittest.TestCase):

    @patch("backend.services.transcirption_summary.AudioSegment.from_mp3")
    @patch("backend.services.transcirption_summary.AudioSegment.from_file")
    def test_convert_mp3_webm_to_wav(self, mock_from_file, mock_from_mp3):
        """Test konwersji MP3 i WEBM do WAV."""
        mock_audio = MagicMock()
        mock_from_mp3.return_value = mock_audio
        mock_from_file.return_value = mock_audio

        convert_mp3_webm_to_wav("test.mp3", "output.wav")
        mock_from_mp3.assert_called_once_with("test.mp3")
        mock_audio.export.assert_called_once_with("output.wav", format="wav")

        convert_mp3_webm_to_wav("test.webm", "output.wav")
        mock_from_file.assert_called_once_with("test.webm", format="webm")

    @patch("backend.services.transcirption_summary.whisper.load_model")
    def test_transcribe_video(self, mock_load_model):
        """Test transkrypcji audio."""
        mock_model = MagicMock()
        mock_load_model.return_value = mock_model
        mock_model.transcribe.return_value = {
            "segments": [{"text": "Hello world", "start": 0.0}]
        }

        result = transcribe_video("test.wav", "base")
        expected = [{"text": "Hello world", "start": 0.0}]
        self.assertEqual(result, expected)
        mock_load_model.assert_called_once_with("base")

    @patch("backend.services.transcirption_summary.pipeline")
    def test_diarize_audio(self, mock_pipeline):
        """Test diarizacji audio."""
        mock_pipeline.return_value = "Mocked Diarization Result"

        result = diarize_audio("test.wav")
        self.assertEqual(result, "Mocked Diarization Result")
        mock_pipeline.assert_called_once_with("test.wav")

    def test_format_transcription_with_speakers(self):
        """Test formatowania transkrypcji z informacjami o mówcach."""
        transcription = [{"text": "Hello", "start": 0.0}]
        diarization = MagicMock()
        diarization.itertracks.return_value = [
            (MagicMock(start=0.0, end=5.0), None, "Speaker 1")
        ]

        result = format_transcription_with_speakers(transcription, diarization)
        expected = [{"text": "Speaker Speaker 1: Hello", "start": 0.0, "end": 5.0}]
        self.assertEqual(result, expected)

    @patch("backend.services.transcirption_summary.genai.GenerativeModel")
    @patch("backend.services.transcirption_summary.genai.configure")
    def test_summarize(self, mock_configure, mock_model):
        """Test generowania streszczenia przez Google Gemini API."""
        mock_model_instance = MagicMock()
        mock_model.return_value = mock_model_instance
        mock_model_instance.generate_content.return_value.text = "Summary text"

        result = summarize("Test input text")
        self.assertEqual(result, "Summary text")
        mock_configure.assert_called_once_with(api_key=os.getenv("GOOGLE_API_KEY"))


if __name__ == "__main__":
    unittest.main()