# Build an interactive leaderboard with React and Tinybird

Learn how to build a React app that emits game events data to Tinybird using HTTP streaming, and then utilizes Tinybird to query data and publish APIs which are integrated back into the React app for to provide motivational interactive leaderboards.

![Gif of the final game](/img/game-gif.gif)

### Prerequisites

- Python 3.8 (only if you use the data generator)
- Node.js

## Instructions

Follow these instructions to deploy the working version of this application.

### 0. Create a free Tinybird Workspace

First, create a [free Tinybird account](https://www.tinybird.co/signup). Then create a new Workspace when prompted. You can name it whatever you want.

### 1. Clone the repository

```sh
git clone https://github.com/tinybirdco/demo-interactive-leaderboard.git
cd demo-interactive-leaderboard
```

### 2. Install app dependencies

```sh
cd app
npm install
```

### 3. Install the Tinybird CLI

```sh
cd tinybird
python -m venv .venv
source .venv/bin/activate
pip install tinybird-cli
```

### 4. Authenticate to Tinybird

Copy your User Admin Token from the Tinybird UI. Your user admin token is the token with the format admin <your email address>.

From the `/tinybird` directory, run the following command:

```sh
tb auth --token <your user admin token>
```

> :warning: Your token and workspace details will be stored in a .tinyb file. If you intend to push this to a public repository, add the `.tinyb` to your `.gitignore`.

### 5. Push the resources to Tinybird

Run the following command to push Tinybird resources to the Tinybird server.

```sh
cd tinybird
tb push --force
```

### 6. Create local Environment Variables.

Create an `.env.local` and add the following:

```
TB_HOST=<your tinybird host>>
TB_TOKEN=<your user admin token OR create datasource token>
TB_WS_ID=<the id of your Tinybird workspace. Used for JWT creation.>
TB_SIGNING_KEY=<your workspace admin token. Used to sign JWTs.>
```

Note you can copy the any token from the Tinybird CLI with `tb token copy <token name>`.

### 10. Run the "backend"" server

This app uses an Express app to proxy as a backend server to store Tinybird tokens and host an API route to generate a JWT. Run the backend server from the `/services` directory:

```sh
cd services
node server.js
```

If you visit `http://localhost:3001` you'll see a message that the server is running.

### 11. Run the app!

Run the application!

```sh
npm run dev
```

Open it at `http://localhost:3000` and play the game. Have fun, and try to beat your record!

## Contributing

If you find any issues or have suggestions for improvements, please submit an issue or a [pull request](https://github.com/tinybirdco/demo-interactive-leaderboard/pulls?q=is%3Apr+is%3Aopen+sort%3Aupdated-desc).

## License

This code is available under the MIT license. See the [LICENSE](https://github.com/tinybirdco/demo-interactive-leaderboard/blob/main/LICENSE.txt) file for more details.

## Need help?

&bull; [Community Slack](https://www.tinybird.co/community) &bull; [Tinybird Docs](https://www.tinybird.co/docs) &bull;

## Authors

- [Cameron Archer](https://github.com/tb-peregrine)
