
# Uruchomienie aplikacji

<br>

## Instalacja aplikacji

### Pobranie repozytorium
```bash
git clone https://github.com/Kamil-Hebda/SmartMeetings-.git
```

### Instalacja rozszerzenia do Chrome

1. Otwórz Chrome lub przeglądarkę pochodną do niej.
2. Wpisz `chrome://extensions` w pasku adresu i naciśnij Enter.
3. Włącz tryb deweloperski (przycisk w prawym górnym rogu).
4. Kliknij "Załaduj rozpakowane".
5. Wskaż folder `wtyczka` w katalogu repozytorium.
6. Rozszerzenie pojawi się w sekcji extension twojej przeglądarki

<br>

## Konfiguracja środowiska

### Tworzenie i aktywacja środowiska wirtualnego

```bash
python -m venv env
source env/bin/activate  # Linux/macOS
env\Scripts\activate  # Windows
```

### Instalacja pliku z zaleźnościami

```bash
cd backend/
pip install -r requirements.txt
```

### Plik konfiguracyjny .env

Uzyskaj klucze API i utwórz plik `.env` w `backend/flask_api`:

```ini
GOOGLE_API_KEY=<klucz do LLM z StudioAI>
HUGGING_FACE_AUTH_TOKEN=<Klucz uwirzytelniający z huggingface>
SEND_IN_BLUE_API_KEY=<klucz z brevo do wysyłania notatek>
CLIENT_ID=<>
CLIENT_SECRET=<>
REDIRECT_URI=http://localhost
TOKEN_URI=<id urzytkowanika z Google Calander>
AUTH_URI=<uwierzytelnie api Google Calender>
```

### Jak pobrać klucze API:
* Załóż konto i utwórz darmowy klucz (ograniczona liczba użyć- wystarczająca do samodzielnego użytku):  
   * **Google Api key** przejdź na stronę -> [Gemini Ai for Developers](https://ai.google.dev/).
   * **Send in Blue API key** przejdź na stronę -> [Brevo](https://app.brevo.com).
   * **Hugging Face Api key** przejdź na stronę -> [Hugging Face](https://huggingface.co/settings/tokens).

* Aby skonfigurować integrację z Google Calendar, wykonaj następujące kroki:
**Uzyskanie Client ID, Client Secret, Token URI, Auth URI:**
   - Przejdź na stronę **[Google Cloud Console](https://console.cloud.google.com/apis/credentials)**.
   - W zakładce **Enabled APIs & Services** dodaj **Google Calendar API**.
   - W zakładce **Credentials** utwórz nowe poświadczenia **OAuth 2.0 Client ID**.
   - Pobierz plik **client_secrets.json**, który zawiera wymagane klucze.
* Aby pozyskać dostęp do diaryzacji trzeba przejść na stronę [Hugging Face - diaryzacja](https://huggingface.co/pyannote/segmentation-3.0) i zakceptować warunki korzystania z modelu.
* **Redirect URI** w naszej aplikacji domyślnie jest to http://localhost:8080/
  

## Uruchomienie serwera Flask

1. Przejdź do katalogu backendu:
   ```bash
   cd backend/flask_api
   ```
2. Uruchom serwer Flask:
   ```bash
   python3 app.py
   ```

## Uruchomienie serwera deweloperskiego Vite

1. Przejdź do katalogu frontendu:
   ```bash
   cd frontend
   ```
2. Zainstaluj zależności (jeśli jeszcze nie są zainstalowane):
   ```bash
   npm install
   ```
3. Aby wygenerować statyczne pliki produkcyjne:
   ```bash
   npm run build
   ```
4. Uruchom serwer deweloperski:
   ```bash
   npm run dev
   ```
5. Otwórz przeglądarkę i przejdź do:
   ```
   http://localhost:5173/
   ```

