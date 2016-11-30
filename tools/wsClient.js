'use strict';

const WebSocket = require('ws');
const assert = require('assert');

const connect = (cb) => {
  const client = new WebSocket('ws://localhost:4242');
  const dispose = () => client.terminate();
  client.on('open', () => cb(client, dispose));
}

module.exports = {
  /**
   * Launch a ws client, sends a request then shut down
   */
  sendRequest: (method, path) => {
    connect((client) => {
      client.send(JSON.stringify({method, path}));
    });
  },
  /**
   * Launch a ws client, wait for data to be pushed then shut down
   */
  subscribe: (path, callback) => {
    connect((client, dispose) => {
      client.on('message', (message, flags) => {
        const jsonMsg = JSON.parse(message);
        assert(jsonMsg.path === path, 'tools.wsClient.subscribe: path incorrect');
        callback(jsonMsg.data);
      });
    });
  }
};
