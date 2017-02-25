import util from 'util';

import { createChain } from './chain';

export function createChainCreator(render, syntax) {
  // This Proxy initiates the chain, and must return a new Chain
  const handler = {
    get(target, name, receiver) {
      return createChainProxy(name, render, syntax);
    }
  };

  return new Proxy({}, handler);
};

const NO_INTERCEPT = [
  'constructor',
  'toString',
  'inspect',
  'nodeType',
  Symbol.toStringTag
];

function createChainProxy(chainName, render, syntax) {
  return new Proxy(() => {}, {
    get(target, name) {
      if (name === 'toString') {
        return () => chainName
      }

      if (NO_INTERCEPT.includes(name)) {
        return target[name];
      }
      
      const chain = createChain()
        .startWith(chainName)

      const chainBuilder = createChainBuilder(chain, render, syntax);

      chainBuilder[name];

      return chainBuilder;
    },

    apply(target, thisArg, args) {
      const chain = createChain()
        .startWith(chainName);

      chain.addArguments(...args);

      const chainBuilder = createChainBuilder(chain, render, syntax);

      return chainBuilder;
    },
  });
}

export const inspectSymbol = Symbol('inspect');
export const renderSymbol = Symbol('render');

function createProxyHandlers(chain, methodName, render, syntax) {
  const handlers = {
    [inspectSymbol]() {
      return chain.members;
    },
    [renderSymbol]() {
      return render(chain, syntax);
    },
    toString() {
      return () => render(chain, syntax)
    },
    // Called with console.log(chain) -- single arg
    [util.inspect.custom]() {
      return () => util.inspect(render(chain, syntax))
    },
    // Called with console.log('arg', chain) -- multiple args
    [Symbol.toPrimitive]() {
      return () => util.inspect(render(chain, syntax));
    },
    __repr__() {
      return () => chain.members;
    }
  }

  return handlers[methodName];
}


export function createChainBuilder(chain, render, syntax) {
  const chainProxy = new Proxy(() => chain, {
    get(target, name, receiver) {
      const handler = createProxyHandlers(chain, name, render, syntax);

      if (handler) {
        return handler();
      }

      chain.addStep(name);

      return receiver;
    },

    apply(target, thisArg, args) {
      chain.addArguments(...args);

      return chainProxy;
    }
  });

  return chainProxy;
};
