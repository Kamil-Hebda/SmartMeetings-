import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import NotesDisplay from '../components/NotesDisplay';
import AskModel from '../components/AskModel'; // Import nowego komponentu
import '../App.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import EmailSender from '../components/EmailSender';
import AddEvent from '../components/AddEvent';
import EventCalendar from '../components/EventCalendar';

const Home = () => {
    const [activeTab, setActiveTab] = useState('Notes');
    const [videoPath, setVideoPath] = useState(null);
    const [summary, setSummary] = useState('');
    const [options, setOptions] = useState({
        transcription: false,
        ocr: false,
        screenshot: false,
        diarization: false
    });
    const [notes, setNotes] = useState('');
    const [activeSubTab, setActiveSubTab] = useState('Calendar');
    const [prompt, setPrompt] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [showScreenshotSelector, setShowScreenshotSelector] = useState(false);

    const handleFileUpload = (path) => {
        setVideoPath(path);
    };

    const handleNotesUpdate = (data) => {
        setNotes(data.notes);
        setSummary(data.notes);
    };

    const handleOptionChange = (e) => {
        const { name, checked } = e.target;

        if (name === 'diarization' && checked && !options.transcription) {
            setOptions((prevOptions) => ({
                ...prevOptions,
                diarization: false, // Zapobiegaj zaznaczaniu diarization bez transkrypcji
            }));
            alert("Transcription must be enabled for diarization."); // Ustaw alert
            return;
        }

        setOptions((prevOptions) => {
            const newOptions = {
                ...prevOptions,
                [name]: checked
            };

            // Ustawienie showScreenshotSelector tylko wtedy, gdy OCR lub Screenshot są zaznaczone
            setShowScreenshotSelector(newOptions.ocr || newOptions.screenshot);

            // Wyłączenie diarization, jeśli transcription jest odznaczone
            if (name === 'transcription' && !checked) {
                newOptions.diarization = false;
            }

            return newOptions;
        });
    };

    const handlePromptChange = (newPrompt) => {
        setPrompt(newPrompt);
    };

    const handleChatResponseChange = (newChatResponse) => {
        setChatResponse(newChatResponse);
    };

    const handleConfirmSelection = (selected) => {
        setShowScreenshotSelector(false); // Ukryj ScreenshotSelector po zatwierdzeniu zdjęć
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
                    style={{
                        backgroundColor: activeTab === 'Notes' ? '#BFB3A4' : '#403E3B',
                        borderBottomLeftRadius: 0,
                        borderBottom: 0,
                        borderColor: '#403E3B',
                    }}
                >
                    Notatki
                </Button>
                <Button
                    className='tab-button'
                    onClick={() => setActiveTab('AskChat')}
                    style={{
                        backgroundColor: activeTab === 'AskChat' ? '#BFB3A4' : '#403E3B',
                        borderColor: '#403E3B',
                    }}
                >
                    Notatki z Chatem
                </Button>
                <Button
                    className='tab-button'
                    onClick={() => setActiveTab('SendMail')}
                    style={{
                        backgroundColor: activeTab === 'SendMail' ? '#BFB3A4' : '#403E3B',
                        borderColor: '#403E3B',
                    }}
                >
                    Wyślij Maila
                </Button>
                <Button
                    className='tab-button'
                    onClick={() => setActiveTab('PlanMeeting')}
                    style={{
                        backgroundColor: activeTab === 'PlanMeeting' ? '#BFB3A4' : '#403E3B',
                        borderBottomRightRadius: 0,
                        borderBottom: 0,
                        borderColor: '#403E3B',
                    }}
                >
                    Zaplanuj Spotkanie
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
                                <h2>Opcje notatek</h2>
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
                                        label="Transkrypcja"
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
                                        label="Zrzuty ekranu"
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
                                        label="Diaryzacja"
                                    />
                                </div>
                                <FileUpload onUpload={handleFileUpload} />
                                <NotesDisplay
                                    videoPath={videoPath}
                                    options={options}
                                    onUpdate={handleNotesUpdate}
                                    showScreenshotSelector={showScreenshotSelector}
                                    summary={summary}
                                    onConfirmSelection={handleConfirmSelection} // Przekazanie funkcji do NotesDisplay
                                />
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'AskChat' && <AskModel notes={notes} onPromptChange={handlePromptChange} prompt={prompt} chatResponse={chatResponse} onChatResponseChange={handleChatResponseChange} />}
                {activeTab === 'SendMail' && <EmailSender emailNotes={{ summary, chatResponse }} />}
                {activeTab === 'PlanMeeting' && (
                    <div>
                        <ButtonGroup
                            variant="contained"
                            aria-label="contained primary button group"
                            style={{
                                marginBottom: '15px',
                            }}
                        >
                            <Button
                                onClick={() => setActiveSubTab('Calendar')}
                                style={{
                                    backgroundColor: activeSubTab === 'Calendar' ? '#BFB3A4' : '#403E3B',
                                }}
                            >
                                Kalendarz z Wydarzeniami
                            </Button>
                            <Button
                                onClick={() => setActiveSubTab('AddEvent')}
                                style={{
                                    backgroundColor: activeSubTab === 'AddEvent' ? '#BFB3A4' : '#403E3B',
                                }}
                            >
                                Dodaj Wydarzenie
                            </Button>
                        </ButtonGroup>
                        {activeSubTab === 'Calendar' && <EventCalendar />}
                        {activeSubTab === 'AddEvent' && <AddEvent />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;