import whisper
from pyannote.audio import Pipeline
import torch
import torchaudio
from pyannote.audio import Audio
from pyannote.core import Segment
from pydub import AudioSegment
import os
import pathlib
import textwrap
import google.generativeai as genai

######### ze spekarami lekko przycięty jest tekst
from dotenv import load_dotenv
import os

load_dotenv()

# pobranie klucza API z pliku .env
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
hugging_face_auth_token = os.getenv("HUGGING_FACE_AUTH_TOKEN")

# Model diarization
pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1",
                                    use_auth_token=hugging_face_auth_token) # token do huggingface

def convert_mp3_webm_to_wav(input_path, output_path):
    """Konwertuje plik MP3 lub WEBM na WAV."""
    if input_path.endswith(".mp3"):
        audio = AudioSegment.from_mp3(input_path)
    elif input_path.endswith(".webm"):
        audio = AudioSegment.from_file(input_path, format="webm")
    else:
        raise ValueError("Unsupported file format. Only MP3 and WEBM are supported.")
    
    audio.export(output_path, format="wav")

def transcribe_video(video_path, transcription_precision):
    """Transkrybuje plik audio i zwraca informację o czasie rozpoczęcia poszczególnych segmentów.

    Args:
        video_path (str): Ścieżka do pliku audio.
        transcription_precision (str): Precyzja transkrypcji (np. 'base', 'small', 'medium', 'large').

    Returns:
        dict: Wynik transkrypcji (słownik).

    Raises:
        Exception: Jeśli wystąpi błąd podczas transkrypcji.
    """
    try:
        transcription_precision = "base" #"medium"
        model = whisper.load_model(transcription_precision)
        result = model.transcribe(video_path)
        
        # Zamieniamy listę segmentów na listę słowników z tekstem i czasem
        segments_with_time = [
          {"text": segment['text'], "start": segment['start']} for segment in result.get('segments', [])
        ]
        return segments_with_time

    except Exception as e:
        raise Exception(str(e))

def diarize_audio(audio_path, excerpt=None):
    """Przeprowadza diarizację (rozpoznawanie mówców) na pliku audio.

    Args:
        audio_path (str): Ścieżka do pliku audio.
        excerpt (Segment, opcjonalnie): Wycinek nagrania, jeśli diarizację ma być wykonana tylko na nim.

    Returns:
        pyannote.core.Annotation: Wynik diarizacji.

    Raises:
        Exception: Jeśli wystąpi błąd podczas diarizacji.
    """
    try:
        if (audio_path.endswith(".mp3")):
            wav_path = audio_path.replace(".mp3", ".wav")
            convert_mp3_webm_to_wav(audio_path, wav_path)
            audio_path = wav_path  # Przekazujemy nowy plik WAV
        elif (audio_path.endswith(".webm")):
            wav_path = audio_path.replace(".webm", ".wav")
            convert_mp3_webm_to_wav(audio_path, wav_path)
            audio_path = wav_path  # Przekazujemy nowy plik WAV

        diarization = pipeline(audio_path)

        return diarization
    except Exception as e:
        raise Exception(f"Błąd diarizacji pliku {audio_path}: {e}")

def format_transcription_with_speakers(transcription_result, diarization_result):
    """Łączy transkrypcję z informacjami o mówcach.

    Args:
        transcription_result (dict): Wynik transkrypcji.
        diarization_result (pyannote.core.Annotation): Wynik diarizacji.

    Returns:
        list: Sformatowana transkrypcja z informacjami o mówcach.
    """
    time_to_transcription = {segment['start']: segment for segment in transcription_result}
    sorted_segments_by_time = sorted(time_to_transcription.keys())

    formatted_transcription = []
    current_speaker = None

    for turn, _, speaker in diarization_result.itertracks(yield_label=True):
        start = turn.start
        end = turn.end
        segment_text = []
        for segment_time in sorted_segments_by_time:
            if start <= segment_time <= end:
                segment_text.append(time_to_transcription[segment_time]['text'])
        if segment_text:
            formatted_transcription.append({
                'text': f"Speaker {speaker}:\n " + " ".join(segment_text)+"\n\n",
                'start': start,
                'end': end
            })

    return formatted_transcription

def summarize(prompt):
    """Generuje streszczenie tekstu.

    Args:
        transcription (str): Tekst do streszczenia.

    Returns:
        str: Streszczenie tekstu.

    Raises:
        Exception: Jeśli wystąpi błąd podczas generowania streszczenia.
    """
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise Exception(str(e))


# summary_result = summarize("To jest testowy tekst do streszczenia.")
# print(summary_result)
# #video_path = "C:\\Users\\kamil\\Documents\\ProjektIO\\SmartMettings\\Czwarty wymiar jest dziwny.mp3"
# #video_path = "C:\\Users\\kamil\\Documents\\ProjektIO\\SmartMettings\\Potop W 2 Minuty.mp3"
# video_path = "C:\\Users\\kamil\\Documents\\ProjektIO\\SmartMettings\\Dialog, prawda i pojednanie.mp3"
# transcription_precision = "base"

# try:
#     # Transkrypcja
#     transcription_result = transcribe_video(video_path, transcription_precision)
#     transcription_text = transcription_result['text']
#     print("Transcription:")
#     print(transcription_text)

#     # Rozpoznawanie mówców
#     print("Przed diarizacją")
#     diarization_result = diarize_audio(video_path)

#     print("Diarization:")


#     # Formatowanie transkrypcji z uwzględnieniem mówców
#     formatted_transcription = format_transcription_with_speakers(transcription_result, diarization_result)
#     print("\nTranscription with Speakers:")
#     print(formatted_transcription)

#     # Streszczenie
#     summary_result = summarize(formatted_transcription)
#     print("\nSummary:")
#     print(summary_result)
# except Exception as e:
#     print(f"Error: {e}")