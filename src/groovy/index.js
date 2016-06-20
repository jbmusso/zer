import _ from 'lodash';

import { createChainCreator } from '../';
import { Chain, STRATEGY } from '../chain';


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


const GROOVY_BUILDER_INLINED = {
  CHAIN_START(member) {
    return member.name;
  },

  PROPERTY(member) {
    return `.${member.name}`
  },

  ARGUMENTS({ params }) {
    return `(${params.map(stringifyArgument).join(GROOVY_FORMAT_NORMAL.ARGUMENT_SEPARATOR)})`;
  },
}


const GROOVY_BUILDER_ESCAPED = {
  CHAIN_START(member) {
    return {
      query: member.name
    };
  },

  PROPERTY(member) {
    return {
      query: `.${member.name}`
    }
  },


  STRINGIFY_ARGUMENT(paramValue, nameIdentifier, boundAcc) {
    // If Argument is a Chain, that chained need to be escaped recursively
    // then merged back into the parent chain.
    if (paramValue instanceof Chain) {
      return toBoundGroovy(paramValue, nameIdentifier, { query: '', params: {}, offset: boundAcc.offset });
    }

    // Argument is a Primitive and can be safely escaped/bound.
    // Let's generate the next bound param identifier.
    const paramKey = nameIdentifier(boundAcc.offset);
    boundAcc.offset += 1;

    // Return the intermediate query
    return {
      query: paramKey,
      params: {
        [paramKey]: paramValue
      },
      offset: boundAcc.offset
    };
  },

  ARGUMENTS(chainMember, nameIdentifier, boundAcc) {
    const boundParams = _(chainMember.params)
      .map((paramValue) => this.STRINGIFY_ARGUMENT(paramValue, nameIdentifier, boundAcc))
      .reduce((acc, { query = '', params, offset }) => {
        acc.inline.push(query);
        acc.params = {
          ...acc.params,
          ...params
        };

        return acc;
      }, { inline: [], params: {} });

    return {
      query: `(${boundParams.inline.join(GROOVY_FORMAT_NORMAL.ARGUMENT_SEPARATOR)})`,
      params: boundParams.params,
      offset: boundAcc.offset
    }
  }
}

export const toGroovy = ({ members }) => {
  return members
    .map((member) => GROOVY_BUILDER_INLINED[member.type](member))
    .join('');
}

export const toBoundGroovy = (chain, nameIdentifier = (offset) => `p${offset}`, boundAcc = { query: '', params: {}, offset: 0 } ) => {

  return chain.members.reduce((current, member) => {
    const {
      query = '',
      params = {},
      offset = current.offset
    } = GROOVY_BUILDER_ESCAPED[member.type](member, nameIdentifier, current);

    current.query += query;
    current.params = {
      ...current.params,
      ...params
    }
    current.offset = offset;

    return current;
  }, boundAcc);
}

export const Steps = createChainCreator(STRATEGY, toGroovy);

export const Objects = createChainCreator(STRATEGY, toGroovy);

