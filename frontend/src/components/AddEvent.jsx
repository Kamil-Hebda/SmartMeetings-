import { useState } from 'react';
import { createEvent } from '../services/api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const AddEvent = () => {
  const [formData, setFormData] = useState({
    summary: '',
    location: '',
    description: '',
    timeStart: '',
    timeEnd: '',
    attendees: '',
    reminders: '',
  });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setLoading(true);
  setResponseMessage('');

  const start_date = {
    dateTime: new Date(formData.timeStart).toISOString(),
    timeZone: 'Europe/Warsaw',
  };
  const end_date = {
    dateTime: new Date(formData.timeEnd).toISOString(),
    timeZone: 'Europe/Warsaw',
  };

  const attendeesArray = formData.attendees
    .split(',')
    .map((email) => ({ email: email.trim() }));

  const reminders = {
    useDefault: false,
    overrides: [
      { method: 'email', minutes: 30 },
      { method: 'popup', minutes: 10 },
    ],
  };

  try {
    const response = await createEvent(
      formData.summary,
      formData.location,
      formData.description,
      start_date,
      end_date,
      attendeesArray,
      reminders
    );

    setResponseMessage(`Wydarzenie zostało utworzone: ${response.data.event_link}`);
  } catch (error) {
    console.error('Błąd przy tworzeniu wydarzenia:', error.response?.data || error.message);
    setResponseMessage('Nie udało się utworzyć wydarzenia. Spróbuj ponownie.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div
      style={{
        padding: '16px',
        maxWidth: '600px',
        margin: '0 auto',
        color: '#403E3B',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '16px', color: '#403E3B' }}>Dodaj Wydarzenie</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Tytuł wydarzenia"
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          required
          style={{ marginBottom: '16px' }}
        />
        <TextField
          label="Lokalizacja"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          style={{ marginBottom: '16px' }}
        />
        <TextField
          label="Opis"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          style={{ marginBottom: '16px' }}
        />
        <TextField
          label="Data i czas rozpoczęcia"
          name="timeStart"
          type="datetime-local"
          value={formData.timeStart}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          style={{ marginBottom: '16px' }}
        />
        <TextField
          label="Data i czas zakończenia"
          name="timeEnd"
          type="datetime-local"
          value={formData.timeEnd}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          style={{ marginBottom: '16px' }}
        />
        <TextField
          label="Uczestnicy (e-maile, rozdzielone przecinkami)"
          name="attendees"
          value={formData.attendees}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          style={{ marginBottom: '16px' }}
        />
        <Button
          type="submit"
          variant="contained"
          style={{
            backgroundColor: '#403E3B',
            color: '#fff',
            width: '100%',
            padding: '10px',
          }}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Dodawanie...' : 'Dodaj Wydarzenie'}
        </Button>
      </form>
      {responseMessage && (
        <p style={{ marginTop: '16px', textAlign: 'center', color: '#403E3B' }}>
          {responseMessage}
        </p>
      )}
    </div>
  );
};

export default AddEvent;
