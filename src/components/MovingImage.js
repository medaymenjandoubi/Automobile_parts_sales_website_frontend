import React, { useEffect, useState } from 'react';
import cartest from "../assets/cartest.jpg"; // Import the image correctly

export default function MovingImage() {
  const [position, setPosition] = useState(window.innerWidth - 100); // Start from the right edge

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prevPosition) => {
        // If the image has reached the start, reset to the right edge
        if (prevPosition <= 0) {
          return window.innerWidth - 100; // Subtract 100 to account for the width of the image (adjust as needed)
        }
        // Otherwise, move the image 10px to the left
        return prevPosition - 10;
      });
    }, 100); // Update every 0.1 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div style={{ width: '100%', height: '15vh', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: `${position}px`,
          transform: 'translateY(-50%)', // Center vertically
          transition: 'left 0.1s linear', // Smooth movement
        }}
      >
        <img src={cartest} alt="Moving" style={{ width: '100px' }} />
      </div>
    </div>
  );
}
