# cycle-websocket
Brings websocket power to your Cycle.js app :metal:

### Easy pony :horse_racing:

This code launches a cycle app with a ws server listening for requests, and broadcasts back the UPPERCASE payload.

```javascript
const makeWSDriver = require('cycle-websocket');
const {run} = require('@cycle/xstream-run');

const drivers = {
    ws: makeWSDriver({
    port: 1337
  }
}

// your app
const main = (sources) => {
  // sinks
  return {
    ws: sources.ws.map(input => input.toUpperCase())
  }
}

run(main, drivers);
```

### Installation

```bash
npm install cycle-websocket
```

Uses ES6 features.

### Node, browser ?

This was built and tested for node, not tested in the browser but it should work. Keep me in touch if it's working or not !

### Tests

The input and output of the driver have unit tests. 
Don't mind the tooling, I moved it directly from the project I'm working on. Since it's only tests and readable, I kept it.

### Roadmap

[] Support other stream libs than xstream (use an adapter !)
[] Test for browser environments :D
[] Any suggestions ?

### Contribution

Feel free to send me a pull request on anything (code, tests, doc, RC). I'll be glad to review that.

### About the author :muscle:

> Build & Learn everyday

Full stack engineer concerned about building awesome stuff to improve people's life.

### Meet me on:

[twitter.com/Orbmancer](twitter.com/Orbmancer)
[damien-bry.com](damien-bry.com)

