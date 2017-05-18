/* @flow */
export { createChainCreator } from './factories';

import { createChainCreator } from './factories';

import groovySyntax from './lang/groovy';
import renderInline from './render/inline';
import gremlinEscaper from './render/gremlin-server';

import {
  inspectSymbol,
  renderSymbol,
  chainSymbol,
  rendererSymbol,
  syntaxSymbol,
} from './chain-builder';

import type { Render, ChainMember } from './types';
import type { ChainCreator } from './factories';
import type { ChainBuilder } from './chain-builder';
import type { Chain } from './chain';

export const groovy: ChainCreator = createChainCreator(
  renderInline,
  groovySyntax,
);
export const gremlin: ChainCreator = createChainCreator(
  gremlinEscaper,
  groovySyntax,
);

export function inspectChain(chainProxy: ChainBuilder): Array<ChainMember> {
  return chainProxy[inspectSymbol];
}

export function renderChain(chainProxy: ChainBuilder): Render<*> {
  return chainProxy[renderSymbol];
}

export function innerChain(chainProxy: ChainBuilder): Chain {
  return chainProxy[chainSymbol];
}

export function inspectRenderer(chain: ChainBuilder) {
  return chain[rendererSymbol];
}

export function inspectSyntax(chain: ChainBuilder) {
  return chain[syntaxSymbol];
}

export default {
  groovy,
  gremlin,
};
