import { useState } from 'react';
import PropTypes from 'prop-types';
import TurndownService from 'turndown';
import Button from '@mui/material/Button';
import MarkdownIt from 'markdown-it';
import html2pdf from 'html2pdf.js';

const FileDownloader = ({ content, filenamePrefix, htmlContent }) => {
    const turndownService = new TurndownService();
    const md = new MarkdownIt();
    const [showModal, setShowModal] = useState(false);

    const downloadFile = async (format) => {
        setShowModal(false);
        if (format === 'pdf') {
            const markdown = turndownService.turndown(htmlContent);
            const html = md.render(markdown);
            const tempElement = document.createElement('div');
            tempElement.innerHTML = html;

            // Dodanie stylów CSS do elementu tymczasowego
            tempElement.style.cssText = `
                margin: 0;
                padding: 0;
                font-size: 12pt;
                line-height: 1.2;
            `;

            // Style dla obrazów
            const images = tempElement.querySelectorAll('img');
            images.forEach((img) => {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.pageBreakInside = 'avoid';
            });

             const elements = tempElement.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, table');
            elements.forEach(el => {
                el.style.pageBreakInside = 'avoid';
                el.style.pageBreakAfter = 'auto';
            });


            document.body.appendChild(tempElement);

            const opt = {
                margin: 0.5,
                filename: `${filenamePrefix}.pdf`,
                image: { type: 'jpeg', quality: 0.8 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };


            try {
                await html2pdf().from(tempElement).set(opt).save();
            } catch (error) {
                console.error("Błąd podczas generowania PDF:", error);
            } finally {
                document.body.removeChild(tempElement);
            }

        } else if (format === 'html') {
            const element = document.createElement('a');
            const file = new Blob([content], { type: 'text/html' });
            element.href = URL.createObjectURL(file);
            element.download = `${filenamePrefix}.html`;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        } else if (format === 'md') {
            const markdown = turndownService.turndown(htmlContent);
            const blob = new Blob([markdown], { type: 'text/markdown' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filenamePrefix}.md`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div>
            <Button variant="contained" style={{ backgroundColor: '#403E3B', color: '#fff', margin: '10px' }} onClick={() => downloadFile('pdf')}>
                Pobierz jako PDF
            </Button>
            <Button variant="contained" style={{ backgroundColor: '#403E3B', color: '#fff', margin: '10px' }} onClick={() => downloadFile('html')}>
                Pobierz jako HTML
            </Button>
            <Button variant="contained" style={{ backgroundColor: '#403E3B', color: '#fff', margin: '10px' }} onClick={() => downloadFile('md')}>
                Pobierz jako Markdown
            </Button>
        </div>
    );
};

FileDownloader.propTypes = {
    content: PropTypes.string.isRequired,
    filenamePrefix: PropTypes.string.isRequired,
    htmlContent: PropTypes.string.isRequired,
};

export default FileDownloader;