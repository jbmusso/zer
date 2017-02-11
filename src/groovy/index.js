import _ from 'lodash';

import { createChainCreator } from '../';
import { Chain, createChain } from '../chain';


const GROOVY_FORMAT_NORMAL = {
  ARGUMENT_SEPARATOR: ', ',
}

const GROOVY_FORMAT_MIN = {
  ARGUMENT_SEPARATOR: ',',
}

const stringifyArgument = (argument) => {
  if (argument instanceof Chain) {
    return toGroovy(argument);
  }

  if (_.isString(argument)) {
    return `'${argument}'`;
  }

  if (_.isNumber(argument) || _.isObject(argument)) {
    return argument.toString();
  }
}


const GROOVY = {
  CHAIN_START(member) {
    return member.name;
  },

  STEP(member) {
    return `.${member.name}`
  },

  ARGUMENTS({ params }) {
    return `(${params.map(stringifyArgument).join(GROOVY_FORMAT_NORMAL.ARGUMENT_SEPARATOR)})`;
  },
}


export function toGroovy({ members }) {
  return members
    .map((member) => GROOVY[member.type](member))
    .join('');
}

const groovy = createChainCreator(createChain, toGroovy);

export default groovy;
