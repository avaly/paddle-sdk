# Paddle.com Node.js SDK

[![Github Actions](https://github.com/avaly/paddle-sdk/actions/workflows/tests.yaml/badge.svg)](https://github.com/avaly/paddle-sdk/actions)
[![NPM version](https://img.shields.io/npm/v/paddle-sdk.svg?style=flat-square)](https://www.npmjs.com/package/paddle-sdk)

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

```ts
import { PaddleSDK } from 'paddle-sdk';

async function run() {
	const client = new PaddleSDK(
		'your-vendor-id-here',
		'your-unique-api-key-here'
	);

	const products = await client.getProducts();
	console.log(products);

	const plans = await client.getProductPlans(123);
	console.log(plans);
}

run();
```

For CommonJS:

```js
const { PaddleSDK } = require('paddle-sdk');
```

## Documentation

Read the [documentation](https://avaly.github.io/paddle-sdk/).

## Change log

The change log can be found here: [CHANGELOG.md](CHANGELOG.md).

## Authors and license

Author: [Valentin Agachi](http://agachi.name/).

MIT License, see the included [License.md](License.md) file.
