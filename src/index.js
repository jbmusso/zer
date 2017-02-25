export { createChainCreator } from './factories';

import { createChainCreator } from './factories';

import groovySyntax from './lang/groovy';
import renderInline from './render/inline';
import gremlinEscaper from './render/gremlin-server';

import { inspectSymbol, renderSymbol } from './factories';



export const groovy = createChainCreator(renderInline, groovySyntax);
export const gremlin = createChainCreator(gremlinEscaper, groovySyntax);


export function inspectChain(chainProxy) {
  return chainProxy[inspectSymbol];
}

export function renderChain(chainProxy) {
	return chainProxy[renderSymbol];
}

export default {
  groovy,
  gremlin,
};
