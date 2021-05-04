import React from 'react';
import { Zoom } from 'react-slideshow-image';

const ImageSlider = ({ images }) => {
  const zoomInProperties = {
    indicators: images.length > 1,
    scale: 1.4,
    arrows: images.length > 1,
    autoplay: images.length > 1,
  };
  return (
    <div>
      <Zoom {...zoomInProperties}>
        {images.map((each, index) => (
          <div key={index} style={{ width: '100%' }}>
            <img
              style={{ objectFit: 'cover', width: '100%' }}
              src={each}
              alt='Empty'
            />
          </div>
        ))}
      </Zoom>
    </div>
  );
};

export default ImageSlider;
