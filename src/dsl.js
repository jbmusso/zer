import _ from 'lodash';

import { inspectChain, innerChain } from './';
import { createChainBuilder, inspectRenderer, inspectSyntax, chainSymbol } from './factories';
import type { ChainCreatorProxy } from './factories';

type DSL = {
  [key: string]: (...args: Array<*>) => string
};


function wrapBuilder(builder, dsl: DSL) {
  return new Proxy(builder, {
    get(target, name, receiver) {
      if (_.has(dsl, name)) {
        return (...args) => {
          const dslChainProxy = dsl[name](...args); 
          const dslChain = dslChainProxy[chainSymbol];

          target[chainSymbol].composeWith(dslChain);

          return wrapBuilder(target, dsl);
        };
      }

      // Handle String properties, but make sure to return a wrappedBuilder
      // so custom steps can be chained after any other steps, either custom or
      // generic.
      if (_.isString(name)) {
        return wrapBuilder(target[name], dsl);
      }

      // Do nothing, ie. forward Symbol objects to wrapped builder
      return target[name];
    },

    apply(target, thisArg, args) {
      // Intercept function call, and ensure we still return a wrappedBuilder
      // so next steps can continue chaining custom steps as well as generic
      // steps.
      const toWrap = target(...args);

      return wrapBuilder(toWrap, dsl);
    }
  });
}


export function createDsl(chainCreator: ChainCreatorProxy, dsl: DSL) {
  return new Proxy(chainCreator, {
    get(target, name, receiver) {
      const builder = target[name];

      return wrapBuilder(builder, dsl);
    }
  });
}
