import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import NotesDisplay from '../components/NotesDisplay';
import AskModel from '../components/AskModel'; // Import nowego komponentu
import '../App.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

const Home = () => {
  const [activeTab, setActiveTab] = useState('Notes');
  const [videoPath, setVideoPath] = useState(null);
  const [message, setMessage] = useState(null);
  const [options, setOptions] = useState({
    transcription: false,
    ocr: false,
    screenshot: false,
    diarization: false
  });
  const [notes, setNotes] = useState('');

  const handleFileUpload = (path) => {
    setVideoPath(path);
  };

  const handleNotesUpdate = (data) => {
    setMessage(data.message);
    setNotes(data.notes);
  };

  const handleOptionChange = (e) => {
    const { name, checked } = e.target;
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: checked
    }));
  };

  return (
    <div className="container">
      <h1>Smart Meetings</h1>      
      <ButtonGroup 
        variant="contained" 
        aria-label="contained primary button group" 
        className="tab-buttons"
        style={{ 
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          border: 0,
          boxShadow: 'none',
         }} // Remove border radius
      >
        <Button 
          className='tab-button'
          onClick={() => setActiveTab('Notes')} 
          style={{ backgroundColor: activeTab === 'Notes' ? '#BFB3A4' : '#403E3B',
          borderBottomLeftRadius: 0,
          borderBottom: 0,
          borderColor: '#403E3B',
           }}
        >
          Notes
        </Button>
        <Button 
          className='tab-button'
          onClick={() => setActiveTab('AskChat')} 
          style={{ backgroundColor: activeTab === 'AskChat' ? '#BFB3A4' : '#403E3B',
            borderColor: '#403E3B',
           }}
        >
          Ask Chat
        </Button>
        <Button 
          className='tab-button'
          onClick={() => setActiveTab('SendMail')} 
          style={{ backgroundColor: activeTab === 'SendMail' ? '#BFB3A4' : '#403E3B',
            borderColor: '#403E3B',
           }}
        >
          Send Mail
        </Button>
        <Button 
          className='tab-button'
          onClick={() => setActiveTab('PlanMeeting')} 
          style={{ backgroundColor: activeTab === 'PlanMeeting' ? '#BFB3A4' : '#403E3B',
          borderBottomRightRadius: 0,
          borderBottom: 0,
          borderColor: '#403E3B',
           }}
        >
          Plan Meeting
        </Button>
      </ButtonGroup>

      <div className="tab-content">
        {activeTab === 'Notes' && (
          <div className="notes-content">
            <div className="left-panel">
              {/* Pozostawienie zawartości sekcji "Notes" */}
            </div>
            <div className="right-panel">
              <div className="feature-box">
                <h2>Notes Options</h2>
                <div className="options">
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="transcription"
                        checked={options.transcription}
                        onChange={handleOptionChange}
                        style={{ color: '#403E3B' }}
                      />
                    }
                    label="Transcription"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="ocr"
                        checked={options.ocr}
                        onChange={handleOptionChange}
                        style={{ color: '#403E3B' }}
                      />
                    }
                    label="OCR"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="screenshot"
                        checked={options.screenshot}
                        onChange={handleOptionChange}
                        style={{ color: '#403E3B' }}
                      />
                    }
                    label="Screenshot"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="diarization"
                        checked={options.diarization}
                        onChange={handleOptionChange}
                        style={{ color: '#403E3B' }}
                      />
                    }
                    label="Diarization"
                  />
                </div>
                <FileUpload onUpload={handleFileUpload} />
                <NotesDisplay
                  videoPath={videoPath}
                  options={options}
                  onUpdate={handleNotesUpdate}
                />
              </div>
            </div>
          </div>
        )}
        {activeTab === 'AskChat' && <AskModel notes={notes} />}
        {activeTab === 'SendMail' && <div>Send Mail Content</div>}
        {activeTab === 'PlanMeeting' && <div>Plan Meeting Content</div>}
      </div>
    </div>
  );
};

export default Home;
