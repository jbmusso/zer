/* @flow */
import _ from 'lodash';

import { createChain, Chain, ChainMember } from './chain';
import { createChainBuilder } from './chain-builder';
import type { Syntax, Renderer, Render } from './types';

export type ChainCreator = Proxy<Function>;
type ChainProxy = Proxy<Function>;

/**
 * Given a rendering function and a syntax, returns a Proxy which can intercept
 * any property and creates a Chain that starts with that property 'name'.
 */
export function createChainCreator(
  render: Renderer<Render<*>>,
  syntax: Syntax,
): ChainCreator {
  // This Proxy initiates the chain, and must return a new Chain
  const handler = {
    get(createProxiedChainTarget: Function, name: string): ChainProxy {
      return createProxiedChainTarget(name, render, syntax, {});
    },
  };

  return new Proxy(createProxiedChain, handler);
}

/**
 * Given a 'name', the Proxy intercepts and return a new ChainBuilder.
 * 'createChainBuilder' is a function that returns a Proxy<Function>.
 */
function createProxiedChain(
  chainName: string,
  render: Renderer<Render<*>>,
  syntax: Syntax,
): Proxy<ChainBuilder> {
  return new Proxy(createChainBuilder, {
    get(target: Function, name: string): ChainBuilder {
      const chain: Chain = createChain().startWith(chainName);

      const builder = target(chain, render, syntax)[name];

      return builder;
    },

    apply(target: Function, thisArg: *, args: Array<*>): ChainBuilder {
      const chain = createChain().startWith(chainName);
      const builder = target(chain, render, syntax)(...args);

      return builder;
    },
  });
}
