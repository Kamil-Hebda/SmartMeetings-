import { useState } from 'react';
import PropTypes from 'prop-types';
import { generateNotes } from '../services/api';
import './NotesDisplay.css';

/**
 * Komponent NotesDisplay:
 * - Odpowiada za generowanie notatek z podanego materiału wideo.
 * - Przyjmuje w propsach:
 *   1) videoPath: ścieżkę do pliku wideo,
 *   2) options: obiekt zawierający zaznaczone przez użytkownika opcje (np. screenshot),
 *   3) onUpdate: funkcję wywoływaną po wygenerowaniu notatek (np. by ustawić wiadomość w komponencie nadrzędnym).
 */
const NotesDisplay = ({ videoPath, options, onUpdate }) => {
    // Przechowuje wygenerowane notatki w stanie komponentu.
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    /**
     * handleClick:
     * - Funkcja asynchroniczna wywoływana po kliknięciu przycisku „Create Notes” (lub automatycznie z useEffect).
     * - Sprawdza czy jest dostępna ścieżka do wideo (videoPath). Jeśli nie, przerywa działanie.
     * - Próbuje wywołać generateNotes, przekazując mu videoPath, options oraz prompt.
     *   Zwrócony obiekt (generated_summary) zawiera dane zwrócone z serwera.
     * - Ustawia w stanie summary wygenerowane notatki (generated_summary.data.summary).
     * - Wywołuje onUpdate z wiadomością (generated_summary.data.message), aby przekazać ją do komponentu nadrzędnego.
     * - Obsługuje błędy, wyświetlając je w konsoli.
     */
    const handleClick = async () => {
        if (!videoPath) {
            alert('Please select a video first.');
            return; // Jeśli nie ma ścieżki do wideo, nie próbujemy generować notatek.
        }
        setLoading(true);
        try {
            let generated_summary = "";
            generated_summary = await generateNotes(videoPath, options);

            // Ustawiamy notatki w stanie localnym.
            setSummary(generated_summary.data.notes);

            // Informujemy komponent rodzica o nowej wiadomości.
            onUpdate(generated_summary.data);

        } catch (error) {
            console.error('Error generating notes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Renderuje sekcję funkcjonalności generowania notatek z przyciskiem „Create Notes”.
    return (
        <div className="feature-box">
            <i className="fas fa-sticky-note fa-3x mb-3"></i>
            <h4>Generate Notes</h4>
            <p>Generate notes from the video content.</p>
            
            <button className="btn btn-success" onClick={handleClick} disabled={loading}>
                {loading ? 'Generating...' : 'Create Notes'}
            </button>
            {/*
            {screenshotsDir && <p>Screenshots created in: {screenshotsDir}</p>}
            {executionTime && <p>Time execution time: {executionTime}</p>}*/}
            {summary && <div dangerouslySetInnerHTML={{ __html: summary }} />}
        </div>
    );
};
NotesDisplay.propTypes = {
    videoPath: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default NotesDisplay;
