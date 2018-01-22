#!/usr/bin/env node

'use strict';

const url = require('url');
const WebSocket = require('ws');

const Channel = require('./libs/channel.js');

const wss = new WebSocket.Server({ port: 3347 });

let i = 0;

wss.on('connection', (ws, req) => {

    i++;
    let item = i;

    const location = url.parse(req.url, true);

    ws.on('message', message => {

        message = JSON.parse(message);

        switch (message.action) {

            case 'connect':
                let name = `jmaker:log:${message.channel}`;
                let channel = new Channel(name);

                let messageListener = (name, message) => {

                    let temp = JSON.parse(message);
                    try {

                        ws.send(message);

                    } catch(error) {

                        console.log(error);

                    }
                    if (temp.last) ws.close();

                };

                ws.on('close', _ => channel.close());
                channel.subscribe(messageListener);

                break;

        }

    });

});
