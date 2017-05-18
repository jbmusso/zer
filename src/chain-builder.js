/* @flow */
import util from 'util';

import _ from 'lodash';

import { Chain, ChainMember } from './chain';
import type { Renderer, Render, Syntax } from './types';

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
export function createChainBuilder(
  chain: Chain,
  render: Renderer<Render<*>>,
  syntax: Syntax,
): ChainBuilder {
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
    },
  });

  return builder;
}

export const inspectSymbol: Symbol = Symbol('inspect');
export const renderSymbol: Symbol = Symbol('render');
export const chainSymbol: Symbol = Symbol('chain');
export const rendererSymbol: Symbol = Symbol('renderFunction');
export const syntaxSymbol: Symbol = Symbol('syntax');

function createProxyHandlers(
  chain: Chain,
  render: Renderer<Render<*>>,
  syntax: Syntax,
): any {
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
  };

  return handlers;
}
