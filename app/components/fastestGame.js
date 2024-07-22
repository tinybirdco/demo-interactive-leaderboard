'use client';

import React, { useState, useEffect } from 'react';
import { fastestGameUrl, fetchTinybirdApi } from '@/utils/tinybird';
import { Card } from '@tremor/react';

const FastestGame = ({host, jwt, gameStarted}) => {

    const [data, setData] = useState([])

    useEffect(() => {
        if (jwt) { 
            let url = fastestGameUrl(host, jwt);
            fetchTinybirdApi(url, setData);
        }
    }, [jwt, gameStarted]);

    const renderText = () => {
        if(data && data.length > 0) {
            return `${data[0].total_duration} ms`;
        } else {
            return 'None';
        }
    }

    return (
        <Card 
            className="mt-6"
            decoration="top"
            decorationColor='zinc'
        >
            <p>Fastest Game</p>
            <h2>{renderText()}</h2>
        </Card>
    );
};

export default FastestGame;