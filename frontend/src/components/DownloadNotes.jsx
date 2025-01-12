import { useState } from 'react';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import replacePolishChars from '../assets/fonts/sings_conventer';

const DownloadChatNotes = ({ downloadedNote: downloadedNote }) => {
    const [showModal, setShowModal] = useState(false);

    const downloadChatNotes = (format) => {
        if (format === 'pdf') {
            const pdf = new jsPDF();
            const margin = 10;
            const maxWidth = pdf.internal.pageSize.width - 2 * margin;
            const lines = pdf.splitTextToSize(replacePolishChars(downloadedNote), maxWidth);
            pdf.setFont("helvetica", "normal");
            pdf.text(lines, margin, 10);
            pdf.save("chat_notes.pdf");
        } else {
            const element = document.createElement('a');
            const file = new Blob([downloadedNote], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            element.href = URL.createObjectURL(file);
            element.download = `chat_notes.${format}`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
        setShowModal(false);
    };

    return (
        <div>
            <button onClick={() => setShowModal(true)}>
                Pobierz notatki
            </button>

            {showModal && (
                <div className='modal'>
                    <h3 style={{ fontSize: '17px' }}>Wybierz format notatek</h3>
                    <button onClick={() => downloadChatNotes('pdf')}>PDF</button>
                    <button onClick={() => downloadChatNotes('docx')}>DOCX</button>
                    <button onClick={() => setShowModal(false)}>Anuluj</button>
                </div>
            )}
        </div>
    );
};
DownloadChatNotes.propTypes = {
    downloadedNote: PropTypes.string.isRequired,
};

export default DownloadChatNotes;