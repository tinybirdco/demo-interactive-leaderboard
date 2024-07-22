'use client';

import React, { useState, useEffect } from 'react';
import FastestGame from './fastestGame';
import FastestClick from './fastestClick';
import FavoriteTarget from './favoriteTarget';
import NemesisTarget from './nemesisTarget';
import Leaderboard from './leaderboard';

export default function Analytics({username, gameStarted, currentGameProgress}) { 
   
    // Set Tinybird env
    const [tinybirdEnv, setTinybirdEnv] = useState({TB_HOST: '', TB_TOKEN: ''});
    
    // JWT
    const [jwt, setJwt] = useState('');

    // Fetch Tinybird Env
    useEffect(() => {
        fetch('http://localhost:3001/api/tinybird')
            .then(response => response.json())
            .then(data => {
                setTinybirdEnv(data);
            })
            .catch(error => console.error('Error fetching Tinybird env variables: ', error));
    }, []);

    // Generate JWT when username is updated
    useEffect(() => {
        if (username) {
            (async () => {
                try {
                    const jwtResponse = await fetch('http://localhost:3001/api/generateToken', {
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
            <Leaderboard
                host={tinybirdEnv.TB_HOST}
                jwt={jwt}
                username={username}
                gameStarted={gameStarted}
            />
        </div>
    )
}

