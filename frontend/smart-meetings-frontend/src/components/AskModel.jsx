import { useState} from 'react';
import { generate_chat_notes } from '../services/api';
import PropTypes from 'prop-types';


const AskModel = ({ notes, prompt }) => {
  const [chatResponse, setChatResponse] = useState('');
  const [loading, setLoading] = useState(false);

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
        </div>
      )}
    </div>
  );
};
AskModel.propTypes = {
  notes: PropTypes.string,
  prompt: PropTypes.string,
};

export default AskModel;
