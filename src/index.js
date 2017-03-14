/* @flow */
export { createChainCreator } from './factories';

import { createChainCreator } from './factories';

import groovySyntax from './lang/groovy';
import renderInline from './render/inline';
import gremlinEscaper from './render/gremlin-server';

import { inspectSymbol, renderSymbol, chainSymbol } from './factories';

import type { Render, ChainMember } from './types';
import type { ChainBuilder, ChainCreator } from './factories';
import type { Chain } from './chain';

export const groovy: ChainCreator = createChainCreator(renderInline, groovySyntax);
export const gremlin: ChainCreator = createChainCreator(gremlinEscaper, groovySyntax);


export function inspectChain(chainProxy: ChainBuilder): Array<ChainMember> {
  return chainProxy[inspectSymbol];
}

export function renderChain(chainProxy: ChainBuilder): Render<*> {
  return chainProxy[renderSymbol];
}

export function innerChain(chainProxy: ChainBuilder): Chain {
  return chainProxy[chainSymbol];
}

export default {
  groovy,
  gremlin,
};
