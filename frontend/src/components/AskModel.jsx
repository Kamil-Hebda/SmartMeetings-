import { useState} from 'react';
import PropTypes from 'prop-types';
import { generate_chat_notes } from '../services/api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import FileDownloader from './FileDownloader';

const AskModel = ({ notes, onPromptChange, prompt, chatResponse, onChatResponseChange }) => {
    const [loading, setLoading] = useState(false);
      const [quillRef, setQuillRef] = useState(null)

    const handleQuillRefChange = (ref) => {
        if(ref) {
            setQuillRef(ref)
        }
    }
  // Funkcja do wysyłania zapytania do chatu
  const handleAsk = async () => {
    if (!notes) {
      alert("Transkrypcja nie jest dostępna. Proszę poczekać na jej wygenerowanie.");
      return;
    }

    setLoading(true);
    try {
      const response = await generate_chat_notes(notes, prompt);
        onChatResponseChange(response.data.notes);
    } catch (error) {
      console.error("Błąd podczas zapytania do chatu:", error.response ? error.response.data : error.message);
        onChatResponseChange("Wystąpił błąd. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
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
          onChange={(e) => onPromptChange(e.target.value)}
          className="prompt-box"
          disabled={!notes}
          variant="outlined"
          fullWidth
        />
        <Button 
                variant="contained" 
                style={{ backgroundColor: '#403E3B', color: '#fff', marginTop: '10px' }}
                onClick={handleAsk} 
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color='#403E3B' />}
            >
                {loading ? 'Generating...' : 'Generate Chat Response'}
            </Button>


        <ReactQuill 
          value={chatResponse} 
          onChange={onChatResponseChange}
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
         <FileDownloader content={chatResponse} filenamePrefix="chat_notes" htmlContent={quillRef ? quillRef.getEditor().container.innerHTML : null}/>
      </div>
    </div>
  );
};

AskModel.propTypes = {
    notes: PropTypes.string,
  onPromptChange: PropTypes.func.isRequired,
  prompt: PropTypes.string.isRequired,
  chatResponse: PropTypes.string.isRequired,
  onChatResponseChange: PropTypes.func.isRequired,
};


export default AskModel;