#!/usr/bin/env node

'use strict';

const url = require('url');
const WebSocket = require('ws');

const Channel = require('./libs/channel.js');

const wss = new WebSocket.Server({ port: 3347 });

wss.on('connection', (ws, req) => {

    const location = url.parse(req.url, true);

    ws.on('message', message => {

        message = JSON.parse(message);
        console.log(message);

        switch (message.action) {

            case 'connect':
                let outName = `jmaker:log:${message.channel}`;
                let outCh = new Channel(outName);

                let messageListener = (name, message) => {

                    let temp = JSON.parse(message);
                    ws.send(message);
                    if (temp.last) ws.close();

                };

                outCh.subscribe(messageListener);
                ws.on('close', _ => outCh.close());

                break;

        }

    });

});
