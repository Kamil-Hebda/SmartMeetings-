import { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../services/api';

const EmailSender = ({ emailNotes: sendEmailNotes }) => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [notes, setNotes] = useState(sendEmailNotes || '');
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const generateCode = async () => {
        setLoading(true);
        try {
            const result = await api.post('/generate_code', { email });
            alert(result.data.message);
            setStep(2);
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
            alert('Kod weryfikacyjny poprawny, możesz wysłać notatki.');
            setStep(3);
        } catch (error) {
            console.error('Error verifying code:', error);
            alert('Error verifying code:', error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    const sendNotes = async () => {
        setLoading(true);
        try {
            const result = await api.post('/send_notes', { email, subject: 'SmartMeetings Notes', notes });
            alert('Sprawdź notatki, powinny być na twojej skrzynce mailowej');
            setStep(2);
        } catch (error) {
            console.error('Error while sending notes:', error);
            alert('Error while sending notes:', error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
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
                            <p style={{ fontSize: '17px' }}>Podaj notatki, które chcesz wysłać na maila:</p>
                            <TextField
                                multiline
                                rows={4}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                fullWidth
                                variant="outlined"
                            />
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