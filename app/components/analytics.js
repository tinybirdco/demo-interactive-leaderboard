'use client';

import React, { useState, useEffect } from 'react';
import FastestGame from './fastestGame';
import FastestClick from './fastestClick';
import FavoriteTarget from './favoriteTarget';
import NemesisTarget from './nemesisTarget';
import GameTracker from './gameTracker';
import Leaderboard from './leaderboard';

const TB_HOST = process.env.TB_HOST;
const TB_TOKEN = process.env.TB_TOKEN;

export default function Analytics({username, gameStarted, currentGameProgress}) {  
    // JWT
    const [jwt, setJwt] = useState('');

    // Generate JWT when username is updated
    useEffect(() => {
        if (username) {
            (async () => {
                try {
                    const jwtResponse = await fetch('/api/generateToken', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username })
                    });
                    const tokenData = await jwtResponse.json();
                    setJwt(tokenData.token);
                } catch (error) {
                    console.error('Error generating JWT: ', error.message);
                }
            })(); 
        }
    }, [username]);

    return (
        <div className='analytics-container'>
            <h2>Analytics for {username}</h2>
            <div className='metrics-container'>
                <FastestClick
                    host={tinybirdEnv.TB_HOST}
                    jwt={jwt}
                    gameStarted={gameStarted}
                />
                <FastestGame
                    host={tinybirdEnv.TB_HOST}
                    jwt={jwt}
                    gameStarted={gameStarted}
                />
                <FavoriteTarget
                    host={tinybirdEnv.TB_HOST}
                    jwt={jwt}
                    gameStarted={gameStarted}
                />
                <NemesisTarget
                    host={tinybirdEnv.TB_HOST}
                    jwt={jwt}
                    gameStarted={gameStarted}
                />
            </div>
            <GameTracker
                host={tinybirdEnv.TB_HOST}
                jwt={jwt}
                gameStarted={gameStarted}
                currentGameProgress={currentGameProgress}
            />
            <Leaderboard
                host={tinybirdEnv.TB_HOST}
                jwt={jwt}
                username={username}
                gameStarted={gameStarted}
            />
        </div>
    )
}

