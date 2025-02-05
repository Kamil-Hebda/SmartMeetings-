# Dokumentacja Testów Jednostkowych

## Spis Treści
1. [Testy Integracji z Google Calendar](#testy-integracji-z-google-calendar)
2. [Testy OCR](#testy-ocr)
3. [Testy Transkrypcji](#testy-transkrypcji)
4. [Testy Przetwarzania Wideo](#testy-przetwarzania-wideo)

---

## Testy Integracji z Google Calendar

**Lokalizacja:** `tests/test_calendar_integration.py`

### **Opis**
Testy sprawdzają poprawność:
- Generowania danych wydarzenia (`prepare_event_data`)
- Pobierania listy wydarzeń (`list_events`)
- Dodawania wydarzeń do Google Calendar (`add_event`)

### **Testowane funkcje:**
- `prepare_event_data(summary, location, description, start_date, end_date, attendees, reminders)`
- `list_events(service)`
- `add_event(service, event_data)`

### **Najważniejsze testy:**
- Sprawdzenie poprawności struktury danych zwracanych przez `prepare_event_data`
- Mockowanie API Google i testowanie listowania wydarzeń
- Mockowanie API Google i testowanie dodawania wydarzeń

---

## Testy OCR

**Lokalizacja:** `tests/test_ocr.py`

### **Opis**
Testy sprawdzają poprawność:
- Kodowania obrazów do Base64 (`encode_image`)
- Wywołania API Google Gemini do przetwarzania OCR (`ocr_from_frames`)

### **Testowane funkcje:**
- `encode_image(image_path)`
- `ocr_from_frames(frames)`

### **Najważniejsze testy:**
- Sprawdzenie poprawnego kodowania obrazów na Base64
- Mockowanie API Google Gemini i testowanie przetwarzania OCR
- Weryfikacja poprawnego przetwarzania kilku klatek obrazu

---

## Testy Transkrypcji

**Lokalizacja:** `tests/test_transcription.py`

### **Opis**
Testy sprawdzają poprawność:
- Konwersji plików MP3/WEBM do WAV (`convert_mp3_webm_to_wav`)
- Transkrypcji dźwięku (`transcribe_video`)
- Rozpoznawania mówców (`diarize_audio`)
- Formatowania transkrypcji z uwzględnieniem mówców (`format_transcription_with_speakers`)
- Generowania streszczeń przez API Google Gemini (`summarize`)

### **Testowane funkcje:**
- `convert_mp3_webm_to_wav(input_path, output_path)`
- `transcribe_video(video_path, transcription_precision)`
- `diarize_audio(audio_path)`
- `format_transcription_with_speakers(transcription_result, diarization_result)`
- `summarize(prompt)`

### **Najważniejsze testy:**
- Mockowanie `pydub.AudioSegment` i testowanie konwersji audio
- Mockowanie `whisper.load_model` i testowanie transkrypcji
- Mockowanie `pyannote.pipeline` i testowanie diarizacji
- Testowanie formatowania transkrypcji z przypisaniem mówców
- Mockowanie API Google Gemini i testowanie generowania streszczenia

---

## Testy Przetwarzania Wideo

**Lokalizacja:** `tests/test_video_processing.py`

### **Opis**
Testy sprawdzają poprawność:
- Ekstrakcji klatek z wideo (`extract_frames`)
- Formatowania czasu (`format_time`)
- Wykrywania zmian między klatkami (`is_significant_change`)
- Tworzenia katalogów (`mkdir_for_lecture`)
- Zapisywania klatek (`save_frame_async`)

### **Testowane funkcje:**
- `extract_frames(video_path, frame_rate=1)`
- `format_time(seconds)`
- `is_significant_change(frame1, frame2, threshold)`
- `mkdir_for_lecture(video_name)`
- `save_frame_async(path, frame)`

### **Najważniejsze testy:**
- Mockowanie `cv2.VideoCapture` i testowanie ekstrakcji klatek
- Testowanie poprawnego formatowania czasu
- Wykrywanie znaczących zmian między klatkami
- Sprawdzanie poprawności tworzenia katalogów dla wideo
- Sprawdzanie poprawnego zapisu klatek

---

## Jak Uruchomić Testy?


### **Uruchomienie ręczne (zalecane)**

### **Z `unittest`**
```bash
python -m unittest discover tests
```

---
