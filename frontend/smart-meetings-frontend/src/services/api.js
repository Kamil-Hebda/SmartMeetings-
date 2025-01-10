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
    });
};

export const generate_chat_notes = async (text, prompt) => {
  return await api.post('/generate_chat_notes', {
    text: text,
    prompt: prompt,
  });
}