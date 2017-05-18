import { assert } from 'chai';

import { createChain } from './chain';

describe('Chain', () => {
  it('should expose a factory', () => {
    assert.isFunction(createChain);
  });

  it('should add start step', () => {
    const chain = createChain().startWith('foo');

    assert.property(chain, 'members');
    assert.lengthOf(chain.members, 1);
    assert.deepPropertyVal(chain, 'members.0.name', 'foo');
  });

  it('should chain steps', () => {
    const chain = createChain().addStep('foo').addStep('bar');

    assert.lengthOf(chain.members, 2);
    assert.deepPropertyVal(chain, 'members.0.name', 'foo');
    assert.deepPropertyVal(chain, 'members.1.name', 'bar');
  });

  it('should chain arguments', () => {
    const chain = createChain()
      .addStep('foo')
      .addStep('bar')
      .addArguments('name', 'Alice');

    assert.lengthOf(chain.members, 3);
    assert.deepPropertyVal(chain, 'members.0.name', 'foo');
    assert.deepPropertyVal(chain, 'members.1.name', 'bar');
    assert.deepPropertyVal(chain, 'members.2.params.0', 'name');
    assert.deepPropertyVal(chain, 'members.2.params.1', 'Alice');
  });

  it('should concatenate a chain with another', () => {
    const chain1 = createChain().startWith('g').addStep('V').addArguments(1);

    const chain2 = createChain().addStep('out').addArguments('knows');

    chain1.append(chain2);

    assert.lengthOf(chain1.members, 5);
    assert.deepPropertyVal(chain1, 'members.0.name', 'g');
    assert.deepPropertyVal(chain1, 'members.1.name', 'V');
    assert.deepPropertyVal(chain1, 'members.2.params.0', 1);
    assert.deepPropertyVal(chain1, 'members.3.name', 'out');
    assert.deepPropertyVal(chain1, 'members.4.params.0', 'knows');
  });
});
