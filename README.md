[DEPRECATED] - Context.IO - Mailboxes know a lot. Use them.
============================================
[![Build Status](https://travis-ci.org/contextio/ContextIO-node.svg?branch=master)](https://travis-ci.org/contextio/ContextIO-node)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Context.IO is the missing email API that makes it easy and fast to integrate your user's email data in your application. ContextIO-node is the official Node.js client library.

Usage of this library requires you to register for a Context.IO API key. You can get one free here: http://context.io/

### NOTICE

The 2.0 version of the API will be deprecated in favor of the Lite version of the API. 2.0 will be partially deprecated on June 15, 2018, and disabled altogether on December 15, 2018.

[READ MORE HERE](https://blog.context.io/important-announcement-deprecation-of-2-0-api-8f73488a8c0e)

Installation
------------

Using [Yarn](https://yarnpkg.com/) (recommended)
```bash
yarn add contextio
```

Using NPM
``` bash
npm install contextio --save
```

_Note:_ This library was written using ES6 syntax. Please use at least Node 6 to ensure proper functionality.


Getting started
---------------

The constructor requires your OAuth consumer key and secret, which you can find by logging in to the [CIO Developer Console](https://console.context.io/). You can optionally specify the API version you wish to use. By default, the client will use version Lite.

``` js
const ContextIO = require('contextio')

const cioClient = ContextIO({
  key: "YOUR CONTEXT.IO OAuth CONSUMER KEY",
  secret: "YOUR CONTEXT.IO OAuth CONSUMER SECRET",
  version: "SELECTED API VERSION"
})
```

We **strongly** discourage keeping OAuth credentials in source control. If you ever need to regenerate your consumer secret you can do so on our [developer console](https://console.context.io/#settings)


Making calls to the Context.IO API
----------------------------------

Complete documentation is available at https://docs.context.io/ and you can also play around with the API using the [API Explorer](https://console.context.io/#explore) on our developer console.

The design of this library follows the URI structure very closely. For example, to call:

``` http
GET /2.0/accounts?limit=15
```

your function call would be:

``` js
cioClient.accounts().get({limit: 15}).then(res => {
  console.log(res)
})
```

Making it more general, the equivalent of this generic URI:

``` http
METHOD /RESOURCE/INSTANCE_ID/SUB_RESOURCE?PARAMS
```

would be:

``` js
cioClient.RESOURCE(INSTANCE_ID).SUB_RESOURCE().METHOD(PARAMS).then(success_handler)
```

Parameters
----------------------------------
Query parameters are passed in as an object to the method call:

```js
.get({query: "foo"})
```

Post parameters are passed the same way:

```js
.post({body: "bar"})
```

If an endpoint supports both query params and a post body, you can pass the query params as second object:

```js
.post({body: "bar"}, {query: "foo"})
```

If a POST or a PUT only requires query params, you may pass either an empty object or `null` for the body:
```js
.put(null, {query: "foo"})
```


Resource URLs
----------------------------------
Certain endpoints, such as `/2.0/accounts/threads` will return a complete URL that you can call to access a resource. You can use the `resource()` function to call these urls. Parameters are passed as normal.

```js
cioClient.resource(resource_url).get().then(res => {...})
```

App-Level Calls
----------------------------------
The app-level calls, such as `/app/status_callback_url` can be accessed under `.app()` regardless of your configured API version.

```js
cioClient.app().status_callback_url().get().then(res => {...})
```

Success Callback
----------------
Your callback function will receive one argument: an object containing the API response. The body will be JSON parsed for all endpoints that return JSON.

Endpoints that return a raw response will return the unparsed body.

The `2.0/accounts/files/content` endpoint will return an object containing the request headers and the unprocessed body. For more information, please visit our [documentation for that endpoint](https://context.io/docs/2.0/accounts/files/content).
```js
{
  headers: res.headers,
  body: res.body
}
```

Error handling
--------------
All errors are thrown, so to handle these gracefully you should add a `catch()` to your API calls.

``` js
cioClient.accounts().get({limit: 15}).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err.message)
})
```

The only errors that this client produces occur when it does not have enough information to construct an api call.
This can occur when a parent resource identifier is missing or when the api key/secret/version are not being set correctly.

For example, this call would would cause an error to be thrown because there is no `account_id`.
```js
cioClient.accounts().messages().get()
```

There is no API error handling built in this client and all API errors will be thrown intact. Our [documentation](https://context.io/docs/) can help in understanding error codes and a handy reference for http status codes can be found over at [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Response_codes).

Downloading Files
------
Calls that return file data will have a slightly different response shape:
```js
{
  filename: <name of file>,
  headers: <response header object>,
  body: <binary file data>
}
```

This is used on the following endpoints:

`2.0 accounts().files().content().get()`
- (unless the 'as_link' parameter is present)

`lite users().email_accounts().folders().messages().attachments().getFile()`
- (`.get()` is also available)

If the file name cannot be determined it will be returned as an empty string - the [list attachments](https://docs.context.io/#list-attachments) call may return better information.

Testing/Debugging
-------
Tests are written against [Jasmine 2.4](http://jasmine.github.io/2.4/introduction.html) and rely on instantiating a client with the `debug` option set to true

```js
const cioClient = ContextIO({
  key: "testy_key",
  secret: "sooper_secret",
  debug: true
})
```

This option circumvents the call to `request-promise`, the http library that we use. You may find this useful during development as it allows you to see exactly what is being passed to the `request-promise` library.

Support
-------
If you want to open an issue or PR for this library - go ahead! We'd love to hear your feedback.

For API support please consult our [support site](http://support.context.io) and feel free to drop a line to [support@context.io](mailto:support@context.io).
