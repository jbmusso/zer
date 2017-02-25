export { createChainCreator } from './factories';

import { createChainCreator } from './factories';

import { toGroovy } from './groovy';
import { toBoundGroovy } from './gremlin-groovy';


export const groovy = createChainCreator(toGroovy);
export const gremlin = createChainCreator(toBoundGroovy);

import { inspectSymbol, renderSymbol } from './factories';

export function inspect(chainProxy) {
  return chainProxy[inspectSymbol];
}

export function render(chainProxy) {
	return chainProxy[renderSymbol];
}

export default {
  groovy,
  gremlin,
};
