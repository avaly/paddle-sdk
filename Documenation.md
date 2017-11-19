# Paddle.com Node.js SDK Documentation

Welcome to the [Paddle.com](http://www.paddle.com/) Node.js SDK documentation.

<a name="PaddleSDK"></a>

## PaddleSDK
**Kind**: global class  

* [PaddleSDK](#PaddleSDK)
    * [new PaddleSDK(vendorID, apiKey, [options])](#new_PaddleSDK_new)
    * [.getProducts()](#PaddleSDK+getProducts) ⇒ <code>Promise</code>
    * [.getProductCoupons(productID)](#PaddleSDK+getProductCoupons) ⇒ <code>Promise</code>
    * [.getProductPlans(productID)](#PaddleSDK+getProductPlans) ⇒ <code>Promise</code>
    * [.getPlanUsers(planID)](#PaddleSDK+getPlanUsers) ⇒ <code>Promise</code>
    * [.getPlanPayments(planID)](#PaddleSDK+getPlanPayments) ⇒ <code>Promise</code>
    * [.getWebhooksHistory()](#PaddleSDK+getWebhooksHistory) ⇒ <code>Promise</code>
    * [.getUserTransactions(userID)](#PaddleSDK+getUserTransactions) ⇒ <code>Promise</code>
    * [.getSubscriptionTransactions(subscriptionID)](#PaddleSDK+getSubscriptionTransactions) ⇒ <code>Promise</code>
    * [.getOrderTransactions(orderID)](#PaddleSDK+getOrderTransactions) ⇒ <code>Promise</code>
    * [.getCheckoutTransactions(checkoutID)](#PaddleSDK+getCheckoutTransactions) ⇒ <code>Promise</code>

<a name="new_PaddleSDK_new"></a>

### new PaddleSDK(vendorID, apiKey, [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| vendorID | <code>string</code> |  | The vendor ID for a Paddle account |
| apiKey | <code>string</code> |  | The API Key for a Paddle account |
| [options] | <code>object</code> |  |  |
| [options.server] | <code>string</code> | <code>&quot;vendors.paddle.com/api/2.0&quot;</code> | The server URL prefix for all requests |

**Example**  
```js
const client = new PaddleSDK('your-unique-api-key-here');
```
<a name="PaddleSDK+getProducts"></a>

### client.getProducts() ⇒ <code>Promise</code>
Get the current list of products

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The products list  
**Example**  
```js
const products = await client.getProducts();
```
<a name="PaddleSDK+getProductCoupons"></a>

### client.getProductCoupons(productID) ⇒ <code>Promise</code>
Get the current list of coupons for a product

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The coupons list  

| Param | Type |
| --- | --- |
| productID | <code>number</code> | 

**Example**  
```js
const coupons = await client.getProductCoupons(123);
```
<a name="PaddleSDK+getProductPlans"></a>

### client.getProductPlans(productID) ⇒ <code>Promise</code>
Get the current list of plans for a subscription

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The plans list  

| Param | Type |
| --- | --- |
| productID | <code>number</code> | 

**Example**  
```js
const plans = await client.getProductPlans(123);
```
<a name="PaddleSDK+getPlanUsers"></a>

### client.getPlanUsers(planID) ⇒ <code>Promise</code>
Get the current list of users for a subscription plan

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The users list  

| Param | Type |
| --- | --- |
| planID | <code>number</code> | 

**Example**  
```js
const users = await client.getPlanUsers(123);
```
<a name="PaddleSDK+getPlanPayments"></a>

### client.getPlanPayments(planID) ⇒ <code>Promise</code>
Get the list of payments for a subscription plan

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The payments list  

| Param | Type |
| --- | --- |
| planID | <code>number</code> | 

**Example**  
```js
const payments = await client.getPlanPayments(123);
```
<a name="PaddleSDK+getWebhooksHistory"></a>

### client.getWebhooksHistory() ⇒ <code>Promise</code>
Get the list of webhooks history

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The webhooks history list  
**Example**  
```js
const webhooksHistory = await client.getWebhooksHistory();
```
<a name="PaddleSDK+getUserTransactions"></a>

### client.getUserTransactions(userID) ⇒ <code>Promise</code>
Get the list of transations for a user

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The transations list  

| Param | Type |
| --- | --- |
| userID | <code>number</code> | 

**Example**  
```js
const userTransactions = await client.getUserTransactions(123);
```
<a name="PaddleSDK+getSubscriptionTransactions"></a>

### client.getSubscriptionTransactions(subscriptionID) ⇒ <code>Promise</code>
Get the list of transations for a subscription

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The transations list  

| Param | Type |
| --- | --- |
| subscriptionID | <code>number</code> | 

**Example**  
```js
const subscriptionTransactions = await client.getSubscriptionTransactions(123);
```
<a name="PaddleSDK+getOrderTransactions"></a>

### client.getOrderTransactions(orderID) ⇒ <code>Promise</code>
Get the list of transations for an order

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The transations list  

| Param | Type |
| --- | --- |
| orderID | <code>number</code> | 

**Example**  
```js
const orderTransactions = await client.getOrderTransactions(123);
```
<a name="PaddleSDK+getCheckoutTransactions"></a>

### client.getCheckoutTransactions(checkoutID) ⇒ <code>Promise</code>
Get the list of transations for a checkout

**Kind**: instance method of [<code>PaddleSDK</code>](#PaddleSDK)  
**Fulfil**: <code>object</code> - The transations list  

| Param | Type |
| --- | --- |
| checkoutID | <code>number</code> | 

**Example**  
```js
const checkoutTransactions = await client.getCheckoutTransactions(123);
```
---

Documentation generated on **Sun, 19 Nov 2017 17:59:18 GMT**
