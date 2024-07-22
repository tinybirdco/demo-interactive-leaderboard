import React from 'react';
import Modal from 'react-modal';

const GameOverModal = ({ isOpen, onPlayAgain, duration }) => {
  return (
    <Modal
      className='info-modal'
      isOpen={isOpen}
      contentLabel="Game Over!"
    >
      <h2>Game Over!</h2>
      <p>{duration} ms</p>
      <button className = 'start-button' onClick={onPlayAgain}>Play Again!</button>
    </Modal>
  );
};

export default GameOverModal;