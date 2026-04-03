#!/bin/bash

set -euo pipefail

npm pack

mkdir ./build 2>/dev/null || true
mv -f paddle-sdk*.tgz ./build/paddle-sdk.tgz
tar xf ./build/paddle-sdk.tgz --directory=./build/

cd tests/esm/
rm -f pnpm-lock.yaml
pnpm install
node ./index.js

cd ../cjs/
rm -f pnpm-lock.yaml
pnpm install
node ./index.js
