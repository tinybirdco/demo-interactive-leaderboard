const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env.local'})

// Create an Express app for proxy
const app = express();

// Use JSON and CORS
app.use(express.json());
app.use(cors());    

// Show the service is running
app.get('/', (req, res) => {
    res.send('The server is now running!')
});

// Get Tinybird environment variables
app.get('/api/tinybird', (req, res) => {
    const envVariables = {
        TB_HOST: process.env.TB_HOST,
        TB_TOKEN: process.env.TB_TOKEN
    }

    res.json(envVariables);
});

// Generate JWT
app.post('/api/generateToken', (req, res) => {
    const { username } = req.body;
    const expiration = new Date();
    console.log('Generating JWT for', username);
    const signingKey = process.env.TB_SIGNING_KEY;

    // JWT expires after 1 hour
    expiration.setTime(expiration.getTime() + 1000 * 60 * 60);

    const payload = {
        workspace_id: process.env.TB_WS_ID,
        name: `frontend_jwt_${username}`,
        exp: Math.floor(expiration.getTime() / 1000),
        scopes: [
        {
            type: "PIPES:READ",
            resource: "fastest_click",
            "fixed_params": {
                user: username
            },
        },
        {
            type: "PIPES:READ",
            resource: "fastest_game",
            "fixed_params": {
                user: username
            },
        },
        {
            type: "PIPES:READ",
            resource: "favorite_target",
            "fixed_params": {
                user: username
            },
        },{
            type: "PIPES:READ",
            resource: "nemesis_target",
            "fixed_params": {
                user: username
            },
        },
        {
            type: "PIPES:READ",
            resource: "game_tracker",
            "fixed_params": {
                user: username
            },
        },
        {
            type: "PIPES:READ",
            resource: "leaderboard"
        }
        ]
    };
    console.log(payload);

    const token = jwt.sign(payload, signingKey);
    res.json({ token })
    console.log(token);
});

// Start the proxy server on localhost:3001
const server = app.listen(3001, () => {
    console.log('Server running on port 3001');
});