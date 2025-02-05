import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

const ScreenshotSelector = ({ screenshots, onSelectionChange, onConfirm }) => {
  const [selectedScreenshots, setSelectedScreenshots] = useState([]);

  useEffect(() => {
    onSelectionChange(selectedScreenshots);
  }, [selectedScreenshots]);

    const handleSelection = (screenshot) => {
    setSelectedScreenshots((prevSelected) =>
      prevSelected.some(s => s.path === screenshot.path)
        ? prevSelected.filter((s) => s.path !== screenshot.path)
        : [...prevSelected, screenshot]
    );
  };


  const handleConfirm = () => {
    onConfirm(selectedScreenshots);
  };


  return (
    <div style={{ textAlign: 'center' }}>
      <h3>Wybierz zrzuty ekranu</h3>
      <ImageList sx={{ width: '90%', height: 450, margin: '0 auto' }} cols={3} rowHeight={164}>
        {screenshots.map((screenshot, index) => (
          <ImageListItem key={index}>
            <img
              src={screenshot.path}
              alt={`screenshot-${index}`}
              loading="lazy"
              style={{ cursor: 'pointer' }}
              onClick={() => handleSelection(screenshot)}
            />
            <Checkbox
              checked={selectedScreenshots.some(s => s.path === screenshot.path)}
              onChange={() => handleSelection(screenshot)}
              style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                color: '#403E3B',
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Button 
          variant="contained" 
          style={{ backgroundColor: '#403E3B', color: '#fff', marginTop: '10px' }}
          onClick={handleConfirm}
        >
          Potwierdź zdjęcia
        </Button>
    </div>
  );
};

ScreenshotSelector.propTypes = {
  screenshots: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,

};

export default ScreenshotSelector;