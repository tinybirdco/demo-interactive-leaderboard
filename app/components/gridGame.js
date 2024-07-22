"use client";

import React, { useState, useEffect } from 'react';
import UsernameModal from './usernameModal';
import GameOverModal from './gameOverModal';
import { sendEvent } from '@/utils/tinybird'

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
} 

export default function GridGame({ onStartGame,  onUsernameChange, updateGameProgress }) {
  
  // Set various states
  const [gameId, setGameId] = useState(''); // Set game id
  const [gameStartTime, setGameStartTime] = useState(null); // Game start time
  const [clickStartTime, setClickStartTime] = useState(null); // Click start time
  const [targetIndex, setTargetIndex] = useState(null); // Target index of green circle
  const [username, setUsername] = useState(''); // Username
  const [isModalOpen, setIsModalOpen] = useState(true); // Username modal status
  const [clickCount, setClickCount] = useState(0); // Game clicks remaining
  const [gameOver, setGameOver] = useState(false); // Is the game over?
  const [showGameOverModal, setShowGameOverModal] = useState(false); // Show game over modal when game over
  const [tinybirdEnv, setTinybirdEnv] = useState({TB_HOST: '', TB_TOKEN: ''}); // Tinybird env for sending

  // State for the current game's cumulative duration
  const [currentGameProgress, setCurrentGameProgress] = useState([])

  // Lift the currentGameProgress up any time it changes
  useEffect(() => {
    updateGameProgress(currentGameProgress);
  },[currentGameProgress]);

  // Fetch Tinybird Env
  useEffect(() => {
      fetch('http://localhost:3001/api/tinybird')
          .then(response => response.json())
          .then(data => {
              setTinybirdEnv(data);
          })
          .catch(error => console.error('Error fetching Tinybird env variables: ', error));
  }, []);

  // Handle the click of one of the game buttons.
  const handleClick = (index, correct) => {
    if (!gameOver) {
      // Calculate time of click and compare it to start time to get duration between clicks
      const clickTime = new Date();
      const duration = (clickTime - clickStartTime);
      const totalDuration = clickTime - gameStartTime;

      // Set current progress
      setCurrentGameProgress([...currentGameProgress, {'click': currentGameProgress.length + 1, 'cumulative_duration': totalDuration}]);

      // Send the data to the Confluent proxy
      let payload = {
        'timestamp': new Date().toISOString(),
        'username': username,
        'game_id': gameId,
        'event_type': 'click',
        'start_time': clickStartTime.toISOString(),
        'click_time': clickTime.toISOString(),
        'duration': duration,
        'target_index': index,
        'correct': correct
      }
      // Send payload to Tinybird
      sendEvent(payload, tinybirdEnv.TB_TOKEN, tinybirdEnv.TB_HOST, 'game_events');

      // set new start time to latest click time
      setClickStartTime(clickTime);
      
      // Pick a random button to become the next target
      setTargetIndex(Math.floor(Math.random() * 25)+1);

      // Increment click count
      setClickCount(prevCount => prevCount + 1);

      // Check for game over
      if (clickCount >= 24 || !correct) {        
        // Show modal
        setGameOver(true);
        setShowGameOverModal(true);
        onStartGame(false);
      }
    }
  };

  // When username is submitted, handle the game start
  const handleStartGame = (username) => {
    // Set the username
    setUsername(username);
    onUsernameChange(username);

    // Set the start time for first click and reset game duration
    let startTime = new Date();
    setClickStartTime(startTime);
    setGameStartTime(startTime);

    // Create an initial target button
    const initialTarget = Math.floor(Math.random() * 25) + 1;
    setTargetIndex(initialTarget);
    
    // Create a random game ID
    setGameId(generateUUID());

    // Pass game started state to the analytics component
    onStartGame(true);
  };

  // When the game ends, handle starting a new game
  const handlePlayAgain = () => {
    // Reset the click count to zero and current game progress
    setClickCount(0);
    setCurrentGameProgress([]);
    
    // Reset game and remove game over modal
    setGameOver(false);
    setShowGameOverModal(false);

    // Set the start time for first click and reset game duration
    let startTime = new Date();
    setClickStartTime(startTime);
    setGameStartTime(startTime);

    // Set a new target button
    const initialTarget = Math.floor(Math.random() * 25)+1;
    setTargetIndex(initialTarget);

    // Create a random game ID
    setGameId(generateUUID());

    // Pass game started state to the analytics component
    onStartGame(true);
  };

  const handleStartOver = () => {
    setGameOver(true);
    onStartGame(false);
    handlePlayAgain();
  }

  // Render 25 buttons in the grid
  const renderButtons = () => {
    const buttons = [];
    for (let i = 1; i < 26; i++) {
      buttons.push(
        <button
          key={i}
          // If button is the target, add the 'target' class
          className={`button ${targetIndex === i ? 'target' : ''}`}

          // When clicked, pass the key of the clicked button and check if it is the target
          onClick={() => handleClick(i, i === targetIndex)}

          // Disable buttons when game is over
          disabled={gameOver}
        >{i}</button>
      );
    }
    return buttons;
  };

  return (
    <div className='app-container'>
      <UsernameModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onStartGame={handleStartGame}
      />
      <GameOverModal
        isOpen={showGameOverModal}
        onPlayAgain={handlePlayAgain}
      />
      <div className='top-container'>
        <h2 className = 'click-count'>{25 - clickCount}</h2>
        <button 
          className='start-button'
          onClick={handleStartOver}>Start Over
        </button>
      </div>
      <div className='buttons-container'>
        {renderButtons()}
      </div>
    </div>
  );
}