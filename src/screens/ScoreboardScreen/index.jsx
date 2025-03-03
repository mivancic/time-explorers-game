import React, { useState, useEffect } from 'react';
import { getScores } from '../../data/storage';

/**
 * ScoreboardScreen component displays player scores and statistics
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Function to call when closing the scoreboard
 */
const ScoreboardScreen = ({ onClose }) => {
  const [scores, setScores] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [sortDirection, setSortDirection] = useState('desc');
  
  useEffect(() => {
    // Load scores when component mounts
    const loadedScores = getScores();
    setScores(loadedScores);
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hr-HR') + ' ' + date.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Toggle sort direction
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Filter and sort scores
  const processedScores = scores
    .filter(score => {
      if (filter === 'all') return true;
      return score.level === parseInt(filter);
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'score') {
        comparison = a.score - b.score;
      } else if (sortBy === 'level') {
        comparison = a.level - b.level;
      } else if (sortBy === 'date') {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'playerName') {
        comparison = a.playerName.localeCompare(b.playerName);
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  
  // Calculate statistics
  const totalGames = scores.length;
  const averageScore = totalGames > 0 
    ? Math.round(scores.reduce((sum, score) => sum + score.score, 0) / totalGames) 
    : 0;
  const highestScore = totalGames > 0 
    ? Math.max(...scores.map(score => score.score)) 
    : 0;
  
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg" data-test="scoreboard-container">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600" data-test="scoreboard-text-title">Rezultati</h2>
        <button 
          onClick={onClose}
          className="text-gray-700 hover:text-gray-900"
          aria-label="Zatvori"
          data-test="scoreboard-button-close"
        >
          ✕
        </button>
      </div>
      
      {/* Statistics Summary */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg" data-test="scoreboard-container-stats">
        <h3 className="font-semibold text-blue-800 mb-2">Statistika</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm text-gray-600">Ukupno igara</div>
            <div className="font-bold text-lg" data-test="scoreboard-text-games">{totalGames}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Prosječni bodovi</div>
            <div className="font-bold text-lg" data-test="scoreboard-text-average">{averageScore}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Najviši rezultat</div>
            <div className="font-bold text-lg" data-test="scoreboard-text-high">{highestScore}</div>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Filtriraj po razini:
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="all">Sve razine</option>
          <option value="1">Razina 1</option>
          <option value="2">Razina 2</option>
          <option value="3">Razina 3</option>
        </select>
      </div>
      
      <div className="overflow-y-auto max-h-64">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="py-2 px-4 font-semibold">#</th>
              <th 
                className="py-2 px-4 font-semibold cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('playerName')}
              >
                Igrač {sortBy === 'playerName' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="py-2 px-4 font-semibold cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('score')}
              >
                Bodovi {sortBy === 'score' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="py-2 px-4 font-semibold cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('level')}
              >
                Razina {sortBy === 'level' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="py-2 px-4 font-semibold cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('date')}
              >
                Datum {sortBy === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {processedScores.length > 0 ? (
              processedScores.map((score, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{score.playerName}</td>
                  <td className="py-2 px-4 font-semibold">{score.score}</td>
                  <td className="py-2 px-4">{score.level}</td>
                  <td className="py-2 px-4 text-sm">{formatDate(score.date)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                  Nema rezultata za prikaz
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-center">
        <button
          onClick={onClose}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-300"
          data-test="scoreboard-button-back"
        >
          Natrag na igru
        </button>
      </div>
    </div>
  );
};

export default ScoreboardScreen; 