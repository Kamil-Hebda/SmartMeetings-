import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import NotesDisplay from '../components/NotesDisplay';
import '../App.css';
import AskModel from '../components/AskModel';

/**
 * Komponent Home:
 * - Zarządza stanem potrzebnym do obsługi przesłanego wideo, notatek oraz dodatkowych opcji (checkboxy).
 * - Wyświetla dwa główne komponenty:
 *   1) FileUpload – umożliwia przesłanie pliku wideo,
 *   2) NotesDisplay – generuje notatki zgodnie z zaznaczonymi opcjami.
 */
const Home = () => {
  /**
   * videoPath: przechowuje aktualną ścieżkę do przesłanego wideo.
   */
  const [videoPath, setVideoPath] = useState(null);

  /**
   * message: przechowuje komunikat zwracany po wygenerowaniu notatek.
   * Może to być np. status, błąd lub inna informacja.
   */
  const [message, setMessage] = useState(null);

  /**
   * options: obiekt zawierający wybrane opcje przez użytkownika,
   * np. transcription, ocr, screenshot, diarization – wszystkie typu boolean.
   */
  const [options, setOptions] = useState({
    transcription: false,
    ocr: false,
    screenshot: false,
    diarization: false
  });

  /**
   * prompt: przechowuje dodatkowy tekst (kontekst) do wygenerowania notatek.
   */
  const [prompt, setPrompt] = useState('');

  const[notes, setNotes] = useState('');

  /**
   * Funkcja handleFileUpload:
   * - Wywoływana po udanym wgraniu pliku przez komponent FileUpload.
   * - Ustawia w stanie ścieżkę do wideo, którą zwraca serwer.
   */
  const handleFileUpload = (path) => {
    setVideoPath(path);
  };

  /**
   * Funkcja handleNotesUpdate:
   * - Wywoływana przez komponent NotesDisplay.
   * - Odbiera komunikat (np. błąd lub status) i ustawia go w stanie message.
   */
  const handleNotesUpdate = (data) => {
    setMessage(data.message);
    setNotes(data.notes);
  };

  /**
   * Funkcja handleOptionChange:
   * - Obsługuje zaznaczanie/odznaczanie opcji w checkboxach.
   * - Aktualizuje stan (options), zależnie od nazwy checkboxa i wartości zaznaczenia.
   */
  const handleOptionChange = (e) => {
    const { name, checked } = e.target;
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: checked
    }));
  };

  /**
   * W części JSX:
   * - Wyświetlamy nagłówek Smart Meetings.
   * - Gdy message jest ustawione, renderujemy paragraf z komunikatem.
   * - Tworzymy układ z sekcją po lewej (textarea i checkboksy) oraz po prawej (FileUpload i NotesDisplay).
   */
  return (
    <div className="container">
      <h1>Smart Meetings</h1>
      {message && <p>{message}</p>}
      <div className="main-content">
        <div className="left-panel">
          <h2>Prompt for Chat</h2>
          <textarea
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="prompt-box"
          ></textarea>
          <AskModel notes={notes} prompt={prompt} />
        </div>
        <div className="right-panel">
          <div className="feature-box">
            <h2>Notes Options</h2>
            <div className="options">
              <label>
                <input
                  type="checkbox"
                  name="transcription"
                  onChange={handleOptionChange}
                /> Transcription
              </label>
              <label>
                <input
                  type="checkbox"
                  name="ocr"
                  onChange={handleOptionChange}
                /> OCR
              </label>
              <label>
                <input
                  type="checkbox"
                  name="screenshot"
                  onChange={handleOptionChange}
                /> Screenshot
              </label>
              <label>
                <input
                  type="checkbox"
                  name="diarization"
                  onChange={handleOptionChange}
                /> Diarization
              </label>
            </div>
            <FileUpload onUpload={handleFileUpload} />
            <NotesDisplay
              videoPath={videoPath}
              options={options}
              onUpdate={handleNotesUpdate}
            />
          </div>
          {/* <EmailSender exampleText='nie weim co to napiac' /> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
