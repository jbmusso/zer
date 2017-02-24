export { createChainCreator } from './factories';

import { createChainCreator } from './factories';
import { createChain } from './chain';

import { toGroovy } from './groovy';
import { toBoundGroovy } from './gremlin-groovy';


export const groovy = createChainCreator(createChain, toGroovy);
export const gremlin = createChainCreator(createChain, toBoundGroovy);

import { inspectSymbol, renderSymbol } from './factories';

export function inspect(chain) {
  return chain[inspectSymbol];
}

export function render(chain) {
	return chain[renderSymbol];
}

export default {
  groovy,
  gremlin,
};
