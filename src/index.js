export { createChainCreator } from './factories';

import { createChainCreator } from './factories';
import { STRATEGY } from './chain';

import { toGroovy, toBoundGroovy } from './groovy';


export const groovy = createChainCreator(STRATEGY, toGroovy);
export const gremlin = createChainCreator(STRATEGY, toBoundGroovy);


export default {
  groovy,
  gremlin,
};


