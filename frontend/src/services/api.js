import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
});

export const uploadVideo = async (formData) => {
  return await api.post('/upload_video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const generateNotes = async (videoPath, options) => {
  return await api.post('/generate_notes', {
      video_path: videoPath,
      options: options,
      screenshots: options.screenshots,
    });
};

export const generate_chat_notes = async (text, prompt) => {
  return await api.post('/generate_chat_notes', {
    text: text,
    prompt: prompt,
  });
}

export const generateScreenshots = async (videoPath) => {
  return await api.post('/generate_screenshots', {
    video_path: videoPath,
  });
};

export const generateCode = async (email) => {
  return await api.post('/generate_code', {
    email: email,
  });
};

export const verifyCode = async (email, code) => {
  return await api.post('/verify_code', {
    email: email,
    code: code,
  });
};

// export const mailReciever = async (email) => {
//   return await api.post('/mail_reciever', {
//     email: email,
//   })
// }

// export const sendNotes = async (email, subject, notes) => {
//   return await api.post('/send_notes', {
//     email: email,
//     subject: subject,
//     notes: notes,
//   });
// };

export const createEvent = async (summary, location, description, start_date, end_date, attendees, reminders) => {
  return await api.post('/create_event', {
    summary: summary,
    location: location,
    description: description,
    start_date: start_date,
    end_date: end_date,
    attendees: attendees,
    reminders: reminders,
  });
};

export const listEvents = async () => {
  return await api.get('/list_events');
};


export default api;