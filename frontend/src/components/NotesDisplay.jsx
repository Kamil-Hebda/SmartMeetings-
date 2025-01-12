import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { generateNotes, generateScreenshots } from '../services/api';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ScreenshotSelector from './ScreenshotSelector'; // Import ScreenshotSelector
import FileDownloader from './FileDownloader';


/**
 * Komponent NotesDisplay:
 * - Odpowiada za generowanie notatek z podanego materiału wideo.
 * - Przyjmuje w propsach:
 *   1) videoPath: ścieżkę do pliku wideo,
 *   2) options: obiekt zawierający zaznaczone przez użytkownika opcje (np. screenshot),
 *   3) onUpdate: funkcję wywoływaną po wygenerowaniu notatek (np. by ustawić wiadomość w komponencie nadrzędnym).
 */
const NotesDisplay = ({ videoPath, options, onUpdate, showScreenshotSelector, summary }) => {
    const [loading, setLoading] = useState(false);
    const [screenshots, setScreenshots] = useState([]);
    const [selectedScreenshots, setSelectedScreenshots] = useState([]);
    const [isScreenshotSelectorVisible, setIsScreenshotSelectorVisible] = useState(false);
     const [quillRef, setQuillRef] = useState(null);
    const [format, setFormat] = useState('pdf');
    const [summaryWithBase64Images, setSummaryWithBase64Images] = useState(summary);

    useEffect(() => {
        setIsScreenshotSelectorVisible(showScreenshotSelector);
    }, [showScreenshotSelector]);


    useEffect(() => {
    const convertImagesToBase64 = async () => {        
           const imgRegex = /<img.*?src="(.*?)"/g;
        let match;
         let convertedHtml = summary;

          while ((match = imgRegex.exec(summary)) !== null) {
                const imageUrl = match[1];
                try {
                    const response = await fetch(imageUrl);
                   if(response.ok) {
                       const blob = await response.blob();
                       const reader = new FileReader();

                         reader.onloadend = () => {
                           let base64data= reader.result;
                             convertedHtml=  convertedHtml.replace(imageUrl, base64data);
                           setSummaryWithBase64Images(convertedHtml);
                          
                        };

                           reader.readAsDataURL(blob);

                   }
                } catch (error) {
                   console.error('Error loading image:', error);
               }
         }
        setSummaryWithBase64Images(convertedHtml);
       };


        convertImagesToBase64();
      
    }, [summary]);


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
    const handleQuillRefChange = (ref) => {
        if(ref) {
            setQuillRef(ref)
        }
    }

   const handleFormatChange = (e) => {
      setFormat(e.target.value);
    };
 const handleDownload = () => {
        console.log("pobrano")
    }

  const generateNotesWithSelectedScreenshots = async (selected) => {
        setLoading(true);
    try {
          const selectedScreenshotPaths = selected.map((screenshot) => screenshot.path);
          const notesOptions = {
              ...options,
              screenshots: selectedScreenshotPaths
          };
          const generatedSummary = await generateNotes(videoPath, notesOptions);
           let summaryWithImages = "";
          if(generatedSummary.data && generatedSummary.data.notes) {
            generatedSummary.data.notes.forEach(item => {
                if (item.text) {
                    summaryWithImages += item.text + "\n";
                }
                if (item.screenshot) {
                    summaryWithImages += `<img src="${item.screenshot}" alt="screenshot" class="image-in-note" />` + "\n";
                }
            });
           }
          onUpdate({...generatedSummary.data, notes: summaryWithImages});
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
            let summaryWithImages = "";
           if(generatedSummary.data && generatedSummary.data.notes) {
             generatedSummary.data.notes.forEach(item => {
                 if (item.text) {
                    summaryWithImages +=  item.text + "\n";
                 }
                if (item.screenshot) {
                    summaryWithImages +=  `<img src="${item.screenshot}" alt="screenshot" class="image-in-note" />` + "\n";
                   }
            });
        }
            onUpdate({...generatedSummary.data, notes: summaryWithImages});
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
                onChange={(value) => onUpdate({...options, notes: value})}
                theme="snow" 
                style={{ marginTop: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
                   modules={{
                        toolbar: [
                          [{ 'header': '1'}, { 'header': '2'}, { 'font': [] }],
                          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                          [{'list': 'ordered'}, {'list': 'bullet'}, 
                           {'indent': '-1'}, {'indent': '+1'}],
                          ['link', 'image'],
                          ['clean']
                        ],
                    }}
                 ref={handleQuillRefChange}
            />
           {quillRef && (<FileDownloader
                content={summary}
                   filenamePrefix="notes"
                   htmlContent={summaryWithBase64Images}
                   format={format}
                    onDownload={handleDownload}
               />)}
        </div>
    );
};

NotesDisplay.propTypes = {
    videoPath: PropTypes.string.isRequired,
    options: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    showScreenshotSelector: PropTypes.bool.isRequired,
    summary: PropTypes.string.isRequired,
};

export default NotesDisplay;