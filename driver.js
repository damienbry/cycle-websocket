'use strict';

const xs = require('xstream').default;
const WebSocket = require('ws');
let assert = require('assert');

// Polyfill for non-node apps
if (!assert) {
  assert = (condition, err) => {
    if (!condition) {
      throw new Error(err)
    }
  };
}

function makeWSDriver(config) {
  const server = new WebSocket.Server({
    port: config.port || 4242
  });

  let isRunning = true;

  const handleMessage = (msg) => {
    server.clients.forEach(client => client.send(msg));
  };

  return (sink$) => {

    sink$.addListener({
      next: handleMessage,
      error: console.error,
      complete: () => {
        if (isRunning) {
          server.close();
          isRunning = false;
        }
      }
    });

    return xs.create({
      start: listener => {

        server.on('connection', ws => {
          ws.on('message', (data, flags) => {
            listener.next(data);
          }); 
        });
      },
      stop: () => {
        if (isRunning) {
          server.close();
          isRunning = false;
        }
      }
    });
  };
};

module.exports = {
  makeWSDriver
};
