import { useState } from 'react';
import PropTypes from 'prop-types';
import { uploadVideo } from '../services/api';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
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
            <Typography variant="h5" gutterBottom>
                Zaimportuj plik wideo
            </Typography>
            <Typography variant="body1" gutterBottom>
                Prześlij plik wideo, aby rozpocząć generowanie notatek.
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    type="file"
                    name="video_file"
                    onChange={handleFileChange}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: '#403E3B', color: '#fff' }}
                    disabled={loading || uploaded}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                    {loading ? 'Przesyłanie...' : uploaded ? 'Plik załadowany' : 'Prześlij plik'}
                </Button>
            </form>
        </div>
    );
};

FileUpload.propTypes = {
    onUpload: PropTypes.func.isRequired,
};

export default FileUpload;
