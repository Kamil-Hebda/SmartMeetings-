import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Checkbox from '@mui/material/Checkbox';

const ScreenshotSelector = ({ screenshots, onSelectionChange }) => {
  const [selectedScreenshots, setSelectedScreenshots] = useState([]);

  useEffect(() => {
    onSelectionChange(selectedScreenshots);
  }, [selectedScreenshots]);

  const handleSelection = (screenshot) => {
    setSelectedScreenshots((prevSelected) =>
      prevSelected.includes(screenshot)
        ? prevSelected.filter((s) => s !== screenshot)
        : [...prevSelected, screenshot]
    );
  };

  return (
    <div>
      <h3>Select Screenshots</h3>
      <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {screenshots.map((screenshot, index) => (
          <ImageListItem key={index}>
            <img
              src={screenshot}
              alt={`screenshot-${index}`}
              loading="lazy"
              style={{ cursor: 'pointer' }}
              onClick={() => handleSelection(screenshot)}
            />
            <Checkbox
              checked={selectedScreenshots.includes(screenshot)}
              onChange={() => handleSelection(screenshot)}
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                color: 'white',
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};

ScreenshotSelector.propTypes = {
  screenshots: PropTypes.array.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};

export default ScreenshotSelector;
