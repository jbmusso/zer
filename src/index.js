/* @flow */
export { createChainCreator } from './factories';

import { createChainCreator } from './factories';

import groovySyntax from './lang/groovy';
import renderInline from './render/inline';
import gremlinEscaper from './render/gremlin-server';

import { inspectSymbol, renderSymbol } from './factories';

import type { Render, ChainMember } from './types';
import type { ChainBuilder, ChainCreatorProxy } from './factories';

export const groovy: ChainCreatorProxy = createChainCreator(renderInline, groovySyntax);
export const gremlin: ChainCreatorProxy = createChainCreator(gremlinEscaper, groovySyntax);


export function inspectChain(chainProxy: ChainBuilder): Array<ChainMember> {
  return chainProxy[inspectSymbol];
}

export function renderChain(chainProxy: ChainBuilder): Render<*> {
  return chainProxy[renderSymbol];
}

export default {
  groovy,
  gremlin,
};
