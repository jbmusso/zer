export { createChainCreator } from './factories';

import { createChainCreator } from './factories';
import { createChain } from './chain';

import { toGroovy } from './groovy';
import { toBoundGroovy } from './gremlin-groovy';


export const groovy = createChainCreator(createChain, toGroovy);
export const gremlin = createChainCreator(createChain, toBoundGroovy);

import { inspectSymbol } from './factories';

export function inspect(chain) {
  return chain[inspectSymbol];
}


export default {
  groovy,
  gremlin,
};
