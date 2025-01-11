import { useState } from 'react';
import PropTypes from 'prop-types';
import { generateNotes } from '../services/api';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * Komponent NotesDisplay:
 * - Odpowiada za generowanie notatek z podanego materiału wideo.
 * - Przyjmuje w propsach:
 *   1) videoPath: ścieżkę do pliku wideo,
 *   2) options: obiekt zawierający zaznaczone przez użytkownika opcje (np. screenshot),
 *   3) onUpdate: funkcję wywoływaną po wygenerowaniu notatek (np. by ustawić wiadomość w komponencie nadrzędnym).
 */
const NotesDisplay = ({ videoPath, options, onUpdate }) => {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (!videoPath) {
            alert('Please select a video first.');
            return;
        }
        setLoading(true);
        try {
            let generated_summary = "";
            generated_summary = await generateNotes(videoPath, options);

            setSummary(generated_summary.data.notes);
            onUpdate(generated_summary.data);

        } catch (error) {
            console.error('Error generating notes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Generate Notes</h2>
            <Typography variant="body1" gutterBottom>
                Click the button below to generate notes from the video.  
            </Typography>          
            <Button 
                variant="contained" 
                style={{ backgroundColor: '#403E3B', color: '#fff' }}
                onClick={handleClick} 
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color='#403E3B' />}
            >
                {loading ? 'Generating...' : 'Create Notes'}
            </Button>
            <ReactQuill 
                value={summary} 
                onChange={setSummary} 
                theme="snow" 
                style={{ marginTop: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
        </div>
    );
};

NotesDisplay.propTypes = {
    videoPath: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default NotesDisplay;
