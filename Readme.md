# Paddle.com Node.js SDK

[![Travis branch](https://img.shields.io/travis/avaly/paddle-sdk/master.svg?style=flat-square)](https://travis-ci.org/avaly/paddle-sdk)
[![NPM version](https://img.shields.io/npm/v/paddle-sdk.svg?style=flat-square)](https://www.npmjs.com/package/paddle-sdk)
[![Dependencies](https://img.shields.io/david/avaly/paddle-sdk.svg?style=flat-square)](https://david-dm.org/avaly/paddle-sdk)

Welcome to the [Paddle.com](https://www.paddle.com/) Node.js SDK documentation.

## Installation

Install the SDK module using `npm`:

```
$ npm install paddle-sdk
```

or using `yarn`:

```
$ yarn add paddle-sdk
```

## Usage

Using `Promise`:

```js
const PaddleSDK = require('paddle-sdk');

const client = new PaddleSDK('your-vendor-id-here', 'your-unique-api-key-here');

client.getProducts()
  .then(console.log)
  .then(() => client.getProductPlans(123))
  .then(console.log);
```

Using `async`/`await`:

```js
const PaddleSDK = require('paddle-sdk');

async function run() {
  const client = new PaddleSDK('your-vendor-id-here', 'your-unique-api-key-here');

  const products = await client.getProducts();
  console.log(products);

	const plans = await client.getProductPlans(123);
  console.log(plans);
}

run();
```

## Documentation

See the JSDoc markdown documentation in [Documentation.md](Documentation.md).

## Change log

The change log can be found here: [CHANGELOG.md](CHANGELOG.md).

## Authors and license

Author: [Valentin Agachi](http://agachi.name/).

MIT License, see the included [License.md](License.md) file.
