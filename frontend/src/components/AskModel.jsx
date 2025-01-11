import { useState} from 'react';
import { generate_chat_notes } from '../services/api';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import replacePolishChars from '../assets/fonts/sings_conventer';

// const CONVERT_KEY = process.env.CONVERT_API_KEY;
// let convertApi = ConvertApi.auth(CONVERT_KEY)
// console.log(CONVERT_KEY)

const AskModel = ({ notes, prompt }) => {
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Funkcja do wysyłania zapytania do chatu
  const handleAsk = async () => {
    if (!notes) {
      alert("Transkrypcja nie jest dostępna. Proszę poczekać na jej wygenerowanie.");
      return;
    }

    setLoading(true);
    try {
      // Wyślij zapytanie do serwera
       const response = await generate_chat_notes({
        text: notes, // Transkrypcja jako tekst
        prompt: prompt, // Użytkownik wpisuje prompt
    });
       
      // Otrzymana odpowiedź
      setChatResponse(response.data.notes);
    } catch (error) {
      console.error("Błąd podczas zapytania do chatu:", error.response ? error.response.data : error.message);
      setChatResponse("Wystąpił błąd. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  const downloadChatNotes = (format) => {
    if (format === 'pdf') {
      console.log(replacePolishChars);
      const pdf = new jsPDF();
      const margin = 10;
      const maxWidth = pdf.internal.pageSize.width - 2 * margin;
      const lines = pdf.splitTextToSize(replacePolishChars(chatResponse), maxWidth);
      pdf.setFont("helvetica", "normal");
      pdf.text(lines, margin, 10);
      pdf.save("chat_notes.pdf");
    } else {
      const element = document.createElement('a');
      const file = new Blob([chatResponse], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      element.href = URL.createObjectURL(file);
      element.download = `chat_notes.${format}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    setShowModal(false);
  };

  return (
    <div>
      {/* Warunek blokujący input jeśli brak transkrypcji */}
      <div>
        {!notes ? (
          <p>Transkrypcja nie jest dostępna. Proszę poczekać...</p>
        ) : (
          <div>
            {/*<textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Wpisz swoje zapytanie..."
              disabled={loading} // Disable input while loading
            />*/}
            <button onClick={handleAsk} disabled={loading || !prompt}>
              {loading ? 'Wysyłanie...' : 'Wyślij zapytanie'}
            </button>
          </div>
        )}
      </div>

      {/* Wyświetlanie odpowiedzi od modelu */}
      {chatResponse && (
        <div>
          <h3>Odpowiedź modelu:</h3>
          <p>{chatResponse}</p>
          <button onClick={() => setShowModal(true)}>
            Pobierz notatki
          </button>
        </div>
      )}
      { showModal && (
        <div className='modal'>
          <h3>Wybierz format notatek</h3>
          <button onClick={() => downloadChatNotes('pdf')}>PDF</button>
          <button onClick={() => downloadChatNotes('docx')}>DOCX</button>
          <button onClick={() => setShowModal(false)}>Anuluj</button>
        </div>
      )
      }
    </div>
  );
};
AskModel.propTypes = {
  notes: PropTypes.string,
  prompt: PropTypes.string,
};

export default AskModel;
