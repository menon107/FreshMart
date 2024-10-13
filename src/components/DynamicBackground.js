import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const colors = [
  'rgb(236, 253, 245)', // green-100
  'rgb(219, 234, 254)', // blue-100
  'rgb(254, 243, 199)', // yellow-100
  'rgb(237, 233, 254)'  // purple-100
];

function DynamicBackground({ children }) {
  const [colorIndex, setColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 10000); // Change color every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      style={{
        background: colors[colorIndex],
        minHeight: '100vh',
        transition: 'background 2s ease'
      }}
    >
      {children}
    </motion.div>
  );
}

export default DynamicBackground;