import _ from 'lodash';


class ChainStart {
  constructor(name) {
    this.name = name;
    this.type = 'CHAIN_START';
  }
}

class Step {
  constructor(name) {
    this.name = name;
    this.type = 'STEP';
  }
}

class Arguments {
  constructor(params = []) {
    this.params = params;
    this.type = 'ARGUMENTS'
  }
}

export class Chain {
  constructor() {
    this.members = [];
  }

  startWith(identifierName) {
    this.members.push(new ChainStart(identifierName));
    return this;
  }

  addStep(name) {
    this.members.push(new Step(name));
    return this;
  }

  addArguments(...args) {
    this.members.push(new Arguments(args));
    return this;
  }

  __repr__(...args) {
    return this.members;
  }
}

// TODO: missing name argument here?
export function createChain() {
  return new Chain();
}
