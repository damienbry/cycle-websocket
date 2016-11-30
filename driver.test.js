'use strict';

const driver = require('./driver');
const xs = require('xstream').default;
const Cycle = require('@cycle/xstream-run').default;
const assert = require('assert');
const tools = require('./tools');

const settings = {
  port: 4242,
};

describe('ws driver', () => {

  context = tools.context.initialize();
  
  afterEach(done => {
    tools.context.clean(context);
    setTimeout(() => done(), 50);
  });

  it('[source] input -> driver -> app', (done) => {
    const ws = driver.makeWSDriver(settings);

    const sources = ws(xs.never());
    const listener = {
      next: i => {
        assert.deepStrictEqual(i, JSON.stringify({method: 'GET', path: '/health'}));
        done();
      }
    };
    context.subscription = sources.subscribe(listener);

    tools.wsClient.sendRequest('GET', '/health');
  });

  it('[sink] input ->  app -> driver -> output', (done) => {
    const ws = driver.makeWSDriver(settings);

    const main = (sources) => {
      return {
        ws: sources.ws.map(msg => {
          return JSON.stringify({
            path: JSON.parse(msg).path,
            data: {
              status: 'OK'
            }
          });
        })
      }
    };

    const {run} = Cycle(main, {ws});
    context.dispose = run();

    tools.wsClient.subscribe('/health', (data) => {
      assert.deepStrictEqual(data, {status: 'OK'});
      done();
    });

    tools.wsClient.sendRequest('GET', '/health', () => {});
  });
});
