import { useState } from "react";
import PropTypes from 'prop-types';

const EmailSender = ({ emailNotes: sendEmailNotes }) => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [notes, setNotes] = useState( sendEmailNotes || '');
    const [step, setStep] = useState(1);

    const generateCode = async () => {
        try {
            const response = await fetch('http://localhost:8080/generate_code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                setStep(2);
            } else {
                alert(result.error);
            } 
        }
    catch (error) {
            console.error('Error generating code:', error);
            alert('error:', error);
        }
    };

    const verifyCode = async () => {
        try {
            const response = await fetch('http://localhost:8080/verify_code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, code}),
            });
            const result = await response.json();
            if (response.ok) {
                alert('kod werfikacyjny poprawny, możesz wysłać notatki.');
                setStep(3);
            } else {
                alert(result.error, 'kod werfikacyjny niepoprawny');
            }
        } catch (error) {
            console.error('error verifying code:', error);
            alert('error verifing code:', error);
        }
    };

    const sendNotes = async () => {
        try {
            const response = await fetch('http://localhost:8080/send_notes', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, subject: 'SmartMeetings Notes', notes}),
            });
            const result = await response.json();
            if (response.ok) {
                alert('sprawdz notatki powinny byc na twojej skrznce mailowej');
                setStep(2);
            } else {
                alert('błąd podczas przesyłania notatek', result.error);            }
        } catch (error) {
            console.error('error while sending notes: ', error);
            alert('error while sending notes: ', error);
        }
    };

    return (
        <div>
        <br />
            <h1 style={{ fontSize: '20px' }}>Wyślij notatki</h1>
            {step === 1 && (
                <div>
                    <p style={{ fontSize: '17px' }}>Podaj e-mail:</p>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="pawelrus@meet.me"/>
                    <button onClick={generateCode}> Wyślij kod werfikacyjny</button>
                </div>
            )}

            {step === 2 && (
                <div>
                    <p style={{ fontSize: '17px' }}>Podaj kod werfikacyjny: </p>
                    <input type="text" value = {code} onChange = {(e) => setCode(e.target.value)} placeholder="123456"/>
                    <button onClick={verifyCode}>Sprawdź kod</button>
                </div>
            )}

            {step === 3 && (
                <div>
                    <p style={{ fontSize: '17px' }}>Podaj notatki które chcesz wysłać na maila</p>
                    <textarea defaultValue = {notes} onChange={(e) => setNotes(e.target.value)}></textarea>
                    <button onClick={sendNotes}>Wyślij notatki</button>
                </div>
            )}
        </div>
    );
};
EmailSender.propTypes = {
    emailNotes: PropTypes.string,
};

export default EmailSender;