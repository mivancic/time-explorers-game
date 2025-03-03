import React, { useState, useEffect } from 'react';
import AnalogueClock from '../AnalogueClock';

/**
 * ClockAnimation component renders a clock animation between start and end times
 * 
 * @param {Object} props - Component props
 * @param {number} props.startHour - Starting hour (1-12)
 * @param {number} props.startMinute - Starting minute (0-59)
 * @param {number} props.endHour - Ending hour (1-12)
 * @param {number} props.endMinute - Ending minute (0-59)
 * @param {number} props.speed - Animation speed in milliseconds (default: 100)
 */
const ClockAnimation = ({ 
  startHour, 
  startMinute = 0, 
  endHour, 
  endMinute = 0,
  speed = 100
}) => {
  const [currentHour, setCurrentHour] = useState(startHour);
  const [currentMinute, setCurrentMinute] = useState(startMinute);
  const [animationState, setAnimationState] = useState('initial'); // 'initial', 'animating', 'final'
  const [intervalId, setIntervalId] = useState(null);
  
  // Reset animation when start or end values change
  useEffect(() => {
    setCurrentHour(startHour);
    setCurrentMinute(startMinute);
    setAnimationState('initial');
    
    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [startHour, startMinute, endHour, endMinute, intervalId]);
  
  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);
  
  // Start animation
  const startAnimation = () => {
    if (animationState === 'animating') return;
    
    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    setAnimationState('animating');
    let currentH = startHour;
    let currentM = startMinute;
    
    const interval = setInterval(() => {
      // Move minutes
      currentM += 5; // Move 5 minutes in each step
      
      // Check if we need to increase hour
      if (currentM >= 60) {
        currentM = 0;
        currentH = (currentH % 12) + 1;
        if (currentH === 13) currentH = 1;
      }
      
      setCurrentHour(currentH);
      setCurrentMinute(currentM);
      
      // Stop animation when reaching end time
      const reachedEnd = 
        (currentH === endHour && currentM >= endMinute) || 
        (currentH > endHour && endHour < startHour); // For cases when we go past 12
      
      if (reachedEnd) {
        clearInterval(interval);
        setIntervalId(null);
        setCurrentHour(endHour);
        setCurrentMinute(endMinute);
        setAnimationState('final');
      }
    }, speed);
    
    setIntervalId(interval);
  };
  
  // Stop animation
  const stopAnimation = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setAnimationState('paused');
  };
  
  // Reset animation to start
  const resetAnimation = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setCurrentHour(startHour);
    setCurrentMinute(startMinute);
    setAnimationState('initial');
  };
  
  return (
    <div className="flex flex-col items-center mt-2 mb-4">
      <div className="flex space-x-8 items-center">
        <div className="flex flex-col items-center">
          <AnalogueClock hour={startHour} minute={startMinute} size={100} />
          <p className="mt-1 text-sm font-bold">Početak: {startHour}:{startMinute.toString().padStart(2, '0')}</p>
        </div>
        
        <div className="flex flex-col items-center">
          <AnalogueClock hour={currentHour} minute={currentMinute} size={100} />
          <p className="mt-1 text-sm">{currentHour}:{currentMinute.toString().padStart(2, '0')}</p>
        </div>
        
        <div className="flex flex-col items-center">
          <AnalogueClock hour={endHour} minute={endMinute} size={100} />
          <p className="mt-1 text-sm font-bold">Kraj: {endHour}:{endMinute.toString().padStart(2, '0')}</p>
        </div>
      </div>
      
      <div className="mt-2 flex space-x-2">
        {animationState !== 'animating' && (
          <button 
            onClick={startAnimation}
            className="bg-blue-500 text-white text-sm py-1 px-3 rounded hover:bg-blue-600 transition duration-300"
          >
            {animationState === 'initial' || animationState === 'paused' ? 'Pokreni animaciju' : 'Ponovi animaciju'}
          </button>
        )}
        
        {animationState === 'animating' && (
          <button 
            onClick={stopAnimation}
            className="bg-yellow-500 text-white text-sm py-1 px-3 rounded hover:bg-yellow-600 transition duration-300"
          >
            Pauziraj
          </button>
        )}
        
        {(animationState === 'final' || animationState === 'paused') && (
          <button 
            onClick={resetAnimation}
            className="bg-gray-500 text-white text-sm py-1 px-3 rounded hover:bg-gray-600 transition duration-300"
          >
            Resetiraj
          </button>
        )}
      </div>
    </div>
  );
};

export default ClockAnimation; 