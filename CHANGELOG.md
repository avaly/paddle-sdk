# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.7.0](https://github.com/avaly/paddle-sdk/compare/v4.6.2...v4.7.0) (2024-10-21)


### Features

* Add `deleteSubscriptionModifier` ([#106](https://github.com/avaly/paddle-sdk/issues/106)) ([19b933b](https://github.com/avaly/paddle-sdk/commit/19b933b5a54d39c0b8c03afc94010a11249ce63c))

### [4.6.2](https://github.com/avaly/paddle-sdk/compare/v4.6.1...v4.6.2) (2023-11-11)

### [4.6.1](https://github.com/avaly/paddle-sdk/compare/v4.6.0...v4.6.1) (2023-06-22)


### Bug Fixes

* Add `getPrices` response type ([#90](https://github.com/avaly/paddle-sdk/issues/90)) ([3b4cfd2](https://github.com/avaly/paddle-sdk/commit/3b4cfd2ea8afb3191c431f35da0d24a72fabdb45))
* Fix `getSubscriptionModifiers` response type ([#91](https://github.com/avaly/paddle-sdk/issues/91)) ([ffddc60](https://github.com/avaly/paddle-sdk/commit/ffddc608fc4932d464014da04cfaae09d37b5847))
* Fix type of `recurring_prices` in `GeneratePaylinkBody` ([#92](https://github.com/avaly/paddle-sdk/issues/92)) ([45b3a1a](https://github.com/avaly/paddle-sdk/commit/45b3a1a0d8393e92901971eb61ff614d94566bb5))

## [4.6.0](https://github.com/avaly/paddle-sdk/compare/v4.5.0...v4.6.0) (2023-06-21)


### Features

* Add `getPrices` ([#89](https://github.com/avaly/paddle-sdk/issues/89)) ([d949469](https://github.com/avaly/paddle-sdk/commit/d9494690d467f9cf5bef8b8ed65d96ed5b0da366))
* Add `getSubscriptionModifiers` ([#88](https://github.com/avaly/paddle-sdk/issues/88)) ([ee831c5](https://github.com/avaly/paddle-sdk/commit/ee831c5d54862cf8c62d7c5b50422b24c2495ac1))

## [4.5.0](https://github.com/avaly/paddle-sdk/compare/v4.4.0...v4.5.0) (2023-06-12)


### Features

* Add `passthrough` when updating a subscription ([#87](https://github.com/avaly/paddle-sdk/issues/87)) ([5503641](https://github.com/avaly/paddle-sdk/commit/5503641acde1934228d2a0b0135939d5dd4ff4b7))

## [4.4.0](https://github.com/avaly/paddle-sdk/compare/v4.3.0...v4.4.0) (2023-05-08)


### Features

* Custom error class with Paddle API code and message ([#85](https://github.com/avaly/paddle-sdk/issues/85)) ([8b015b7](https://github.com/avaly/paddle-sdk/commit/8b015b744c357272453527cde28a8dbb1f0f908d))

## [4.3.0](https://github.com/avaly/paddle-sdk/compare/v4.2.0...v4.3.0) (2023-04-26)


### Features

* Support all options for `getSubscriptionPayments` ([#82](https://github.com/avaly/paddle-sdk/issues/82)) ([7ec2c6d](https://github.com/avaly/paddle-sdk/commit/7ec2c6d283a3eb250a0d7742fd58cd60889cbe20))
* Support the One-off Charge API ([#83](https://github.com/avaly/paddle-sdk/issues/83)) ([9b28977](https://github.com/avaly/paddle-sdk/commit/9b289770e810a7bfb5724bbdc6b21efeab8d826a))

## [4.2.0](https://github.com/avaly/paddle-sdk/compare/v4.1.0...v4.2.0) (2023-04-20)


### Features

* Add `subscriptionID` to `getUsers` ([#80](https://github.com/avaly/paddle-sdk/issues/80)) ([2138a6f](https://github.com/avaly/paddle-sdk/commit/2138a6fac560e4512fe69537a6c6dfb3ebbfb49e))

## [4.1.0](https://github.com/avaly/paddle-sdk/compare/v4.0.1...v4.1.0) (2023-04-06)


### Features

* Use axios for HTTP requests ([#78](https://github.com/avaly/paddle-sdk/issues/78)) ([13b8351](https://github.com/avaly/paddle-sdk/commit/13b8351f2580a2f084897379ff52b4c3301d6478))


### Bug Fixes

* Add customer_email to GeneratePaylinkBody ([#77](https://github.com/avaly/paddle-sdk/issues/77)) ([2e0bedd](https://github.com/avaly/paddle-sdk/commit/2e0beddf328fa9569d4c1bd4df8c525e2c7a1964))

### [4.0.1](https://github.com/avaly/paddle-sdk/compare/v4.0.0...v4.0.1) (2023-03-30)


### Bug Fixes

* Fix CommonJS and ESM exports ([#72](https://github.com/avaly/paddle-sdk/issues/72)) ([bfc723c](https://github.com/avaly/paddle-sdk/commit/bfc723ca415779109b6216d6ee034fd14744568b))

## [4.0.0](https://github.com/avaly/paddle-sdk/compare/v3.3.0...v4.0.0) (2023-03-25)


### ⚠ BREAKING CHANGES

* The package source is now written in TypeScript. It ships with native TypeScript types in both CommonJS and ESM syntax.

* Rewrite in TypeScript ([#69](https://github.com/avaly/paddle-sdk/issues/69)) ([bac3c5e](https://github.com/avaly/paddle-sdk/commit/bac3c5e0e1cdd9b9575a11d84080e0516c55d00f))

## [3.3.0](https://github.com/avaly/paddle-sdk/compare/v3.2.0...v3.3.0) (2023-02-08)


### Features

* Add reschedule payment API endpoint ([#52](https://github.com/avaly/paddle-sdk/issues/52)) ([7d2c92b](https://github.com/avaly/paddle-sdk/commit/7d2c92be76558706858176de99dd7b87e9db4cdc))

## [3.2.0](https://github.com/avaly/paddle-sdk/compare/v3.1.0...v3.2.0) (2022-12-06)


### Features

* Create subscription modifier ([#56](https://github.com/avaly/paddle-sdk/issues/56)) ([de71c3c](https://github.com/avaly/paddle-sdk/commit/de71c3c64ef8d035d74d4ea0f6c557fdb164447c))

## [3.1.0](https://github.com/avaly/paddle-sdk/compare/v3.0.0...v3.1.0) (2022-12-05)


### Features

* pause / renew subscription ([#54](https://github.com/avaly/paddle-sdk/issues/54)) ([9595d6e](https://github.com/avaly/paddle-sdk/commit/9595d6e0b0ec172198c9ca3ff20396e0dd474b2d))

## [3.0.0](https://github.com/avaly/paddle-sdk/compare/v2.5.1...v3.0.0) (2022-09-21)


### ⚠ BREAKING CHANGES

* Requires node v14+

### Features

* Add support for Checkout API, new endpoints, more parameters ([#47](https://github.com/avaly/paddle-sdk/issues/47)) ([efc98b1](https://github.com/avaly/paddle-sdk/commit/efc98b1db2fd0eb5e990c1d86fe1ca9bee98093f))


* Update node version ([c7f3bb8](https://github.com/avaly/paddle-sdk/commit/c7f3bb8abb54bebadd78141961316054bad6c110))

### [2.5.1](https://github.com/avaly/paddle-sdk/compare/v2.5.0...v2.5.1) (2022-04-11)


### Bug Fixes

* Sandbox argument type ([b9abe9f](https://github.com/avaly/paddle-sdk/commit/b9abe9f0a637338ec16e08228bd479abb2890b13))

## [2.5.0](https://github.com/avaly/paddle-sdk/compare/v2.4.0...v2.5.0) (2022-02-08)


### Features

* Optional arguments for getProductPlans, getPlanUsers, getPlanPayments ([#36](https://github.com/avaly/paddle-sdk/issues/36)) ([af19b25](https://github.com/avaly/paddle-sdk/commit/af19b25faa9de63802bacb1b23db8a270844e638))

## [2.4.0](https://github.com/avaly/paddle-sdk/compare/v2.3.0...v2.4.0) (2022-02-06)


### Features

* Support sandbox server URL ([#38](https://github.com/avaly/paddle-sdk/issues/38)) ([a9ff773](https://github.com/avaly/paddle-sdk/commit/a9ff773bd2cc49b4d188c964e5250fb8af876e95))
* Support transactions page ([#41](https://github.com/avaly/paddle-sdk/issues/41)) ([75840f5](https://github.com/avaly/paddle-sdk/commit/75840f5aff142cdacaace16baeeabc44a4ab1f0f))


### Bug Fixes

* Get users transactions correctly ([#40](https://github.com/avaly/paddle-sdk/issues/40)) ([461fb03](https://github.com/avaly/paddle-sdk/commit/461fb0390ac31bc243d7f5f8c2e568dbabcdd71d))

## [2.3.0](https://github.com/avaly/paddle-sdk/compare/v2.2.0...v2.3.0) (2021-07-01)


### Features

* Update a subscription quantity and price ([#27](https://github.com/avaly/paddle-sdk/issues/27)) ([72a160a](https://github.com/avaly/paddle-sdk/commit/72a160af29e777eaeea3d4c01128ac171f7e627e))

## [2.2.0](https://github.com/avaly/paddle-sdk/compare/v2.1.0...v2.2.0) (2020-05-12)


### Features

* Add TS declaration file and build command ([562de86](https://github.com/avaly/paddle-sdk/commit/562de86cc14399c0bc7152e24cea6176933dd99c))

## [2.1.0](https://github.com/avaly/paddle-sdk/compare/v2.0.0...v2.1.0) (2019-12-29)


### Features

* Update subscription plan method ([310f54d](https://github.com/avaly/paddle-sdk/commit/310f54d932b3d4f6715c9ee668cdc6c43523ce4b))

## [2.0.0](https://github.com/avaly/paddle-sdk/compare/v1.3.0...v2.0.0) (2019-12-27)


### ⚠ BREAKING CHANGES

* Requires node v10+

### Features

* Upgrade all dependencies ([ce2d240](https://github.com/avaly/paddle-sdk/commit/ce2d2401681d1564e1c77f7904a98de0186fb85a))

## [1.3.0](https://github.com/avaly/paddle-sdk/compare/v1.2.2...v1.3.0) (2019-11-12)


### Features

* Add generatePayLink ([#8](https://github.com/avaly/paddle-sdk/issues/8)) ([a09b6c8](https://github.com/avaly/paddle-sdk/commit/a09b6c8))



### [1.2.2](https://github.com/avaly/paddle-sdk/compare/v1.2.1...v1.2.2) (2019-06-18)



<a name="1.2.1"></a>
## [1.2.1](https://github.com/avaly/paddle-sdk/compare/v1.2.0...v1.2.1) (2019-06-18)


### Bug Fixes

* Throw on error responses with 2xx status code ([28f07da](https://github.com/avaly/paddle-sdk/commit/28f07da))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/avaly/paddle-sdk/compare/v1.1.0...v1.2.0) (2018-03-23)


### Features

* Cancel subscription ([7a2a41c](https://github.com/avaly/paddle-sdk/commit/7a2a41c))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/avaly/paddle-sdk/compare/v1.0.0...v1.1.0) (2017-11-20)


### Features

* Verify Webhook Alerts :tada: ([d343da2](https://github.com/avaly/paddle-sdk/commit/d343da2))



<a name="1.0.0"></a>
# 1.0.0 (2017-11-19)


### Features

* Initial commit ([6bc14b0](https://github.com/avaly/paddle-sdk/commit/6bc14b0))
* Only getters methods are avilable in this version
