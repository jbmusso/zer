/* @flow */
import util from 'util';
import _ from 'lodash';

import { createChain, Chain, ChainMember } from './chain';
import type { Syntax, Renderer, Render } from './types';


export type ChainCreator = Proxy<Function>;
type ChainProxy = Proxy<Function>;

/**
 * Given a rendering function and a syntax, returns a Proxy which can intercept
 * any property and creates a Chain that starts with that property 'name'.
 */
export function createChainCreator(render: Renderer<Render<*>>, syntax: Syntax): ChainCreator {
  // This Proxy initiates the chain, and must return a new Chain
  const handler = {
    get(createProxiedChainTarget: Function, name: string): ChainProxy {
      return createProxiedChainTarget(name, render, syntax, {});
    }
  };

  return new Proxy(createProxiedChain, handler);
};

export const rendererSymbol: Symbol = Symbol('renderFunction');

export function inspectRenderer(chain: ChainBuilder) {
  return chain[rendererSymbol];
}

export const syntaxSymbol: Symbol = Symbol('syntax');

export function inspectSyntax(chain: ChainBuilder) {
  return chain[syntaxSymbol];
}
/**
 * Given a 'name', the Proxy intercepts and return a new ChainBuilder.
 * 'createChainBuilder' is a function that returns a Proxy<Function>.
 */
function createProxiedChain(chainName: string, render: Renderer<Render<*>>, syntax: Syntax): Proxy<ChainBuilder> {

  return new Proxy(createChainBuilder, {
    get(target: Function, name: string): ChainBuilder {
      const chain: Chain = createChain()
        .startWith(chainName);

      const builder = target(chain, render, syntax)[name];

      return builder;
    },

    apply(target: Function, thisArg: *, args: Array<*>): ChainBuilder {
      const chain = createChain()
        .startWith(chainName);
      const builder = target(chain, render, syntax)(...args);

      return builder;
    },
  });
}

export const inspectSymbol: Symbol = Symbol('inspect');
export const renderSymbol: Symbol = Symbol('render');
export const chainSymbol: Symbol = Symbol('chain');

function createProxyHandlers(chain: Chain, render: Renderer<Render<*>>, syntax: Syntax): any {
  const handlers = {
    [inspectSymbol](): Array<ChainMember> {
      return chain.members;
    },
    [renderSymbol](): Renderer<Render<*>> {
      return render(chain, syntax);
    },
    [rendererSymbol]() {
      return render;
    },
    [syntaxSymbol]() {
      return syntax;
    },
    [chainSymbol](): Chain {
      return chain;
    },
    toString(): Renderer<Render<string>> {
      return (): Render<string> => render(chain, syntax);
    },
    // Called with console.log(chain) -- single arg
    [util.inspect.custom](): Renderer<Render<string>> {
      return (): Render<string> => util.inspect(render(chain, syntax));
    },
    // Called with console.log('arg', chain) -- multiple args
    [Symbol.toPrimitive](): Renderer<Render<string>> {
      return (): Render<string> => util.inspect(render(chain, syntax));
    },
    [Symbol.toStringTag](): Renderer<Render<string>> {
      return (): Render<string> => render(chain, syntax);
    },
    __repr__(): Function {
      return (): Array<ChainMember> => chain.members;
    }
  };

  return handlers;
}


export type ChainBuilder = Proxy<Function>;

/**
 * Given a Chain, returns a Proxy which intercepts all property lookups
 * and function calls and helps adding generic members to that chain.
 *
 * The Proxy target is a no-op function. This allows us to intercept any
 * property lookup (since functions are objects in JavaScript) as well
 * as function calls. The following will be intercepted by the Proxy:
 *    foo.bar
 *    foo.bar()
 *    foo.bar(...args);
 */
export function createChainBuilder(chain: Chain, render: Renderer<Render<*>>, syntax: Syntax): ChainBuilder {

  const handlers = createProxyHandlers(chain, render, syntax);

  const builder = new Proxy(() => {}, {
    // Intercepts any property lookup, such as foo.bar
    get(target: Function, name: string, receiver: ChainBuilder): ChainBuilder {
      const handler = handlers[name];

      // Allow intercepting special names, typically Symbol (either Standard/
      // non-Standard).
      if (_.isFunction(handler)) {
        return handler();
      }

      // Add a generic step to the Chain
      chain.addStep(name);

      return receiver;
    },

    // Intercepts any function call, such as foo.bar(...args)
    apply(target: Function, thisArg: any, args: Array<any>): ChainBuilder {
      chain.addArguments(...args);

      return builder;
    }
  });

  return builder;
};
