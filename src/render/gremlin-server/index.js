/* @flow */
import _ from 'lodash';

import { createChainCreator } from '../../factories';
import { Chain } from '../../chain';


const GROOVY_FORMAT_NORMAL = {
  ARGUMENT_SEPARATOR: ', ',
}


function renderArgument(argument, syntax, nameIdentifier, boundAcc) {
  // If Argument is a Chain, that chain needs to be escaped recursively
  // then merged back into the parent chain.
  if (argument instanceof Chain) {
    return render(argument, syntax, nameIdentifier, { query: '', params: {}, offset: boundAcc.offset });
  }

  if (typeof argument === 'function') {
    // TODO: cleanup dirty hack and make sure argument is an instance of
    // Chain rather than a function
    return render({ members: argument.__repr__() }, syntax, nameIdentifier, { query: '', params: {}, offset: boundAcc.offset });
  }

  // Argument is a Primitive and can be safely escaped/bound.
  // Let's generate the next bound param identifier.
  const paramKey = nameIdentifier(boundAcc.offset);
  boundAcc.offset += 1;

  // Return the intermediate query
  return {
    query: paramKey,
    params: {
      [paramKey]: argument
    },
    offset: boundAcc.offset
  };
};



const GREMLIN_SERVER = {
  CHAIN_START(member, syntax) {
    return {
      query: syntax.CHAIN_START(member)
    };
  },

  STEP(member, syntax) {
    return {
      query: syntax.STEP(member)
    }
  },

  ARGUMENTS(chainMember, syntax, nameIdentifier, boundAcc) {
    const boundParams = _(chainMember.params)
      .map((argument) => {
        return renderArgument(argument, syntax, nameIdentifier, boundAcc)
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
      query: syntax.ARGUMENTS(
        boundParams.inline.join(syntax.ARGUMENT_SEPARATOR)
      ),
      params: boundParams.params,
      // todo: write tests, ensure offset gets propagated to next calls
      offset: boundParams.offset
    }
  }
}

function render(chain, syntax, nameIdentifier = (offset) => `p${offset}`, boundAcc = { query: '', params: {}, offset: 0 }) {

  return chain.members.reduce((currentAcc, member) => {
    const {
      query = '',
      params = {},
      offset = currentAcc.offset
    } = GREMLIN_SERVER[member.type](member, syntax, nameIdentifier, currentAcc);

    currentAcc.query += query;
    currentAcc.params = {
      ...currentAcc.params,
      ...params
    }
    currentAcc.offset = offset;

    return currentAcc;
  }, boundAcc);
}

export default function(chain, syntax) {
  const { query, params } = render(chain, syntax)

  return { query, params };
}

