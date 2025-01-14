import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import pl from 'date-fns/locale/pl'; // Import Polish locale
import { listEvents } from '../services/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Localization setup for the calendar
const locales = { pl };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { locale: pl }),
  getDay,
  locales,
});

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await listEvents(); // Fetch events from API
        const fetchedEvents = response.data.events.map((event) => ({
          title: event.summary || 'Bez tytułu', // Default title if none is provided
          start: new Date(event.start.dateTime || event.start.date),
          end: new Date(event.end.dateTime || event.end.date),
        }));
        setEvents(fetchedEvents); // Update state with formatted events
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div
      style={{
        height: '80vh',
        margin: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        overflow: 'hidden',
      }}
    >
      <h2 style={{ color: '#403E3B', marginBottom: '16px' }}>Moje wydarzenia</h2>
      {loading ? (
        <p>Ładowanie wydarzeń...</p>
      ) : (
        <>
          <div
            style={{
              height: '60%',
              overflow: 'hidden',
              marginBottom: '20px',
            }}
          >
            <Calendar
              localizer={localizer}
              events={events} // Pass fetched events here
              startAccessor="start"
              endAccessor="end"
              style={{
                height: '100%',
                width: '100%',
              }}
              views={['month', 'week', 'day']}
              defaultView="month"
              components={{
                event: ({ event }) => (
                  <span>
                    <strong>{event.title}</strong>
                  </span>
                ),
              }}
            />
          </div>
          <div
            style={{
              height: '30%',
              overflowY: 'auto',
              borderTop: '1px solid #403E3B',
              paddingTop: '10px',
            }}
          >
            <h3 style={{ color: '#403E3B' }}>Lista wydarzeń:</h3>
            <ul style={{ listStyle: 'none', paddingLeft: '0', marginTop: '10px' }}>
              {events.map((event, index) => (
                <li key={index} style={{ marginBottom: '5px' }}>
                  <strong>{event.title}</strong> - {event.start.toLocaleString()} →{' '}
                  {event.end.toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default EventCalendar;
