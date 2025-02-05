# Dokumentacja frontend

## Opis Ogólny

Frontend został stworzony przy użyciu React i Vite, która umożliwia inteligentne zarządzanie spotkaniami.

## Struktura Katalogów
```
frontend/
├── .vite/               # Katalog generowany przez Vite (nie edytować ręcznie)
├── dist/                # Katalog z buildem projektu (nie edytować ręcznie)
├── node_modules/        # Katalog z zależnościami npm (nie edytować ręcznie)
├── public/              # Statyczne zasoby (obrazy, favicon)
│   └── vite.svg         # Ikona Vite
└── src/
    ├── assets/          # Obrazy i inne zasoby wizualne
    │   └── fonts/       # Czcionki
    ├── components/      # Komponenty React
    │   ├── AddEvent.jsx         # Komponent dodawania wydarzenia do kalendarza
    │   ├── AskModel.jsx         # Komponent do zadawania pytań modelowi językowemu
    │   ├── EmailSender.jsx      # Komponent wysyłania notatek mailem
    │   ├── EventCalendar.jsx    # Komponent wyświetlania kalendarza wydarzeń
    │   ├── FileDownloader.jsx   # Komponent pobierania plików w różnych formatach
    │   ├── FileUpload.jsx       # Komponent przesyłania plików wideo
    │   ├── NotesDisplay.jsx     # Komponent wyświetlania i generowania notatek
    │   └── ScreenshotSelector.jsx  # Komponent wyboru zrzutów ekranu
    ├── pages/            # Komponenty reprezentujące strony
    │   └── Home.jsx      # Strona główna aplikacji
    ├── services/         # Serwisy do komunikacji z API
    │   └── api.js        # Konfiguracja API i funkcje do komunikacji z backendem
    ├── utils/            # Funkcje pomocnicze
    │   └── sings_conventer.js  # Konwerter polskich znaków
    ├── App.jsx           # Główny komponent aplikacji
    ├── App.css           # Style dla głównego komponentu
    ├── index.css         # Globalne style
    ├── main.jsx          # Punkt wejścia aplikacji
├── .eslintrc.js          # Konfiguracja ESLint
├── index.html            # Główny plik HTML
├── package-lock.json     # Plik blokady wersji zależności
├── package.json          # Plik manifestu projektu (dependencies, scripts)
└── vite.config.js        # Konfiguracja Vite
```

## Technologie Użyte

*   **React:** Biblioteka JavaScript do budowania interfejsów użytkownika.
*   **Vite:** Narzędzie do budowania i szybkiego uruchamiania aplikacji frontendowych.
*   **React Router:** Biblioteka do zarządzania routingiem w aplikacji React.
*   **Material UI:** Biblioteka komponentów UI oparta na Material Design.
*   **Axios:** Biblioteka do wykonywania zapytań HTTP do API.
*   **React Quill:** Edytor tekstu WYSIWYG dla React.
*   **jsPDF, html2canvas, Turndown:** Biblioteki do generowania PDF, konwersji HTML na obraz, oraz konwersji HTML na Markdown.
*   **date-fns, react-big-calendar:** Biblioteki do obsługi dat i kalendarza.

## Komponenty

### Komponenty Główne (Pages)

*   **`Home.jsx` (src/pages):**
    *   Sercem aplikacji, zarządza przepływem pracy: od przesłania wideo, przez generowanie notatek i interakcję z modelem językowym, aż po planowanie spotkań. Koordynuje działanie innych komponentów i przechowuje kluczowy stan aplikacji. Z uwagi na złożoność wymaga refaktoryzacji.

### Komponenty UI (Components)

*   **`AddEvent.jsx` (src/components):**
    *   Umożliwia użytkownikowi utworzenie nowego wydarzenia w kalendarzu Google, oferując formularz do wprowadzenia szczegółów spotkania (tytuł, daty, uczestnicy, opis).

*   **`AskModel.jsx` (src/components):**
    *   Pozwala na zadawanie pytań do modelu językowego (np. GPT) na podstawie wygenerowanych notatek, wyświetlając wynik w edytorze ReactQuill i umożliwiając jego pobranie.

*   **`FileDownloader.jsx` (src/components):**
    *   Dostarcza funkcjonalność pobierania treści (notatek, odpowiedzi modelu) w różnych formatach (PDF, HTML, Markdown), wykorzystując odpowiednie biblioteki do konwersji.


*   **`EmailSender.jsx` (src/components):**
    *   Implementuje wieloetapowy proces wysyłania notatek mailem, włączając w to weryfikację adresu e-mail użytkownika oraz możliwość dodawania wielu odbiorców i załączników.

*   **`EventCalendar.jsx` (src/components):**
    *   Wyświetla kalendarz wydarzeń pobranych z Google Calendar. Prezentuje spotkania w czytelny sposób, wykorzystując bibliotekę `react-big-calendar`.

*   **`FileUpload.jsx` (src/components):**
    *   Umożliwia użytkownikowi przesłanie pliku wideo, inicjując proces generowania notatek.

*   **`NotesDisplay.jsx` (src/components):**
    *   Jest centralnym punktem generowania notatek: pozwala użytkownikowi na skonfigurowanie opcji (transkrypcja, OCR, zrzuty ekranu), wyświetla wygenerowane notatki w edytorze ReactQuill, umożliwiając ich edycję i pobranie, oraz oferuje wybór zrzutów ekranu (jeśli włączone).

*   **`ScreenshotSelector.jsx` (src/components):**
    *   Umożliwia interaktywny wybór zrzutów ekranu, które mają zostać dołączone do generowanych notatek.

## Serwisy (Services)

*   **`api.js` (src/services):**
    *   Zawiera konfigurację API (adres URL) oraz funkcje do komunikacji z backendem.
    *   Wykorzystuje bibliotekę `axios` do wykonywania zapytań HTTP.
    *   Dostępne funkcje API:
        *   `uploadVideo`: Przesyła plik wideo na serwer.
        *   `generateNotes`: Generuje notatki na podstawie wideo i wybranych opcji.
        *   `generateScreenshots`: Generuje zrzuty ekranu z wideo.
        *   `generate_chat_notes`: Generuje odpowiedź czatu na podstawie promptu i notatek.
        *   `generateCode`, `verifyCode`: Obsługa weryfikacji email przy wysyłaniu notatek
        *   `createEvent`, `listEvents`: Obsługa wydarzeń w kalendarzu google.

## Konfiguracja

*   **`package.json`:** Plik manifestu projektu, który zawiera informacje o nazwie, wersji, zależnościach i skryptach uruchomieniowych.
*   **`vite.config.js`:** Plik konfiguracyjny Vite, który określa opcje budowania, takie jak port serwera, aliasy importów i inne.
*   **.eslintrc.js:** Konfiguracja ESLint, która ustala zasady lintingu kodu JavaScript.

## Uruchomienie Projektu

1.  Zainstaluj zależności: `npm install`
2.  Uruchom serwer deweloperski: `npm run dev`
3.  Otwórz aplikację w przeglądarce: `http://localhost:5173` (adres może się różnić w zależności od konfiguracji Vite)
