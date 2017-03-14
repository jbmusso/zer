/* @flow */
import _ from 'lodash';
import { Chain } from '../chain';

import type { Syntax, ChainMember } from '../types';

const groovySyntax: Syntax = {
  ARGUMENT_SEPARATOR: ', ',

  STRING(param: string): string {
    return `'${param}'`;
  },

  DEFAULT(param: any): string {
    return param.toString();
  },

  CHAIN_START(member: ChainMember): string {
    return member.name;
  },

  PROPERTY_ACCESSOR(): string {
    return '.';
  },

  STEP(member: ChainMember): string {
    return `.${member.name}`;
  },

  ARGUMENTS(serializedArguments: string): string {
    return `(${serializedArguments})`;
  },
};

export default groovySyntax;
