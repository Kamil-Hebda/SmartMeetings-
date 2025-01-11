import { useState } from 'react';
import PropTypes from 'prop-types';
import { uploadVideo } from '../services/api';
import TextField from '@mui/material/TextField';

const FileUpload = ({ onUpload }) => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setUploaded(false); // Reset uploaded state when a new file is selected
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a valid file.');
            return;
        }

        const formData = new FormData();
        formData.append('video_file', file);

        setLoading(true);
        try {
            const response = await uploadVideo(formData);
            console.log(response);
            if (response.data.video_path) {
                onUpload(response.data.video_path);
                setUploaded(true); // Set uploaded state to true after successful upload
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="left-panel">
            <h2>Import Video</h2>
            <p>Upload a video file from your computer.</p>
            <form onSubmit={handleSubmit}>
                <TextField
                    type="file"
                    name="video_file"
                    onChange={handleFileChange}
                    variant="outlined"
                    fullWidth
                />
                <button type="submit" disabled={loading || uploaded} className="btn btn-primary mt-2">
                    {loading ? 'Uploading...' : uploaded ? 'File Uploaded' : 'Upload File'}
                </button>
            </form>
        </div>
    );
};

FileUpload.propTypes = {
    onUpload: PropTypes.func.isRequired,
};

export default FileUpload;
