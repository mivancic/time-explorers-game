import React from 'react';

/**
 * AnalogueClock component renders an analogue clock face with hour and minute hands
 * 
 * @param {Object} props - Component props
 * @param {number} props.hour - Hour value (1-12)
 * @param {number} props.minute - Minute value (0-59)
 * @param {number} props.size - Size of the clock in pixels
 */
const AnalogueClock = ({ hour, minute = 0, size = 120 }) => {
  // Calculate angles for clock hands
  const hourAngle = (hour % 12) * 30 + minute * 0.5; // 30 degrees per hour, plus small correction for minutes
  const minuteAngle = minute * 6; // 6 degrees per minute

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div 
        className="absolute rounded-full border-2 border-gray-800 bg-white"
        style={{ width: size, height: size, top: 0, left: 0 }}
        role="img"
        aria-label="Analogue clock"
        aria-hidden="true"
      >
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="absolute font-bold text-gray-800"
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              transform: `rotate(${i * 30}deg)`,
            }}
          >
            <span 
              style={{ 
                transform: `rotate(${-i * 30}deg)`,
                position: 'absolute',
                top: '5px'
              }}
            >
              {i === 0 ? 12 : i}
            </span>
          </div>
        ))}

        {/* Hour hand */}
        <div 
          className="absolute bg-black rounded-full"
          style={{ 
            width: '6px', 
            height: `${size * 0.3}px`, 
            top: '50%', 
            left: '50%', 
            transformOrigin: 'bottom center',
            transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`
          }}
        />

        {/* Minute hand */}
        <div 
          className="absolute bg-black rounded-full"
          style={{ 
            width: '4px', 
            height: `${size * 0.4}px`, 
            top: '50%', 
            left: '50%', 
            transformOrigin: 'bottom center',
            transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`
          }}
        />

        {/* Clock center */}
        <div 
          className="absolute bg-red-500 rounded-full"
          style={{ 
            width: '10px', 
            height: '10px', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
    </div>
  );
};

export default AnalogueClock; 