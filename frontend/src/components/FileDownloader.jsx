import React, { useState } from 'react';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import TurndownService from 'turndown';
import Button from '@mui/material/Button';

const FileDownloader = ({ content, filenamePrefix, htmlContent }) => {
     const turndownService = new TurndownService()
  const [showModal, setShowModal] = useState(false);


    const downloadFile = async (format) => {
        setShowModal(false);
        if (format === 'pdf') {
            if(htmlContent) {
                 const tempElement = document.createElement('div');
                    tempElement.innerHTML = htmlContent;
                    document.body.appendChild(tempElement);
                    const canvas = await html2canvas(tempElement, {
                      scrollY: -window.scrollY,
                        scrollX: -window.scrollX,
                     });
                      document.body.removeChild(tempElement);
                      const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF();
                     const imgProps= pdf.getImageProperties(imgData);
                      const pdfWidth = pdf.internal.pageSize.getWidth();
                      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                      pdf.save(`${filenamePrefix}.pdf`);
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
           const markdown = turndownService.turndown(content);
            const element = document.createElement('a');
            const file = new Blob([markdown], { type: 'text/markdown' });
           element.href = URL.createObjectURL(file);
              element.download = `${filenamePrefix}.md`;
           document.body.appendChild(element);
           element.click();
           document.body.removeChild(element);
     }
  };


    return (
         <div>
             <Button onClick={() => setShowModal(true)}  variant="contained" 
              style={{ backgroundColor: '#403E3B', color: '#fff', marginTop: '10px', marginRight:'5px' }}>
              Pobierz notatki
            </Button>

           {showModal && (
          <div className='modal'>
              <h3>Wybierz format notatek</h3>
              <Button onClick={() => downloadFile('pdf')} variant="contained" 
                style={{ backgroundColor: '#403E3B', color: '#fff', marginBottom: '10px', marginRight:'5px' }}>PDF</Button>
              <Button onClick={() => downloadFile('html')} variant="contained" 
                style={{ backgroundColor: '#403E3B', color: '#fff', marginBottom: '10px', marginRight:'5px' }}>HTML</Button>
                <Button onClick={() => downloadFile('md')} variant="contained" 
                style={{ backgroundColor: '#403E3B', color: '#fff', marginBottom: '10px' }}>MD</Button>
            <Button onClick={() => setShowModal(false)}   variant="contained" 
                style={{ backgroundColor: '#403E3B', color: '#fff', marginBottom: '10px', marginLeft: '5px'  }}>Anuluj</Button>
          </div>
      )}
      </div>
    );
};

FileDownloader.propTypes = {
    content: PropTypes.string.isRequired,
    filenamePrefix: PropTypes.string.isRequired,
   htmlContent: PropTypes.string,
};

export default FileDownloader;