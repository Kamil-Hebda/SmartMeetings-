import whisper
import cohere
from pyannote.audio import Pipeline
import torch
import torchaudio
from pyannote.audio import Audio
from pyannote.core import Segment
from pydub import AudioSegment

######### ze spekarami lekko przycięty jest tekst
from dotenv import load_dotenv
import os

# ładowaine zmiennych środowiskowych
load_dotenv()

# pobranie klucza API z pliku .env
cohere_api_key = os.getenv("COHERE_API_KEY")
hugging_face_auth_token = os.getenv("HUGGING_FACE_AUTH_TOKEN")


co = cohere.Client(cohere_api_key)


# Model diarization
pipeline = Pipeline.from_pretrained("pyannote/speaker-diarization-3.1",
                                    use_auth_token=hugging_face_auth_token) # token do huggingface

def convert_mp3_to_wav(mp3_path, wav_path):
    """Konwertuje plik MP3 na WAV."""
    audio = AudioSegment.from_mp3(mp3_path)
    audio.export(wav_path, format="wav")

def transcribe_video(video_path, transcription_precision):
    """Transkrybuje plik audio.

    Args:
        video_path (str): Ścieżka do pliku audio.
        transcription_precision (str): Precyzja transkrypcji (np. 'base', 'small', 'medium', 'large').

    Returns:
        dict: Wynik transkrypcji (słownik).

    Raises:
        Exception: Jeśli wystąpi błąd podczas transkrypcji.
    """
    try:
        model = whisper.load_model(transcription_precision)
        result = model.transcribe(video_path)
        return result
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
            convert_mp3_to_wav(audio_path, wav_path)
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
        str: Sformatowana transkrypcja z informacjami o mówcach.
    """
    segments = transcription_result.get('segments', [])
    time_to_transcription = {segment['start']: segment for segment in segments}
    sorted_segments_by_time = sorted(time_to_transcription.keys())
    formatted_transcription = []
    current_speaker = None
    print("darizacja############################################################")
    for turn, _, speaker in diarization_result.itertracks(yield_label=True):
        start = turn.start
        end = turn.end
        segment_text = ""
        
        for segment_time in sorted_segments_by_time:
            if start <= segment_time <= end:
                segment_text += time_to_transcription[segment_time]['text']
    
        if speaker != current_speaker:
            formatted_transcription.append(f"\nMówca {speaker}: {segment_text}")
            current_speaker = speaker
        else:
            formatted_transcription.append(f"{segment_text}")

    return "".join(formatted_transcription)

def summarize(transcription):
    """Generuje streszczenie tekstu.

    Args:
        transcription (str): Tekst do streszczenia.

    Returns:
        str: Streszczenie tekstu.

    Raises:
        Exception: Jeśli wystąpi błąd podczas generowania streszczenia.
    """
    try:
        meet_data = transcription
        prompt = f'''Zrób streszczenie z tego tekstu, dodaj odpowiednie nagłówki i formatowanie, zawartość zwróć w formacie markdown. Oto tekst, z którego masz zrobić streszczenie: "{meet_data}".'''
        response = co.generate(
            model="command-r-plus-08-2024",
            prompt=prompt,
            max_tokens=1000
        )
        return response.generations[0].text
    except Exception as e:
        raise Exception(str(e))

#video_path = "C:\\Users\\kamil\\Documents\\ProjektIO\\SmartMettings\\Czwarty wymiar jest dziwny.mp3"
#video_path = "C:\\Users\\kamil\\Documents\\ProjektIO\\SmartMettings\\Potop W 2 Minuty.mp3"
video_path = "C:\\Users\\kamil\\Documents\\ProjektIO\\SmartMettings\\Dialog, prawda i pojednanie.mp3"
transcription_precision = "base"

try:
    # Transkrypcja
    transcription_result = transcribe_video(video_path, transcription_precision)
    transcription_text = transcription_result['text']
    print("Transcription:")
    print(transcription_text)

    # Rozpoznawanie mówców
    print("Przed diarizacją")
    diarization_result = diarize_audio(video_path)

    print("Diarization:")


    # Formatowanie transkrypcji z uwzględnieniem mówców
    formatted_transcription = format_transcription_with_speakers(transcription_result, diarization_result)
    print("\nTranscription with Speakers:")
    print(formatted_transcription)

    # Streszczenie
    summary_result = summarize(formatted_transcription)
    print("\nSummary:")
    print(summary_result)
except Exception as e:
    print(f"Error: {e}")