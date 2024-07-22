const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
    const { username } = req.body;
    const expiration = new Date();
    const signingKey = process.env.TB_SIGNING_KEY;
    const workspaceId = process.env.TB_WS_ID;

    // JWT expires after 1 hour
    expiration.setTime(expiration.getTime() + 1000 * 60 * 60);

    const payload = {
        workspace_id: workspaceId,
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

    const token = jwt.sign(payload, signingKey);
    res.status(200).json({ token })
};