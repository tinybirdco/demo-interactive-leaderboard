"use client";

import React, { useState, useEffect } from 'react';
import UsernameModal from './usernameModal';
import GameOverModal from './gameOverModal';
import Countdown from './countdown';

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
  const [showCountdown, setShowCountdown] = useState(false); // Show countdown timer
  const [gameStartTime, setGameStartTime] = useState(null); // Game start time
  const [clickStartTime, setClickStartTime] = useState(null); // Click start time
  const [targetIndex, setTargetIndex] = useState(null); // Target index of green circle
  const [username, setUsername] = useState(''); // Username
  const [showUsernameModal, setShowUsernameModal] = useState(true); // Username modal status
  const [clickCount, setClickCount] = useState(0); // Game clicks remaining
  const [gameOver, setGameOver] = useState(false); // Is the game over?
  const [showGameOverModal, setShowGameOverModal] = useState(false); // Show game over modal when game over
  const [currentGameProgress, setCurrentGameProgress] = useState([]) // Current game's cumulative duration

  // Lift the currentGameProgress up any time it changes
  useEffect(() => {
    updateGameProgress(currentGameProgress);
  },[currentGameProgress]);

  // Handle the countdown timer before starting a new game
  const handleCountdown = () => {
    setShowCountdown(true);
  };

  // Start the game when the countdown finishes
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    handleStartGame();
  }

  // Set the username when input
  const handleSetUsername = (username) => {
    setUsername(username);
    onUsernameChange(username);
    handleCountdown();
  }

  // Show username modal
  const handleShowUsernameModal = () => {
    setShowUsernameModal(true);
  }

  // Handle the click of one of the game buttons.
  const handleClick = (index, correct) => {
    if (!gameOver) {
      // Calculate time of click and compare it to start time to get duration between clicks
      const clickTime = new Date();
      const duration = (clickTime - clickStartTime);
      const totalDuration = clickTime - gameStartTime;

      // Set current progress
      setCurrentGameProgress([...currentGameProgress, {'click': currentGameProgress.length + 1, 'cumulative_duration': totalDuration}]);

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
  const handleStartGame = () => {
    // Set the click count to zero and current game progress
    setClickCount(0);
    setCurrentGameProgress([]);

    // Reset game and remove game over modal
    setGameOver(false);
    setShowGameOverModal(false);

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
      {showCountdown && <Countdown onComplete={handleCountdownComplete} />}
      <UsernameModal
        isOpen={showUsernameModal}
        onRequestClose={() => setShowUsernameModal(false)}
        onSetUsername={handleSetUsername}
      />
      <GameOverModal
        isOpen={showGameOverModal}
        onPlayAgain={handleCountdown}
      />
      <div className='top-container'>
        <h2 className = 'click-count'>{25 - clickCount}</h2>
        <p>Click the green target as fast as it moves!</p>
        <div className = 'top-buttons-container'>
          <button 
            className='start-button'
            onClick={handleCountdown}>Start Over
          </button>
          <button 
            className='username-button'
            onClick={handleShowUsernameModal}>Set Username
          </button>
        </div>
      </div>
      <div className='buttons-container'>
        {renderButtons()}
      </div>
    </div>
  );
}