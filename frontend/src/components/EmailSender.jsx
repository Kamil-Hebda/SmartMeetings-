import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, IconButton, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import api from '../services/api';
import CloseIcon from '@mui/icons-material/Close';


const EmailSender = ({ emailNotes }) => {
    const {summary, chatResponse} = emailNotes;
    const [selectedOptions, setSelectedOptions] = useState({
        summary: false,
        chatResponse: false,
    });
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [reciever, setReciever] = useState([]);
    const [file, setFile] = useState([]);
    const [input, setInput] = useState('');
    const [notes, setNotes] = useState('');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const generateCode = async () => {
        setLoading(true);
        try {
            const result = await api.post('/generate_code', { email });
            if(result.status === 200) {
                alert(result.data.message);
                setStep(2);
            }
        } catch (error) {
            console.error('Error generating code:', error);
            alert('Error:', error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        setLoading(true);
        try {
            const result = await api.post('/verify_code', { email, code });
            if(result.status === 200) {
                alert('Kod weryfikacyjny poprawny, do kogo powinniśny wysłać notatki');
                setReciever(prevRecievers => [...prevRecievers, email])
                setStep(3);
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            alert('Error verifying code:', error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    // test case
    // john.doe@example.com, jane.smith@example.org alice.jones@example.net bob.brown@example.edu
    // charlie.davis@example.co.uk, emily.martin@example.ca frank.wilson@example.au grace.lee@example.in


    const addReciever = () => {
        const emails = input
            .split(/[\s,]+/)
            .filter(email => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email));

        setReciever(prevRecievers => [...prevRecievers, ...emails]);

        setInput('');

        setLoading(false);
    };

    useEffect(() => {
        console.log(reciever);
    }, [reciever]);


    const mailReciever = async () => {
        setLoading(true);

        const mailTable = reciever.map((mailName, index) => ({
            id: index,
            email: mailName,
        }));

        try {
            const result = await api.post('/mail_reciever', { mailTable });
            if(result.status === 200) {
                alert('Teraz możesz wysłać notatki');
                setStep(4);
            }
        } catch (error) {
            console.error('Error while sending notes:', error);
            alert('Error while sending notes:', error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    }

    const sendNotes = async () => {
        setLoading(true);

        console.log(reciever);

        const emailReciver = reciever.map((emailName, index) => ({
            'id': index,
            'email': emailName,
        }));
        const jsonifyEmailReciver = JSON.stringify(emailReciver);

        const formData = new FormData();

        formData.append('notes', notes)
        formData.append('reciever', jsonifyEmailReciver)
        formData.append('subject', 'SmartMeetings Notes')

        file.forEach((plik) => {
            formData.append('files', plik);
        });

        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }

        try {
            const result = await api.post('/send_notes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'},
                });
            if(result.status === 200) {
                alert('Sprawdź notatki, powinny być na twojej skrzynce mailowej');
                setInput('');
                setFile([]);
                setStep(3);
            }
        } catch (error) {
            if (error.response) {
                console.error('Error while sending notes:', error.response.data);
                alert('wybrany format pliku nie jest obsługiwany');

            } else {
                console.error('Error while sending notes:', error);
                alert('Error while sending notes:', error.response?.data?.error || error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const removeReciever = (removedEmail) => {
        setReciever(prevList => prevList.filter(email => email !== removedEmail))
    }

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        setSelectedOptions((prev) => ({
            ...prev,
            [name]: checked,
        }));
        if (name === 'summary' && checked) {
            setNotes((prev) => prev + summary);
        } else if (name === 'summary' && !checked) {
            setNotes((prev) => prev.replace(summary, ''));
        }

        if (name === 'chatResponse' && checked) {
            setNotes((prev) => prev + chatResponse);
        } else if (name === 'chatResponse' && !checked) {
            setNotes((prev) => prev.replace(chatResponse, ''));
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            // Ensure that e.target.files exists and has files
            const selectedFiles = Array.from(e.target.files); // Convert FileList to an array
            setFile(selectedFiles);
            console.log("kupa");
            console.log(selectedFiles); // Log all selected files for debugging
        } else {
            console.error("No files selected or input element is incorrect");
            setFile([]); // Clear the state if no files are selected
        }
    };

    return (
        <div className="left-panel">
            <div className="feature-box">
                <div className="email-sender">
                    <h1 style={{ fontSize: '20px' }}>Wyślij notatki</h1>
                    {step === 1 && (
                        <div>
                            <p style={{ fontSize: '17px' }}>Podaj e-mail:</p>
                            <TextField
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="pawelrus@meet.me"
                                fullWidth
                                variant="outlined"
                            />
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#403E3B', color: '#fff', marginTop: '10px' }}
                                onClick={generateCode}
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                {loading ? 'Wysyłanie...' : 'Wyślij kod weryfikacyjny'}
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <p style={{ fontSize: '17px' }}>Podaj kod weryfikacyjny:</p>
                            <TextField
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="123456"
                                fullWidth
                                variant="outlined"
                            />
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#403E3B', color: '#fff', marginTop: '10px' }}
                                onClick={verifyCode}
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                {loading ? 'Sprawdzanie...' : 'Sprawdź kod'}
                            </Button>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <TextField
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder='jestemsliczny@rusina.com'
                                fullWidth
                                variant="outlined"
                            />
                            <Button
                                variant='contained'
                                style={{ backgroundColor: '#403E3B', color: '#fff', marginTop: '10px' }}
                                onClick={addReciever}
                            >
                                {'Dodaj odbiorców'}
                            </Button>

                            <Button
                                variant='contained'
                                style={{ backgroundColor: '#403E3B', color: '#fff', marginTop: '10px', marginLeft: '40px' }}
                                onClick={mailReciever}
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                {loading ? 'Wysyłanie...' : 'Wybierz odbiorców'}
                            </Button>

                            <List>
                                {reciever.map((email, index) => (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <IconButton edge="end" onClick={() => removeReciever(email)}>
                                                <CloseIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemText primary={email} />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    name="summary"
                                    checked={selectedOptions.summary}
                                    onChange={handleCheckboxChange}
                                />
                                Podsumowanie
                            </label>
                            <br />
                            <label>
                                <input
                                    type="checkbox"
                                    name="chatResponse"
                                    checked={selectedOptions.chatResponse}
                                    onChange={handleCheckboxChange}
                                />
                                Streszczenie
                            </label>
                            <br />
                            <p style={{ fontSize: '17px' }}>Podaj notatki, które chcesz wysłać na maila:</p>
                            <TextField
                                multiline
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
                            <input type="file" multiple onChange={handleFileChange} />
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#403E3B', color: '#fff', marginTop: '10px' }}
                                onClick={sendNotes}
                                disabled={loading}
                                startIcon={loading && <CircularProgress size={20} color="inherit" />}
                            >
                                {loading ? 'Wysyłanie...' : 'Wyślij notatki'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

EmailSender.propTypes = {
    emailNotes: PropTypes.string,
};

export default EmailSender;