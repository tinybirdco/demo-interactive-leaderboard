'use client';

import React, { useState, useEffect } from 'react';
import { favoriteTargetUrl, fetchTinybirdApi } from '@/utils/tinybird';
import { Card } from '@tremor/react';

const FavoriteTarget = ({host, jwt, gameStarted}) => {

    const [data, setData] = useState([])

    useEffect(() => {
        if (jwt) { 
            let url = favoriteTargetUrl(host, jwt);
            fetchTinybirdApi(url, setData);
        }
    }, [jwt, gameStarted]);

    const renderText = () => {
        if(data && data.length > 0) {
            return `${data[0].target_index}`;
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
            <p>Favorite Target</p>
            <h2>{renderText()}</h2>
        </Card>
    );
};

export default FavoriteTarget;