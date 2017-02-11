export { createChainCreator } from './factories';

import { createChainCreator } from './factories';
import { createChain } from './chain';

import { toGroovy, toBoundGroovy } from './groovy';


export const groovy = createChainCreator(createChain, toGroovy);
export const gremlin = createChainCreator(createChain, toBoundGroovy);


export default {
  groovy,
  gremlin,
};


