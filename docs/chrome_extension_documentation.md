# Dokumentacja wtyczki Chrome do nagreywania ekranu i karty w tle

<br>

## Struktura Plików

### `popup.html`
Główny plik HTML definiujący interfejs użytkownika w postaci wyskakującego okienka (popup). Zawiera przyciski do uruchamiania różnych funkcji wtyczki oraz obszar na wyświetlanie komunikatów.

### `popup.js`
Plik JavaScript odpowiadający za obsługę interakcji użytkownika w popupie, takich jak kliknięcia przycisków, a także za komunikację z service workerem w celu uruchamiania funkcji nagrywania.

### `background/popup.js`
Odpowiadający za zachownie się wtyczki w momencie, kiedy karta jest przełączona, a nagrywanie jest kontynuowane.

### `service-worker.js`
Plik JavaScript działający w tle (service worker), który zarządza procesami nagrywania ekranu i karty, komunikuje się z popupem i innymi skryptami, a także obsługuje pobieranie nagranego wideo.

### `video.html`
Prosty plik HTML zawierający tylko skrypt JavaScript, który służy do odtworzenia nagranego wideo w nowej karcie.

### `video.js`
Skrypt JavaScript, który odbiera informacje o nagranym wideo i pobiera to wideo.

### `desktopRecord.js`
Skrypt JavaScript, który służy do obsługi zapisu ekranu.

### `desktopRecord.html`
Plik HTML dla skryptu `desktopRecord.js`.

### `offscreen.js`
Skrypt JavaScript do zapisywania karty.

### `offscreen.html`
Plik HTML dla skryptu `offscreen.js`.

### `background.js`
Starsza wersja service workera.

### `background/background.js`
Mechanizm nagrywania karty w czasie gdy wtyczka jest zamknięta (obsługa mechanizmu utraty sesji).

### `manifest.json`
Plik JSON zawierający metadane wtyczki, takie jak nazwa, opis, wersja, uprawnienia i skrypty działające w tle.

### `background/html2canvas.min.js`
Biblioteka JavaScript do generowania zrzutów ekranu z elementów HTML.

<br>

## Funkcjonalności Wtyczki

### Zapis Ekranu/Okna
Możliwość nagrywania wideo z całego ekranu użytkownika lub wybranego okna aplikacji.

### Zapis Karty
Możliwość nagrywania wideo z aktywnej karty przeglądarki.

### Zrzut Ekranu
Wykonanie zrzutu ekranu widocznej części aktywnej karty.

### Notatki do Spotkań
Przycisk "Przygotuj notatki" otwiera nową kartę z aplikacją do tworzenia notatek.

<br>

## Interfejs Użytkownika (Popup)

### Wyskakujące Okienko (Popup)
- Tytuł: "Smart Meetings"
- Cztery przyciski:
  - "Zrób screenshot"
  - "Nagraj bieżącą kartę"
  - "Nagraj Ekran"
  - "Przygotuj notatki"
- Obszar na wyświetlanie komunikatów (np. o błędach).

<br>

## Komunikacja

### Popup -> Service Worker
Popup wysyła wiadomości do service workera, aby uruchomić lub zatrzymać nagrywanie ("start-recording", "stop-recording").

### Service Worker -> Popup/Inne Skrypty
Service worker wysyła wiadomości do popupu lub innej karty z informacjami o nagranym wideo (URL do pobrania wideo) ("download").

### `desktopRecord.js` <-> `service-worker.js`
Komunikacja między skryptem do nagrywania ekranu a service workerem odbywa się za pomocą wysyłania oraz odbierania wiadomości.

### `offscreen.js` <-> `service-worker.js`
Komunikacja między skryptem nagrywania ekranu karty a service workerem.

<br>

## Uprawnienia

### `tabCapture`
Pozwala na przechwytywanie zawartości kart przeglądarki do nagrywania wideo.

### `offscreen`
Umożliwia tworzenie dokumentów pozaekranowych do obsługi nagrywania w tle.

### `scripting`
Pozwala na wstrzykiwanie skryptów do stron internetowych.

### `storage`
Umożliwia przechowywanie danych lokalnie (np. statusu nagrywania).

### `desktopCapture`
Pozwala na przechwytywanie zawartości ekranu.

### `tabs`
Umożliwia odczytywanie informacji o otwartych kartach.
