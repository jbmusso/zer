/* @flow */
import _ from 'lodash';
import { Chain, ChainMember, Arguments } from '../../chain';

import type { Syntax, Render } from '../../types';


function renderArgument(argument, syntax: Syntax): string {
  if (argument instanceof Chain) {
    return renderInline(argument, syntax);
  }

  if (_.isString(argument)) {
    return syntax.STRING(argument);
  }

  if (_.isNumber(argument) || _.isObject(argument)) {
    return syntax.DEFAULT(argument);
  }
}

function renderMember(member: ChainMember, syntax: Syntax): string {
  if (member instanceof Arguments) {
    return syntax.ARGUMENTS(
      member.params
        .map((param) => renderArgument(param, syntax))
        .join(syntax.ARGUMENT_SEPARATOR)
      )
  }

  return syntax[member.type](member);
}

export default function renderInline({ members }: Chain, syntax: Syntax): Render<string> {
  return members
    .map((member: ChainMember): string => renderMember(member, syntax))
    .join('');
}
