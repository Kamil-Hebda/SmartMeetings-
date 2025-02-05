# Smart Meetings

## Opis projektu
Smart Meetings to projekt zawierający w sobie wtyczkę umożliwiającą nagrywanie ekranu, a nawet twojej kary w przeglądarce w tle w raz z całym system backendowo-frontendowym umożliwiający szeroki zakres przetwarzania twojego spotkania do zwięzłych notatek według twoich wymagań (transkrypcja, OCR, wykrywanie mówców, streszczenie) wraz z ich automatycznym wysłaniem na wskazanego przez ciebie adresy email.  

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
