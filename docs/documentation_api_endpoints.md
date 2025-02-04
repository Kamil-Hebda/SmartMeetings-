# Dokumentacja API Endpoints

<br>

## 1. Sprawdzenie statusu API

#### Opis: Endpoint służy do sprawdzenia, czy API działa poprawnie.
#### Metoda: GET
#### URL: /

<br>
<br>

## 2. Przesyłanie pliku wideo

#### Opis: Endpoint służy do przesyłania pliku wideo na serwer.
#### Metoda: POST
#### URL: /upload_video
#### Nagłówek: Content-Type: multipart/form-data

#### Body:
```json
{
  "video_file": "plik_wideo.webm"
}
```

#### Zapytanie:
```json
POST /upload_video
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="video_file"; filename="meeting.webm"
```

#### Odpowiedź (sukces):
```json
{
  "message": "File uploaded successfully!",
  "video_path": "/uploads/meeting.webm"
}
```

#### Odpowiedź (błąd):
```json
{
  "message": "No file selected"
}
```
<br>
<br>

## 3. Generowanie zrzutów ekranu

#### Opis: Endpoint generuje zrzuty ekranu z przesłanego wideo.
#### Metoda: POST
#### URL: /generate_screenshots
#### Nagłówek: Content-Type: application/json

#### Body:
```json
{
  "video_path": "/uploads/meeting.webm"
}
```

#### Zapytanie:
```json
POST /generate_screenshots
Content-Type: application/json

{
  "video_path": "/uploads/meeting.webm"
}
```

#### Odpowiedź (sukces):
```json
{
  "message": "Screenshots created successfully",
  "screenshots": [
    {"path": "http://localhost:8080/uploads/screenshots/00m10s200ms.jpg"},
    {"path": "http://localhost:8080/uploads/screenshots/01m30s400ms.jpg"}
  ],
  "execution_time": 5.23
}
```

#### Odpowiedź (błąd):
```json
{
  "message": "No video file path provided"
}
```
<br>
<br>

## 4. Generowanie notatek

#### Opis: Endpoint generuje notatki na podstawie przesłanego wideo, zrzutów ekranu oraz opcji (transkrypcja, OCR, diarizacja).
#### Metoda: POST
#### URL: /generate_notes
#### Nagłówek: Content-Type: application/json

#### Body:
```json
{
  "video_path": "/uploads/meeting.webm",
  "options": {
    "transcription": true,
    "ocr": true,
    "screenshot": true,
    "diarization": true
  },
  "screenshots": [
    "http://localhost:8080/uploads/screenshots/00m10s200ms.jpg"
  ]
}
```

#### Zapytanie:
```json
POST /generate_notes
Content-Type: application/json

{
  "video_path": "/uploads/meeting.webm",
  "options": {
    "transcription": true,
    "ocr": true,
    "screenshot": true,
    "diarization": true
  },
  "screenshots": [
    "http://localhost:8080/uploads/screenshots/00m10s200ms.jpg"
  ]
}
```

#### Odpowiedź (sukces):
```json
{
  "message": "Notes generated successfully",
  "notes": [
    {"text": "Witam wszystkich na spotkaniu.", "time": 0},
    {"text": "<p>OCR: Projekt SmartMeetings</p>", "time": 10.2},
    {"text": "", "time": 30.5, "screenshot": "http://localhost:8080/uploads/screenshots/00m30s500ms.jpg"}
  ]
}
```

#### Odpowiedź (błąd):
```json
{
  "message": "Error: No video file path provided"
}
```
<br>
<br>

## 5. Generowanie streszczenia/podsumowania

#### Opis: Endpoint generuje podsumowanie notatek na podstawie tekstu i promptu.
#### Metoda: POST
#### URL: /generate_chat_notes
#### Nagłówek: Content-Type: application/json

#### Body:
```json
{
  "text": "To jest przykładowy tekst do podsumowania.",
  "prompt": "Podsumuj tekst w trzech punktach."
}
```

#### Zapytanie:
```json
POST /generate_chat_notes
Content-Type: application/json

{
  "text": "To jest przykładowy tekst do podsumowania.",
  "prompt": "Podsumuj tekst w trzech punktach."
}
```

#### Odpowiedź (sukces):
```json
{
  "message": "Chat response generated successfully",
  "notes": "1. Przykładowy punkt 1. 2. Przykładowy punkt 2. 3. Przykładowy punkt 3."
}
```

#### Odpowiedź (błąd):
```json
{
  "message": "Error: Invalid prompt"
}
```
<br>
<br>

## 6. Wysłanie kodu weryfikacyjne dla użytkownika przesyłającego raport.

#### Opis: Endpoint wysyła kod weryfikacyjny na podany adres e-mail.
#### Metoda: POST
#### URL: /generate_code
#### Nagłówek: Content-Type: application/json

#### Body:
```json
{
  "email": "anna@gmail.com"
}
```

#### Zapytanie:
```json
POST /generate_code
Content-Type: application/json

{
  "email": "anna@gmail.com"
}
```

#### Odpowiedź (sukces):
```json
{
  "message": "Code sent successfully"
}
```

#### Odpowiedź (błąd):
```json
{
  "message": "Error: No email provided"
}
```
<br>
<br>

## 7. Weryfikacja kodu uwierzytelniającego.

#### Opis: Endpoint weryfikuje kod wysłany na e-mail.
#### Metoda: POST
#### URL: /verify_code
#### Nagłówek: Content-Type: application/json

#### Body:
```json
{
  "email": "anna@gmail.com",
  "code": "123456"
}
```

#### Zapytanie:
```json
POST /verify_code
Content-Type: application/json

{
  "email": "anna@gmail.com",
  "code": "123456"
}
```

#### Odpowiedź (sukces):
```json
{
  "message": "Code is correct"
}
```

#### Odpowiedź (błąd):
```json
{
  "message": "Invalid code"
}
```
<br>
<br>

## 8. Wysłanie notatek na email.

#### Opis: Endpoint wysyła notatki na podane adresy e-mail.
#### Metoda: POST
#### URL: /send_notes
#### Nagłówek: Content-Type: multipart/form-data

#### Body:
```json
{
  "files": ["plik1.pdf", "plik2.txt"],
  "reciever": "[{'email': 'user1@example.com'}, {'email': 'user2@example.com'}]",
  "subject": "Notatki ze spotkania",
  "notes": "To są notatki ze spotkania."
}
```

#### Zapytanie:
```json
POST /send_notes
Content-Type: multipart/form-data

--boundary
Content-Disposition: form-data; name="files"; filename="plik1.pdf"

<binary data>
--boundary
Content-Disposition: form-data; name="reciever"

[{'email': 'user1@example.com'}, {'email': 'user2@example.com'}]
--boundary
Content-Disposition: form-data; name="subject"

Notatki ze spotkania
--boundary
Content-Disposition: form-data; name="notes"

To są notatki ze spotkania.
--boundary--
```

#### Odpowiedź (sukces):
```json
{
  "message": "Notes sent successfully"
}
```

#### Odpowiedź (błąd):
```json
{
  "message": "Error: Failed to send notes"
}
```
<br>
<br>

## 9. Pobieranie listy wydarzń z Google Calendar.

#### Opis: Endpoint zwraca listę nadchodzących wydarzeń z Google Calendar.
#### Metoda: GET
#### URL: /list_events

#### Zapytanie:
```json
GET /list_events
```

#### Odpowiedź (sukces):
```json
{
  "events": [
    {
      "summary": "Spotkanie projektowe",
      "start": "2024-07-28T10:00:00",
      "end": "2024-07-28T12:00:00"
    }
  ]
}
```

#### Odpowiedź (błąd):
```json
{
  "error": "Google Calendar authentication failed"
}
```
<br>
<br>

## 10. Tworzenie wydarzenia w Google Calendar.

#### Opis: Endpoint tworzy nowe wydarzenie w Google Calendar.
#### Metoda: POST
#### URL: /create_event
#### Nagłówek: Content-Type: application/json

#### Body:
```json
{
  "summary": "Spotkanie projektowe",
  "location": "Sala konferencyjna",
  "description": "Omówienie postępów projektu",
  "start_date": {
    "dateTime": "2024-07-28T10:00:00",
    "timeZone": "Europe/Warsaw"
  },
  "end_date": {
    "dateTime": "2024-07-28T12:00:00",
    "timeZone": "Europe/Warsaw"
  },
  "attendees": [
    {"email": "user1@example.com"},
    {"email": "user2@example.com"}
  ],
  "reminders": {
    "useDefault": true
  }
}
```

#### Zapytanie:
```json
POST /create_event
Content-Type: application/json

{
  "summary": "Spotkanie projektowe",
  "location": "Sala konferencyjna",
  "description": "Omówienie postępów projektu",
  "start_date": {
    "dateTime": "2024-07-28T10:00:00",
    "timeZone": "Europe/Warsaw"
  },
  "end_date": {
    "dateTime": "2024-07-28T12:00:00",
    "timeZone": "Europe/Warsaw"
  },
  "attendees": [
    {"email": "user1@example.com"},
    {"email": "user2@example.com"}
  ],
  "reminders": {
    "useDefault": true
  }
}
```

#### Odpowiedź (sukces):
```json
{
  "message": "Event created successfully",
  "event_link": "https://calendar.google.com/event?eid=123"
}
```

#### Odpowiedź (błąd):
```json
{
  "error": "Failed to create event"
}
```
<br>
<br>
