const fastestGameUrl = (host, token) => {
    return `https://${host}/v0/pipes/fastest_game.json?user=&token=${token}`
}

const fastestClickUrl = (host, token) => {
    return `https://${host}/v0/pipes/fastest_click.json?user=&token=${token}`
}

const favoriteTargetUrl = (host, token) => {
    return `https://${host}/v0/pipes/favorite_target.json?user=&token=${token}`
}

const nemesisTargetUrl = (host, token) => {
    return `https://${host}/v0/pipes/nemesis_target.json?user=&token=${token}`
}

const gameTrackerUrl = (host, token) => {
    return `https://${host}/v0/pipes/game_tracker.json?user=&token=${token}`
}

const leaderboardUrl = (host, token) => {
    return `https://${host}/v0/pipes/leaderboard.json?&token=${token}`
}

const sendEvent = async (payload, token, host, datasource) => {
    try {
        fetch(`https://${host}/v0/events?name=${datasource}`,
        {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        )
        .then(res => res.json())
        .then(data => console.log('Data sent to Tinybird: ', data))
  } catch (error) {
    console.error('Error sending data to Tinybird: ', error.message);
  }
}

const fetchTinybirdApi = async (url, setData) => {
    try {
        const response = await fetch(url);
        const jsonData = await response.json();
        setData(jsonData.data);
    } catch (error) {
        console.error('Error fetching data: ', error)
    }
    
}

export {
    sendEvent,
    fetchTinybirdApi,
    fastestGameUrl,
    fastestClickUrl,
    favoriteTargetUrl,
    nemesisTargetUrl,
    gameTrackerUrl,
    leaderboardUrl
}