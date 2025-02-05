# Smart Meetings

## Opis projektu

**Smart Meetings** to kompleksowe rozwiązanie do nagrywania spotkań oraz ich automatycznego przetwarzania. Projekt obejmuje wtyczkę umożliwiającą nagrywanie ekranu lub wybranej karty przeglądarki w tle, a także pełny system backendowo-frontendowy. System oferuje zaawansowane funkcje przekształcania nagrań w zwięzłe notatki dostosowane do Twoich potrzeb, w tym:

- **Transkrypcję rozmów** – konwersja mowy na tekst.
- **OCR (rozpoznawanie tekstu ze zdjęć i prezentacji)**.
- **Wykrywanie mówców** – identyfikacja osób mówiących w nagraniu.
- **Generowanie streszczeń** – automatyczne podsumowanie kluczowych informacji.
- **Automatyczne wysyłanie notatek** – możliwość przesyłania podsumowania spotkania na wskazane adresy e-mail.
- **Generowanie zrzutów ekranu ze spotkania** – możliwość generowania screenshotów najważniejszych slajdów prezentacji.


## Dokumentacja
Cała dokumentacja projektu znajduje się w folderze `docs/`. W szczególności:

- **Inżynieria Wymagań**: Opis wszystkich wymagań funkcjonalnych i niefunkcjonalnych projektu.
- **Dokumentacja API**: Szczegółowy opis endpointów API backendu wraz z przykładami zapytań i odpowiedziami.
- **Dokumentacja testów jednostkowych**: Opis przetestowanych funkcjonalności aplikacji. 

## Struktura

- **backend/**: Zawiera kod backendu napisanego w Pythonie z wykorzystaniem frameworka Flask. Znajdują się tu również pliki konfiguracyjne.
- **frontend/**: Dynamiczny kod client side napisany przy pomocy biblioteki React.
- **wtyczka/**: Czyli rozszerzenie przeglądarki, napisany w JavaScript.
- **tests/**: Zawiera testy jednostkowe backendu.
- **docs/**: Dokumentacja projektu.

## Instrukcja Uruchomienia
Instrukcja uruchomienia znajduje się w `setup.md` w folderze `docs` i wymaga:

- Załadowanie wtyczki przeglądarki do przeglądarki Google Chrome (lub pochodnej) w celu poprawnego nagrywania karty w tle.
- Zainstalowaną lokalnie wersje najnoszego Pythona (dedykowane).
- Instalację zależności python z pliku requirements.txt.
- Wygenerowanie darmowych kluczy API.
- Konfigurację zmiennych środowiskowych.
- Uruchomienia serwera backendowego.
- Uruchomienie dynamicznego kodu frontendowego.

## Skrócony Stos Technologiczny
- **JS:** React, VanillaJS
- **CSS**
- **Python:** Flask, GenerativeAI, PyDub, Pyannote, Send in blue
- **Testy:** Unittest


## Członkowie zespołu
- [Kamil Hebda](https://github.com/Kamil-Hebda)
- [Paweł Klocek](https://github.com/PawelekKlocek)
- [Szymon Gaweł](https://github.com/gawelszymon)
