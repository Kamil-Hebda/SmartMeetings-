import { useState } from 'react';
import PropTypes from 'prop-types';
import { uploadVideo } from '../services/api';
import './FileUpload.css';

/**
 * Komponent FileUpload pozwala użytkownikowi wybrać i wgrać plik wideo.
 * - onUpload: funkcja przekazana w propsach, wywoływana po pomyślnym wgraniu pliku
 */
const FileUpload = ({ onUpload }) => {
    // Przechowujemy wybrany plik w stanie komponentu
    const [file, setFile] = useState(null);

    /**
     * handleFileChange:
     * - Aktualizuje stan 'file' na wybrany przez użytkownika plik (e.target.files[0])
     */
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    /**
     * handleSubmit:
     * - Zapobiega domyślnemu wysłaniu formularza
     * - Sprawdza czy wybrano plik
     * - Tworzy FormData i dołącza wybrany plik
     * - Za pomocą uploadVideo wysyła dane na serwer
     * - Jeśli serwer zwróci video_path, wywołuje onUpload z tą ścieżką
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a valid file.');
            return;
        }

        const formData = new FormData();
        formData.append('video_file', file);

        try {
            const response = await uploadVideo(formData);
            console.log(response);
            if (response.data.video_path) {
                onUpload(response.data.video_path);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    // Render formularza umożliwiającego przesłanie pliku wideo
    return (
        <div className="feature-box">
            <i className="fas fa-upload fa-3x mb-3"></i>
            <h4>Import Video</h4>
            <p>Upload a video file from your computer.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    name="video_file"
                    className="form-control"
                    onChange={handleFileChange}
                />
                <button type="submit" className="btn btn-primary mt-2">Upload File</button>
            </form>
        </div>
    );
};
FileUpload.propTypes = {
    onUpload: PropTypes.func.isRequired,
};

export default FileUpload;