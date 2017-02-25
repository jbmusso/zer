import _ from 'lodash';
import { Chain } from '../../chain';


const language = {
  ARGUMENT_SEPARATOR: ', ',

  STRING(param) {
    return `'${param}'`;
  },

  DEFAULT(param) {
    return param.toString();
  },

  CHAIN_START(member) {
    return member.name;
  },

  STEP(member) {
    return `.${member.name}`
  },

  ARGUMENTS(serializedArguments) {
    return `(${serializedArguments})`;
  },
}


export default language;
