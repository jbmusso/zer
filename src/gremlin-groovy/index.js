import _ from 'lodash';

import { createChainCreator } from '../factories';
import { STRATEGY, Chain } from '../chain';


const GROOVY_FORMAT_NORMAL = {
  ARGUMENT_SEPARATOR: ', ',
}


function serializeArgument(paramValue, nameIdentifier, boundAcc) {
  // If Argument is a Chain, that chain needs to be escaped recursively
  // then merged back into the parent chain.
  if (paramValue instanceof Chain) {
    return toBoundGroovy(paramValue, nameIdentifier, { query: '', params: {}, offset: boundAcc.offset });
  }

  if (typeof paramValue === 'function') {
    // TODO: cleanup dirty hack and make sure paramValue is an instance of
    // Chain rather than a function
    return toBoundGroovy({ members: paramValue.__repr__() }, nameIdentifier, { query: '', params: {}, offset: boundAcc.offset });
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
};



const GREMLIN_GROOVY = {
  CHAIN_START(member) {
    return {
      query: member.name
    };
  },

  STEP(member) {
    return {
      query: `.${member.name}`
    }
  },

  ARGUMENTS(chainMember, nameIdentifier, boundAcc) {
    const boundParams = _(chainMember.params)
      .map((paramValue) => {
        return serializeArgument(paramValue, nameIdentifier, boundAcc)
      })
      .reduce((acc, { query = '', params, offset }) => {
        acc.inline.push(query);
        acc.params = {
          ...acc.params,
          ...params
        };

        // todo: write tests, ensure offset gets propagated to next calls
        acc.offset = offset;

        return acc;
      }, { inline: [], params: {} });

    return {
      query: `(${boundParams.inline.join(GROOVY_FORMAT_NORMAL.ARGUMENT_SEPARATOR)})`,
      params: boundParams.params,
      // todo: write tests, ensure offset gets propagated to next calls
      offset: boundParams.offset
    }
  }
}

export function toBoundGroovy(chain, nameIdentifier = (offset) => `p${offset}`, boundAcc = { query: '', params: {}, offset: 0 }) {

  return chain.members.reduce((currentAcc, member) => {
    const {
      query = '',
      params = {},
      offset = currentAcc.offset
    } = GREMLIN_GROOVY[member.type](member, nameIdentifier, currentAcc);

    currentAcc.query += query;
    currentAcc.params = {
      ...currentAcc.params,
      ...params
    }
    currentAcc.offset = offset;

    return currentAcc;
  }, boundAcc);
}

const gremlin = createChainCreator(STRATEGY, toBoundGroovy);

export default gremlin;
