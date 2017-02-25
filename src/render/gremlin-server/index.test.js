import { assert } from 'chai';

import { createChain } from '../../chain';
import render from './';

import groovySyntax from '../../lang/groovy';
import gremlinEscaper from './';


describe('Serialization', () => {
  it('should return a string representation where primitives, objects and array are bound except other chains', () => {
    const chain = createChain()
      .startWith('foo')
      .addStep('bar')
      .addArguments('name', 'Alice');

    const repr = render(chain, groovySyntax);

    assert.isObject(repr);
    assert.equal(repr.query, `foo.bar(p0, p1)`);
    assert.deepEqual(repr.params, { p0: 'name', p1: 'Alice' });
  });

  it('should propagate offset', () => {
    const chain = createChain()
      .startWith('foo')
      .addStep('has')
      .addArguments('name', 'Alice')
      .addStep('has')
      .addArguments('age', 30)

    const repr = render(chain, groovySyntax);

    assert.isObject(repr);
    assert.equal(repr.query, `foo.has(p0, p1).has(p2, p3)`);
    assert.deepEqual(repr.params, { p0: 'name', p1: 'Alice', p2: 'age', p3: 30 });
  });

  it('should return a recursive string representation with all primitives bound', () => {
    const chain = createChain()
      .startWith('g')
      .addStep('V')
      .addArguments()
      .addStep('has')
      .addArguments('name', 'Alice')
      .addStep('has')
      .addArguments('age', 30)
      .addStep('repeat')
      .addArguments(
        createChain()
          .startWith('out')
          .addArguments('firstname', 'Bob')
      );

    const repr = render(chain, groovySyntax);

    assert.deepPropertyVal(repr, 'params.p0', 'name');
    assert.deepPropertyVal(repr, 'params.p1', 'Alice');
    assert.deepPropertyVal(repr, 'params.p2', 'age');
    assert.deepPropertyVal(repr, 'params.p3', 30);
    assert.deepPropertyVal(repr, 'params.p4', 'firstname');
    assert.deepPropertyVal(repr, 'params.p5', 'Bob');

    assert.equal(repr.query, `g.V().has(p0, p1).has(p2, p3).repeat(out(p4, p5))`)
  });
});
