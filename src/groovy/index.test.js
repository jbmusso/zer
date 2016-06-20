import { assert } from 'chai';

import { createChain } from '../chain';

import { toGroovy, toBoundGroovy } from './';
import { Objects, Steps } from './';


describe('Objects', () => {
  it('should expose Objects', () => {
    assert.isDefined(Objects);
    // assert.isDefined(g);
  });

  it('should expose Steps', () => {
    assert.isDefined(Steps);
  });
});



describe('Serialization', () => {
  it('should serialize a single function call', () => {
    const { has } = Steps;
    const chain1 = has('firstname', 'Alice');
    // console.log('..........')
    const groovy = chain1.toString();

    assert.equal(groovy, "has('firstname', 'Alice')");
  });

  it('should serialize multiple calls with arguments', () => {
    const { has } = Steps;
    const chain1 = has('firstname', 'Alice').out('knows');
    const groovy = chain1.toString();

    assert.equal(groovy, "has('firstname', 'Alice').out('knows')")
  });

  it('should serialize chain arguments', () => {
    const { repeat, out } = Steps;
    const chain1 = repeat(out('knows'));
    const groovy = chain1.toString();

    assert.equal(groovy, "repeat(out('knows'))");
  });

  it('should return a bound object with {query, params} signature for primitive values (string, number, boolean and non-chain objects): these can always be bound safely', () => {
    // body...
  });
});



describe('Representation', () => {

  describe('without bound arguments', function () {
    it('should return a string representation', () => {
      const chain = createChain('foo');
      chain.addProperty('bar');
      chain.addArguments('name', 'Alice');

      const repr = toGroovy(chain);

      assert.equal(repr, `foo.bar('name', 'Alice')`);
    });

    it('should return a nested string representation', () => {
      const ch = createChain('g')
        .addProperty('V')
        .addArguments()
        .addProperty('has')
        .addArguments('name', 'Alice')
        .addProperty('repeat')
        .addArguments(
          createChain('out')
            .addArguments('name', 'Bob')
        );

      const repr = toGroovy(ch);

      assert.equal(repr, `g.V().has('name', 'Alice').repeat(out('name', 'Bob'))`);
    });
  });

  describe('with bound arguments', function () {

    it('should return a string representation where primitives, objects and array are bound except other chains', () => {
      const ch = createChain('foo')
        .addProperty('bar')
        .addArguments('name', 'Alice');

      const repr = toBoundGroovy(ch);

      assert.isObject(repr);
      assert.equal(repr.query, `foo.bar(p0, p1)`);
      assert.deepEqual(repr.params, { p0: 'name', p1: 'Alice' });
    });

    it('should propagate offset', function () {
      const ch = createChain('foo')
        .addProperty('has')
        .addArguments('name', 'Alice')
        .addProperty('has')
        .addArguments('age', 30)

      const repr = toBoundGroovy(ch);

      assert.isObject(repr);
      assert.equal(repr.query, `foo.has(p0, p1).has(p2, p3)`);
      assert.deepEqual(repr.params, { p0: 'name', p1: 'Alice', p2: 'age', p3: 30 });
    });

    it('should return a recursive string representation with all primitives bound', () => {
      const ch = createChain('g')
        .addProperty('V')
        .addArguments()
        .addProperty('has')
        .addArguments('name', 'Alice')
        .addProperty('has')
        .addArguments('age', 30)
        .addProperty('repeat')
        .addArguments(
          createChain('out')
            .addArguments('firstname', 'Bob')
        );

      const repr = toBoundGroovy(ch);

      assert.deepPropertyVal(repr, 'params.p0', 'name');
      assert.deepPropertyVal(repr, 'params.p1', 'Alice');
      assert.deepPropertyVal(repr, 'params.p2', 'age');
      assert.deepPropertyVal(repr, 'params.p3', 30);
      assert.deepPropertyVal(repr, 'params.p4', 'firstname');
      assert.deepPropertyVal(repr, 'params.p5', 'Bob');

      assert.equal(repr.query, `g.V().has(p0, p1).has(p2, p3).repeat(out(p4, p5))`)
    });
  });
});
