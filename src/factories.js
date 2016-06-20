export const createChainCreator = (strategy, render) => {
  // This Proxy initiates the chain, and must return a new Chain
  const handler = {
    get(target, name, receiver) {
      const chain = strategy.init(name);
      return createMemberChainer(chain, strategy, render);
    },
  };

  return new Proxy(() => {}, handler);
};


const createMemberChainer = (chain, strategy, render) => {
  const proxy = new Proxy(() => chain, {
    get(target, name, receiver) {
      if (name === 'name') {
        // KEEP ??? Maybe not
        // TODO: less dirty (ensure proper return value)
        return {}
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

      strategy.get(chain, name)

      return receiver;
    },

    apply(target, thisArg, args) {
      strategy.apply(chain, ...args);
      return proxy;
    }
  });

  return proxy;
};
