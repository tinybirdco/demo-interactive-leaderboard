'use client';

import React, { useState, useEffect } from 'react';
import { fastestClickUrl, fetchTinybirdApi } from '@/utils/tinybird';
import { Card } from '@tremor/react';

const FastestClick = ({ host, jwt, gameStarted}) => {
    const [data, setData] = useState([])

    useEffect(() => {
        if (jwt) { 
            let url = fastestClickUrl(host, jwt);
            fetchTinybirdApi(url, setData);
        }
    }, [jwt, gameStarted]);

    const renderText = () => {
        if(data && data.length > 0) {
            return `${data[0].duration} ms`;
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
            <p>Fastest Click</p>
            <h2>{renderText()}</h2>
        </Card>
    );
};

export default FastestClick;