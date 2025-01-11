import { useState } from 'react';
import { generate_chat_notes } from '../services/api';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import replacePolishChars from '../assets/fonts/sings_conventer';
import TextField from '@mui/material/TextField';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AskModel = ({ notes }) => {
  const [prompt, setPrompt] = useState('');
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
      const response = await generate_chat_notes({
        text: notes,
        prompt: prompt,
      });

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
    <div className="left-panel">
      <div className="feature-box">
        <h2>Prompt for Chat</h2>
        {!notes && <p>Transkrypcja nie jest dostępna. Proszę poczekać na jej wygenerowanie, aby wpisać prompt.</p>}
        <TextField
          id="outlined-multiline-flexible"
          label="Prompt"
          multiline
          maxRows={4}
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="prompt-box"
          disabled={!notes}
          variant="outlined"
          fullWidth
        />
        <button onClick={handleAsk} disabled={loading || !prompt}>
          {loading ? 'Wysyłanie...' : 'Wyślij zapytanie'}
        </button>

        <ReactQuill 
          value={chatResponse} 
          onChange={setChatResponse} 
          theme="snow" 
          style={{ marginTop: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        />

        {chatResponse && (
          <div>
            <button onClick={() => setShowModal(true)}>
              Pobierz notatki
            </button>
          </div>
        )}

        {showModal && (
          <div className='modal'>
            <h3>Wybierz format notatek</h3>
            <button onClick={() => downloadChatNotes('pdf')}>PDF</button>
            <button onClick={() => downloadChatNotes('docx')}>DOCX</button>
            <button onClick={() => setShowModal(false)}>Anuluj</button>
          </div>
        )}
      </div>
    </div>
  );
};

AskModel.propTypes = {
  notes: PropTypes.string,
};

export default AskModel;
