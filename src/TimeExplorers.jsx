import React, { useState, useEffect, useCallback } from 'react';

// Komponenta za analogni sat
const AnalogueClock = ({ hour, minute = 0, size = 120 }) => {
  // Izračunaj kutove za kazaljke
  const hourAngle = (hour % 12) * 30 + minute * 0.5; // 30 stupnjeva po satu, plus mala korekcija za minute
  const minuteAngle = minute * 6; // 6 stupnjeva po minuti

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div 
        className="absolute rounded-full border-2 border-gray-800 bg-white"
        style={{ width: size, height: size, top: 0, left: 0 }}
      >
        {/* Oznake za sate */}
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

        {/* Kazaljka za sate */}
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

        {/* Kazaljka za minute */}
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

        {/* Središte sata */}
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

// Komponenta za animaciju sata
const ClockAnimation = ({ startHour, startMinute = 0, endHour, endMinute = 0 }) => {
  const [currentHour, setCurrentHour] = useState(startHour);
  const [currentMinute, setCurrentMinute] = useState(startMinute);
  const [animationState, setAnimationState] = useState('initial'); // 'initial', 'animating', 'final'
  
  // Resetiraj animaciju kada se promijene početna ili krajnja vrijednost
  useEffect(() => {
    setCurrentHour(startHour);
    setCurrentMinute(startMinute);
    setAnimationState('initial');
  }, [startHour, startMinute, endHour, endMinute]);
  
  // Pokreni animaciju
  const startAnimation = () => {
    if (animationState === 'animating') return;
    
    setAnimationState('animating');
    let currentH = startHour;
    let currentM = startMinute;
    let interval;
    
    const animationSpeed = 100; // brzina animacije u ms
    
    interval = setInterval(() => {
      // Pomakni minute
      currentM += 5; // Pomakni za 5 minuta u svakom koraku
      
      // Provjeri treba li povećati sat
      if (currentM >= 60) {
        currentM = 0;
        currentH = (currentH % 12) + 1;
        if (currentH === 13) currentH = 1;
      }
      
      setCurrentHour(currentH);
      setCurrentMinute(currentM);
      
      // Zaustavi animaciju kada dođemo do krajnjeg vremena
      const reachedEnd = 
        (currentH === endHour && currentM >= endMinute) || 
        (currentH > endHour && endHour < startHour); // Za slučajeve kada prelazimo preko 12
      
      if (reachedEnd) {
        clearInterval(interval);
        setCurrentHour(endHour);
        setCurrentMinute(endMinute);
        setAnimationState('final');
      }
    }, animationSpeed);
    
    // Očisti interval ako se komponenta ukloni tijekom animacije
    return () => clearInterval(interval);
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
      
      <button 
        className={`mt-2 px-4 py-1 rounded-full text-white ${
          animationState === 'animating' ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        onClick={startAnimation}
        disabled={animationState === 'animating'}
      >
        {animationState === 'initial' ? 'Pokreni animaciju' : 
         animationState === 'animating' ? 'Animacija u tijeku...' : 'Ponovi animaciju'}
      </button>
    </div>
  );
};

const TimeExplorers = () => {
  // Game states
  const [gameState, setGameState] = useState('start'); // start, playing, success, feedback
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [level, setLevel] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [characterChoice, setCharacterChoice] = useState(null);
  const [target, setTarget] = useState(10); // Ciljani broj pitanja za završetak
  
  // Podaci za animaciju sata
  const [clockData, setClockData] = useState({
    startHour: 8,
    startMinute: 0,
    endHour: 9,
    endMinute: 0
  });
  
  // Audio feedback (simulated)
  const playSound = (type) => {
    console.log(`Playing ${type} sound`);
    // Would connect to actual audio in a full implementation
  };

  // Generate a random time problem based on level
  const generateQuestion = useCallback(() => {
    const questionTypes = [
      // Level 1: Simple hour differences (1-3 hours)
      () => {
        const startHour = Math.floor(Math.random() * 10) + 1; // 1-10
        const endHour = startHour + Math.floor(Math.random() * 3) + 1; // 1-3 hours later
        const startPeriod = startHour < 12 ? 'ujutro' : 'popodne';
        const endPeriod = endHour < 12 ? 'ujutro' : 'popodne';
        
        const activities = ['škola', 'trening', 'ples', 'glazbena škola', 'igranje'];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        return {
          question: `Ako je sada ${startHour} sati ${startPeriod} i ${activity} počinje u ${endHour} sati ${endPeriod}, koliko sati imaš do tada?`,
          answer: endHour - startHour,
          hint: `Razmisli koliko je sati od ${startHour} do ${endHour}.`,
          answerType: 'hour' // Mark this as requiring only hour
        };
      },
      
      // Level 2: More complex scenarios with half hours
      () => {
        const activities = ['škola', 'ručak', 'odmor', 'domaća zadaća', 'igranje'];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        const startHour = Math.floor(Math.random() * 12) + 1; // 1-12
        const startMinute = Math.random() > 0.5 ? 0 : 30;
        const hoursLater = Math.floor(Math.random() * 3) + 1; // 1-3 hours later
        const endHour = (startHour + hoursLater) % 12 || 12;
        const endMinute = startMinute;
        
        const startTimeStr = `${startHour}:${startMinute === 0 ? '00' : '30'}`;
        const endTimeStr = `${endHour}:${endMinute === 0 ? '00' : '30'}`;
        
        return {
          question: `Ako ${activity} počinje u ${startTimeStr} i završava u ${endTimeStr}, koliko sati traje?`,
          answer: hoursLater,
          hint: `Izbroji sate od ${startTimeStr} do ${endTimeStr}.`,
          answerType: 'hour' // Mark this as requiring only hour
        };
      },
      
      // Level 3: More complex scenarios with minutes
      () => {
        const startHour = Math.floor(Math.random() * 12) + 1;
        
        // Times in minutes - adding more varied options including 70 minutes
        const durations = [15, 30, 45, 60, 70, 75, 90, 120];
        const durationMinutes = durations[Math.floor(Math.random() * durations.length)];
        const durationHours = Math.floor(durationMinutes / 60);
        const remainingMinutes = durationMinutes % 60;
        
        // Format the time text in Croatian
        const timeText = durationHours > 0 
          ? (remainingMinutes > 0 
              ? `${durationHours} sat${durationHours === 1 ? '' : durationHours < 5 ? 'a' : 'i'} i ${remainingMinutes} minut${remainingMinutes === 1 ? 'a' : remainingMinutes < 5 ? 'e' : 'a'}` 
              : `${durationHours} sat${durationHours === 1 ? '' : durationHours < 5 ? 'a' : 'i'}`)
          : `${durationMinutes} minut${durationMinutes === 1 ? 'a' : durationMinutes < 5 ? 'e' : 'a'}`;
        
        const scenarios = [
          `Ako je večera u ${startHour} sati i vrijeme za spavanje je ${timeText} kasnije, u koliko sati je vrijeme za spavanje?`,
          `Ako počneš gledati film u ${startHour}:00 i traje ${timeText}, u koliko sati završava?`,
          `Ako ${characterChoice === 'boy' ? 'nogometni trening' : 'ples'} počinje u ${startHour}:00 i traje ${timeText}, u koliko sati završava?`
        ];
        
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        
        // Calculate end time correctly
        let endHour = startHour;
        let endMinute = 0;
        
        // Add duration to the start time
        endHour += Math.floor(durationMinutes / 60); // Add full hours
        endMinute += durationMinutes % 60;          // Add remaining minutes
        
        if (endMinute >= 60) {
          endHour += 1;
          endMinute -= 60;
        }
        
        // Convert to 12-hour format if needed
        if (endHour > 12) {
          endHour = endHour % 12;
          if (endHour === 0) endHour = 12; // 12 instead of 0
        }
        
        // Format the answer based on whether we have minutes or not
        let answer;
        let answerType = 'time'; // Default to time format
        
        if (endMinute === 0) {
          answer = endHour;
          answerType = 'hour'; // Only hour needed
        } else {
          // Format with minutes
          answer = `${endHour}:${endMinute.toString().padStart(2, '0')}`;
        }
        
        return {
          question: scenario,
          answer: answer,
          hint: `Dodaj ${timeText} na ${startHour}:00.`,
          answerType: answerType
        };
      }
    ];
    
    // Choose question type based on level
    const typeIndex = Math.min(level - 1, questionTypes.length - 1);
    return questionTypes[typeIndex]();
  }, [level, characterChoice]); // Add dependencies: level and characterChoice used within function

  // Start a new game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setTarget(10); // Ciljani broj pitanja za završetak igre
    nextQuestion();
  };

  // Generate next question - wrapped in useCallback to prevent unnecessary recreation
  const nextQuestion = useCallback(() => {
    const newQuestion = generateQuestion();
    setCurrentQuestion(newQuestion);
    setUserAnswer('');
    setTimeLeft(30);
    setShowHint(false);
    
    // Postavi podatke za animaciju sata ovisno o pitanju
    // Parsiramo pitanje da izvučemo vrijeme
    if (typeof newQuestion.answer === 'string' && newQuestion.answer.includes(':')) {
      // Za pitanja s minutama
      const endTimeParts = newQuestion.answer.split(':');
      const endHour = parseInt(endTimeParts[0], 10);
      const endMinute = parseInt(endTimeParts[1], 10);
      
      // Izvuci početno vrijeme iz pitanja (npr. "... počinje u 8:00 ...")
      const questionText = newQuestion.question;
      const startTimeMatch = questionText.match(/počinje u (\d+):(\d+)/);
      const startHour = startTimeMatch ? parseInt(startTimeMatch[1], 10) : 8;
      const startMinute = startTimeMatch ? parseInt(startTimeMatch[2], 10) : 0;
      
      setClockData({
        startHour,
        startMinute,
        endHour,
        endMinute
      });
    } else {
      // Za jednostavna pitanja samo sa satima
      const questionText = newQuestion.question;
      
      // Pokušaj pronaći početno vrijeme
      let startTimeMatch = questionText.match(/sada (\d+) sati/);
      if (!startTimeMatch) {
        startTimeMatch = questionText.match(/počinje u (\d+) sati/);
      }
      
      const startHour = startTimeMatch ? parseInt(startTimeMatch[1], 10) : 8;
      
      // Pokušaj pronaći krajnje vrijeme
      let endTimeMatch = questionText.match(/počinje u (\d+) sati/);
      if (!endTimeMatch) {
        endTimeMatch = questionText.match(/završava u (\d+) sati/);
      }
      
      const endHour = endTimeMatch ? parseInt(endTimeMatch[1], 10) : 
                     (typeof newQuestion.answer === 'number' ? startHour + newQuestion.answer : 9);
                     
      setClockData({
        startHour,
        startMinute: 0,
        endHour,
        endMinute: 0
      });
    }
  }, [generateQuestion]); // Add any dependencies used inside the function

  // Check the user's answer
  const checkAnswer = () => {
    // Get user input
    const userInput = userAnswer.trim();
    
    // Handle different answer types
    let isCorrect = false;
    
    if (currentQuestion.answerType === 'hour') {
      // For simple hour answers
      const userNum = parseInt(userInput, 10);
      
      if (isNaN(userNum)) {
        setFeedback("Molim unesi broj!");
        return;
      }
      
      isCorrect = userNum === currentQuestion.answer;
    } 
    else if (currentQuestion.answerType === 'time') {
      // For time format answers (e.g., "8:30")
      // Accept different formats (8:30, 8.30, 8,30)
      const normalizedInput = userInput.replace(',', ':').replace('.', ':');
      const normalizedAnswer = String(currentQuestion.answer).replace(',', ':').replace('.', ':');
      
      isCorrect = normalizedInput === normalizedAnswer;
    }
    
    setTotalQuestions(totalQuestions + 1);
    
    if (isCorrect) {
      const pointsEarned = Math.max(1, Math.floor(timeLeft / 5));
      setScore(score + pointsEarned);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback(`Točno! +${pointsEarned} bodova`);
      playSound('success');
      
      // Level up every 5 correct answers
      if ((correctAnswers + 1) % 5 === 0 && level < 3) {
        setLevel(level + 1);
      }
      
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      setFeedback(`Nije točno. Točan odgovor je ${currentQuestion.answer}. Idemo probati drugi zadatak!`);
      playSound('incorrect');
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setFeedback(`Vrijeme je isteklo! Točan odgovor je ${currentQuestion.answer}.`);
          setTimeout(() => nextQuestion(), 2000);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, currentQuestion, nextQuestion]);

  // Handle keyboard input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && gameState === 'playing') {
      checkAnswer();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-blue-50">
      {/* Character Selection Screen */}
      {!characterChoice && gameState === 'start' && (
        <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-6 text-blue-600">Vremenski Istraživači</h1>
          <p className="mb-6">Odaberi svog lika:</p>
          <div className="flex justify-around mb-6">
            <button
              className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600"
              onClick={() => setCharacterChoice('boy')}
            >
              Marko
            </button>
            <button
              className="bg-pink-500 text-white py-2 px-6 rounded-full hover:bg-pink-600"
              onClick={() => setCharacterChoice('girl')}
            >
              Ana
            </button>
          </div>
        </div>
      )}
      
      {/* Start Screen */}
      {characterChoice && gameState === 'start' && (
        <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-6 text-blue-600">Vremenski Istraživači</h1>
          <p className="mb-6">Pomozi {characterChoice === 'boy' ? 'Marku' : 'Ani'} naučiti o vremenu!</p>
          <button
            className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600"
            onClick={startGame}
          >
            Počni igru!
          </button>
        </div>
      )}
      
      {/* Game Screen */}
      {gameState === 'playing' && (
        <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
          <div className="flex justify-between mb-4">
            <div className="text-lg font-bold">Bodovi: {score}</div>
            <div className="text-lg font-bold">Razina: {level}</div>
            <div className={`text-lg font-bold ${timeLeft < 10 ? 'text-red-500' : ''}`}>
              Vrijeme: {timeLeft}s
            </div>
          </div>
          
          {/* Traka napretka */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, (totalQuestions / target) * 100)}%` }}
            ></div>
            <div className="text-xs text-center mt-1">
              Napredak: {totalQuestions} / {target} pitanja
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-blue-100 rounded-lg">
            <p className="text-lg mb-3">{currentQuestion?.question}</p>
            
            {/* Animirani sat */}
            <ClockAnimation 
              startHour={clockData.startHour}
              startMinute={clockData.startMinute}
              endHour={clockData.endHour}
              endMinute={clockData.endMinute}
            />
          </div>
          
          {showHint && (
            <div className="mb-4 p-2 bg-yellow-100 rounded border border-yellow-200">
              <p className="text-sm text-yellow-800">Pomoć: {currentQuestion?.hint}</p>
            </div>
          )}
          
          <div className="mb-4">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-2 border rounded text-center text-xl"
              placeholder="Tvoj odgovor"
            />
          </div>
          
          <div className="flex justify-between">
            <button
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
              onClick={() => setShowHint(true)}
            >
              Pomoć
            </button>
            <button
              className="bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600"
              onClick={checkAnswer}
            >
              Provjeri
            </button>
          </div>
          
          {feedback && (
            <div className={`mt-4 p-2 rounded text-center ${feedback.startsWith('Točno') ? 'bg-green-100' : 'bg-red-100'}`}>
              {feedback}
            </div>
          )}
          
          <div className="mt-4 text-center">
            <p>Točno: {correctAnswers} / Ukupno: {totalQuestions}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeExplorers;