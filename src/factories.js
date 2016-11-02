export function createChainCreator(strategy, render) {
  // This Proxy initiates the chain, and must return a new Chain
  const handler = {
    get(target, name, receiver) {
      return createChain(name, strategy, render);
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

function createChain(chainName, strategy, render) {
  return new Proxy(() => {}, {
    get(target, name) {
      if (name === 'toString') {
        return () => chainName
      }

      if (NO_INTERCEPT.includes(name)) {
        return target[name];
      }

      const chain = strategy
        .init()
        .startWith(chainName)

      const chainer = createMemberChainer(chain, strategy, render);

      chainer[name];

      return chainer;
    },

    apply(target, thisArg, args) {
      const chain = strategy
        .init()
        .startWith(chainName);

      strategy.addArguments(chain, ...args);

      const chainer = createMemberChainer(chain, strategy, render);

      return chainer;
    },
  });
}

export function createMemberChainer(chain, strategy, render) {
  const chainProxy = new Proxy(() => chain, {
    get(target, name, receiver) {

      if (name === 'name') {
        // KEEP ??? Maybe not
        // TODO: less dirty (ensure proper return value)
        return {}
        // return target[name];
      }

      if (name === 'toString') {
        // KEEP
        // TODO: less dirty (ensure proper return value)
        return () => {
          return render(chain);
        };
      }

      if (name === '__repr__') {
        return () => {
          return chain.members
        };
      }

      if (name === 'inspect') {
        // KEEP
        // TODO: less dirty (ensure proper return value)
        return {};
      }

      if (name === 'valueOf') {
        // KEEP
        return () => {
          return render(chain);
        }
      }

      if (name === Symbol.toPrimitive) {
        // KEEP
        return () => {
          // TODO: improve string representation
          return render(chain);
        };
      }

      if (name === Symbol.toStringTag) {
        // KEEP
        // TODO: less dirty (ensure proper return value)
        return {}
      }

      strategy.addStep(chain, name);

      return receiver;
    },

    apply(target, thisArg, args) {
      strategy.addArguments(chain, ...args);
      return chainProxy;
    }
  });

  return chainProxy;
};
