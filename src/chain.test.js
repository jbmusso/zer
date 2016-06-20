import { assert } from 'chai';

import { createChain } from './chain';



describe('Chain', () => {
  it('should expose a factory', () => {
    assert.isFunction(createChain);
  });

  it('should add start step', () => {
    const chain = createChain('foo');

    assert.property(chain, 'members');
    assert.lengthOf(chain.members, 1);
    assert.deepPropertyVal(chain, 'members.0.name', 'foo')
  });

  it('should chain steps', () => {
    const chain = createChain('foo')
      .addProperty('bar')

    assert.lengthOf(chain.members, 2);
    assert.deepPropertyVal(chain, 'members.0.name', 'foo');
    assert.deepPropertyVal(chain, 'members.1.name', 'bar');

  });

  it('should chain arguments', () => {
    const chain = createChain('foo')
      .addProperty('bar')
      .addArguments('name', 'Alice');

    assert.lengthOf(chain.members, 3);
    assert.deepPropertyVal(chain, 'members.0.name', 'foo');
    assert.deepPropertyVal(chain, 'members.1.name', 'bar');
    assert.deepPropertyVal(chain, 'members.2.params.0', 'name');
    assert.deepPropertyVal(chain, 'members.2.params.1', 'Alice');
  });
});