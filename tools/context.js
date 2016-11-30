'use strict';

module.exports = {
  initialize: () => {
    return {
      subscription: null,
      dispose: null
    };
  },
  clean: (context) => {
    context.subscription && context.subscription.unsubscribe();
    context.dispose && context.dispose();

    context.subscription = null,
    context.dispose = null;
  }
}
