# function-apis
Pass functions to the client instead of API routes
--------------------
API routes are great for APIs, but for small projects where you have to access server data or hide application logic, you can just call a server function from the client.

## Examples
```js
// Hide server logic

// Server
const functions = require('function-apis');
app.use(functions({
    hello: (name) => {
        return `Hello, ${name}!`;
    }
}, true));

// Client
hello('World').then(alert); // => 'Hello, World!'
```

```js
// Log something to the console

// Server
const functions = require('function-apis');
app.use(functions({
    consoleLog: (...data) => {
        console.log(...data);
        return 'OK';
    }
}, true));

// Client
consoleLog('Hello!') // => 'OK'
```

## Documentation
### `functions(functions, defineGlobally)`
Use as express middleware. Default export.

    * `functions`: Object of functions to expose to the client.
    * `defineGlobally?`: Whether or not to define the functions globally. Defaults to `false`.

`?` Optional

### window.functions
An object of client-side functions. Available after including the following in your HTML. If `defineGlobally` is set to `true`, the functions will be available to `window[function]` in addition to `window.functions[function]`.
```html
<script src="/functions_/functions.js"></script>
```

[yodacode.xyz](https://yodacode.xyz)