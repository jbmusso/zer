/* @flow */
import _ from 'lodash';

export class ChainMember {
  name: string;
  type: string;
}

class ChainStart extends ChainMember {
  constructor(name: string) {
    super();
    this.name = name;
    this.type = 'CHAIN_START';
  }
}

class PropertyAccessor extends ChainMember {
  constructor() {
    super();
    this.type = 'PROPERTY_ACCESSOR';
  }
}

class Step extends ChainMember {
  constructor(name: string) {
    super();
    this.name = name;
    this.type = 'STEP';
  }
}

export class Arguments extends ChainMember {
  params: Array<any>;

  constructor(params: Array<any> = []) {
    super();
    this.params = params;
    this.type = 'ARGUMENTS';
  }
}

export class Chain {
  members: Array<ChainMember>;

  constructor() {
    this.members = [];
  }

  startWith(identifierName: string): Chain {
    this.members.push(new ChainStart(identifierName));
    return this;
  }

  addStep(name: string): Chain {
    this.members.push(new Step(name));
    return this;
  }

  addArguments(...args: Array<any>): Chain {
    this.members.push(new Arguments(args));
    return this;
  }

  append(chain: Chain): Chain {
    this.members = [...this.members, ...chain.members];
    return this;
  }

  composeWith(chain: Chain): Chain {
    this.members = [...this.members, new PropertyAccessor(), ...chain.members];
    return this;
  }
}

// TODO: missing name argument here?
export function createChain(): Chain {
  return new Chain();
}
