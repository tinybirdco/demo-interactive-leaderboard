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

export {
    sendEvent
}