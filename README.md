# Hedgehog

A Web App for Analyzing and Replicating Investment Portfolios from Top Hedge Funds

Check out our deployed site at https://fsahedgehog.herokuapp.com/

## Setup

* Fork and clone this repo
* Run the following commands:

```
npm install
createdb hedgehog
```

* Grab free API keys from:

https://sec-api.io/
https://www.openfigi.com/api

* Create .env file in root directory

```
touch .env
```

* Add your api keys to your .env file:

```
EDGAR_KEY=[your api key here]
OPEN_FIJI_KEY=[your api key here]
```

* Seed your database & start your server:

```
npm run seed
npm run start-dev
```

* Get rich!
