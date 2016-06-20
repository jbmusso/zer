import _ from 'lodash';


class ChainStart {
  constructor(name) {
    this.name = name;
    this.type = 'CHAIN_START';
  }
}

class Property {
  constructor(name) {
    this.name = name;
    this.type = 'PROPERTY';
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

  addProperty(name) {
    this.members.push(new Property(name));
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

export const createChain = (name) => {
  const chain = new Chain();
  chain.startWith(name);

  return chain;
}

export const STRATEGY = {
  init(name) {
    return createChain(name);
  },

  get(chain, name) {
    chain.addProperty(name)
  },

  apply(chain, ...args) {
    chain.addArguments(...args)
  }
}
