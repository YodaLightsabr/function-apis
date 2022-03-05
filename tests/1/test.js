const express = require('express');
const app = express();

const functions = require('../../index.js');
app.use(functions({

    hello: (name) => {
        return `Hello there, ${name}!`;
    },
    doSomethingAsync: () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('Completed!');
            }, 1000);
        });
    }

}, true));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.listen(8080, () => {
    console.log('Ready. http://localhost:8080');
});