export function createChainCreator(chainFactory, render) {
  // This Proxy initiates the chain, and must return a new Chain
  const handler = {
    get(target, name, receiver) {
      return createChain(name, chainFactory, render);
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

function createChain(chainName, chainFactory, render) {
  return new Proxy(() => {}, {
    get(target, name) {
      if (name === 'toString') {
        return () => chainName
      }

      if (NO_INTERCEPT.includes(name)) {
        return target[name];
      }
      
      const chain = chainFactory()
        .startWith(chainName)

      const chainer = createMemberChainer(chain, render);

      chainer[name];

      return chainer;
    },

    apply(target, thisArg, args) {
      const chain = chainFactory()
        .startWith(chainName);

      chain.addArguments(...args);

      const chainer = createMemberChainer(chain, render);

      return chainer;
    },
  });
}

function createHandler(chain, methodName, render) {
  const handlers = {
    name() {
      return {};
    },
    toString() {
      return () => render(chain)
    },
    inspect() {
      return {};
    },
    valueOf() {
      return () => render(chain)
    },
    [Symbol.toPrimitive]() {
      return () => render(chain)
    },
    [Symbol.toStringTag]() {
      return {}
    },
    __repr__() {
      return () => chain.members;
    }
  }

  return handlers[methodName];
}


export function createMemberChainer(chain, render) {
  const chainProxy = new Proxy(() => chain, {
    get(target, name, receiver) {
      const handler = createHandler(chain, name, render);

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
