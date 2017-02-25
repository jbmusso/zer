import _ from 'lodash';
import { Chain, Arguments } from '../../chain';


function renderArgument(argument, syntax) {
  if (argument instanceof Chain) {
    return render(argument, syntax);
  }

  if (_.isString(argument)) {
    return syntax.STRING(argument);
  }

  if (_.isNumber(argument) || _.isObject(argument)) {
    return syntax.DEFAULT(argument);
  }
}

function renderMember(member, syntax) {
  if (member instanceof Arguments) {
    return syntax.ARGUMENTS(
      member.params
        .map((param) => renderArgument(param, syntax))
        .join(syntax.ARGUMENT_SEPARATOR)
      )
  }

  return syntax[member.type](member);
}

export default function render({ members }, syntax) {
  return members
    .map((member) => renderMember(member, syntax))
    .join('');
}
