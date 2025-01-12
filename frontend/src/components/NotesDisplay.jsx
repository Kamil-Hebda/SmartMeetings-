import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { generateNotes, generateScreenshots } from '../services/api';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ScreenshotSelector from './ScreenshotSelector'; // Import ScreenshotSelector

/**
 * Komponent NotesDisplay:
 * - Odpowiada za generowanie notatek z podanego materiału wideo.
 * - Przyjmuje w propsach:
 *   1) videoPath: ścieżkę do pliku wideo,
 *   2) options: obiekt zawierający zaznaczone przez użytkownika opcje (np. screenshot),
 *   3) onUpdate: funkcję wywoływaną po wygenerowaniu notatek (np. by ustawić wiadomość w komponencie nadrzędnym).
 */
const NotesDisplay = ({ videoPath, options, onUpdate, showScreenshotSelector }) => {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [screenshots, setScreenshots] = useState([]);
    const [selectedScreenshots, setSelectedScreenshots] = useState([]);
    const [isScreenshotSelectorVisible, setIsScreenshotSelectorVisible] = useState(false);


    useEffect(() => {
         setIsScreenshotSelectorVisible(showScreenshotSelector);
    }, [showScreenshotSelector]);

     const handleScreenshotSelection = (screenshot) => {
       setSelectedScreenshots((prevSelected) =>
          prevSelected.some(s => s.path === screenshot.path)
             ? prevSelected.filter((s) => s.path !== screenshot.path)
             : [...prevSelected, screenshot]
       );
   };

    const handleConfirmSelection = (selected) => {
        setSelectedScreenshots(selected);
        setIsScreenshotSelectorVisible(false);
        generateNotesWithSelectedScreenshots(selected);
    };


    const generateNotesWithSelectedScreenshots = async (selected) => {
        setLoading(true);
      try {

          const selectedScreenshotPaths = selected.map((screenshot) => screenshot.path);
          const notesOptions = {
              ...options,
              screenshots: selectedScreenshotPaths
          };
          const generatedSummary = await generateNotes(videoPath, notesOptions);

              if(options.screenshot) {
                   let summaryWithImages = generatedSummary.data.notes;
                  if (selected.length > 0) {
                      summaryWithImages += '\n\n';
                     selected.forEach((screenshot) => {
                          summaryWithImages += `<img src="${screenshot.path}" alt="screenshot" style="max-width: 300px; margin: 5px;"/>`;
                      });
                  }
                   setSummary(summaryWithImages);

              }else {
                setSummary(generatedSummary.data.notes);
              }

          onUpdate(generatedSummary.data);

      } catch (error) {
          console.error('Error generating notes:', error);
      } finally {
          setLoading(false);
      }
    };


    const handleClick = async () => {
      if (!videoPath) {
          alert('Please select a video first.');
          return;
      }
      setLoading(true);
      try {
          // Generowanie zrzutów ekranu
        if (options.ocr || options.screenshot || options.diarization)
        {
            const screenshotResult = await generateScreenshots(videoPath);
            setScreenshots(screenshotResult.data.screenshots || []);
           setIsScreenshotSelectorVisible(true);
        } else {
              const generatedSummary = await generateNotes(videoPath, options);
               setSummary(generatedSummary.data.notes);
                onUpdate(generatedSummary.data);
            }

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
            
            {isScreenshotSelectorVisible && screenshots.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <ScreenshotSelector 
                        screenshots={screenshots} 
                        onSelectionChange={handleScreenshotSelection} 
                        onConfirm={handleConfirmSelection}
                    />
                </div>
            )}

            {/* Edytor notatek */}
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
  showScreenshotSelector: PropTypes.bool.isRequired,
};

export default NotesDisplay;