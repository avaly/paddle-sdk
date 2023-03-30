#!/bin/bash

set -euo pipefail

npm pack

mkdir ./build 2>/dev/null || true
mv -f paddle-sdk*.tgz ./build/paddle-sdk.tgz
tar xf ./build/paddle-sdk.tgz --directory=./build/

cd tests/esm/
rm -f package-lock.json
yarn
node ./index.js

cd ../cjs/
rm -f package-lock.json
yarn
node ./index.js
