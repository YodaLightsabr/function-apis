const crypto = require('crypto');
const express = require('express');

module.exports = function functions (functions, useGlobal = false) {
    useGlobal = useGlobal ? true : false;
    let functionsUrl = `/____/functions/____/${crypto.createHash('sha256').update(Date.now() + '' + Math.floor(Math.random() * 10000)).digest('hex')}/____/functions`;
    return function handler (req, res, next) {
        if (req.url == '/functions_/functions.js') {
            res.type('application/javascript');
            res.send(`
// Functions
(() => {
    async function runFunction (fn, args) {
        let res = await fetch('${functionsUrl}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fn: fn,
                args: args
            })
        });
        let data = await res.json();
        if (data.error) {
            throw new Error(data.error);
        } else {
            return data.result;
        }
    }
    const functions = [
        ${Object.keys(functions).map(key => `"${encodeURIComponent(key)}"`).join(',\n')}
    ];
    window.functions = {};
    for (const fn of functions) {
        window.functions[decodeURIComponent(fn)] = async (...args) => {
            return await runFunction(decodeURIComponent(fn), args);
        }
        if (${useGlobal ? 'true' : 'false'}) {
            window[decodeURIComponent(fn)] = async (...args) => {
                return await runFunction(decodeURIComponent(fn), args);
            }
        }
    }
})();
            `)
        } else if (req.url == functionsUrl) {
            if (req.method.toUpperCase() !== 'POST') return next();
            express.json({ extended: true })(req, res, async () => {
                res.type('application/json');  
                try {
                    let output = functions[req.body.fn](...req.body.args);
                    if (output instanceof Promise) await output;
                    res.send(JSON.stringify({ error: false, result: output }));  
                } catch (err) {
                    res.status(500).send(JSON.stringify({ error: err }));
                }
            });
        } else next();
    }
}