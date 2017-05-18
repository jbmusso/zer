/* @flow */
import { assert } from 'chai';

import { renderChain, gremlin } from '../';

describe('Render: Gremlin Server', () => {
  it('should return a string representation where primitives, objects and array are bound except other chains', () => {
    const { foo } = gremlin;
    const chain = foo.bar('name', 'Alice');
    const repr = renderChain(chain);

    assert.isObject(repr);
    assert.equal(repr.query, `foo.bar(p0, p1)`);
    assert.deepEqual(repr.params, { p0: 'name', p1: 'Alice' });
  });

  it('should propagate offsets', () => {
    const { foo } = gremlin;
    const chain = foo.has('name', 'Alice').has('age', 30);
    const repr = renderChain(chain);

    assert.isObject(repr);
    assert.equal(repr.query, `foo.has(p0, p1).has(p2, p3)`);
    assert.deepEqual(repr.params, {
      p0: 'name',
      p1: 'Alice',
      p2: 'age',
      p3: 30,
    });
  });

  it('should return a recursive string representation with all primitives bound', () => {
    const { g, out } = gremlin;
    const chain = g
      .V()
      .has('name', 'Alice')
      .has('age', 30)
      .repeat(out('firstname', 'Bob'));
    const repr = renderChain(chain);

    assert.deepPropertyVal(repr, 'params.p0', 'name');
    assert.deepPropertyVal(repr, 'params.p1', 'Alice');
    assert.deepPropertyVal(repr, 'params.p2', 'age');
    assert.deepPropertyVal(repr, 'params.p3', 30);
    assert.deepPropertyVal(repr, 'params.p4', 'firstname');
    assert.deepPropertyVal(repr, 'params.p5', 'Bob');

    assert.equal(
      repr.query,
      `g.V().has(p0, p1).has(p2, p3).repeat(out(p4, p5))`,
    );
  });
});
