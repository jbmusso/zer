import { assert } from 'chai';

import { createChainCreator } from './';

import { toGroovy } from './groovy';
import { STRATEGY } from './chain';


const Objects = createChainCreator(STRATEGY, toGroovy);
const Steps = createChainCreator(STRATEGY, toGroovy);


describe('Steps', () => {
  it('should expose any step', () => {
    const { out } = Steps;
    const chain = out;

    assert.isFunction(chain);
  });

  it('should expose callable steps', () => {
    const { out } = Steps;
    const chain = out();

    assert.isFunction(chain);
  });

  it('should expose steps callable with arguments', () => {
    const { out } = Steps;
    const chain = out('firstname', 'Alice');

    assert.isFunction(chain);
  });

  it('should expose steps callable with arguments and the proper __repr__()', () => {
    const { out } = Steps;
    const repr = out('firstname', 'Alice').__repr__();

    assert.deepPropertyVal(repr, '0.name', 'out');
    assert.deepPropertyVal(repr, '1.params.0', 'firstname');
    assert.deepPropertyVal(repr, '1.params.1', 'Alice');
  });
});

describe('Objects', () => {
  it('should expose any object', () => {
    const { g } = Objects;
    const chain = g;

    assert.isFunction(chain);
  });

  it('should expose any step', () => {
    const { g } = Objects;

    const chain = g.has;

    assert.isFunction(chain);
  });

  it('should expose callable steps', () => {
    const { g } = Objects;

    const chain = g.has();

    assert.isFunction(chain);
  });

  it('should expose callable steps', () => {
    const { g } = Objects;
    const chain = g.has('firstname', 'Alice');

    assert.isFunction(chain);
  });

  it('should expose non-function chainable properties', function () {
    const { g } = Objects;

    const chain = g.has.duh.foo.baz;

    assert.isFunction(chain);
  });

  it('should expose chainable steps', () => {
    const { g } = Objects;
    const chain = g.has().out();

    assert.isFunction(chain);
  });

  it('should expose chainable-callable steps', () => {
    const { g } = Objects;
    const chain = g.has.out();

    assert.isFunction(chain);
  });

  it('should expose infinitely chainable steps', () => {
    const { g } = Objects;

    const chain = g.has().out().in.foo.bar();

    assert.isFunction(chain);
  });

  it('should support arguments', () => {
    const { g } = Objects;
    const chain = g.has('firstname', 'Alice');

    assert.isFunction(chain);
  });

  it('should return an abstract chain representation object', () => {
    const { g } = Objects;
    const chain = g.has('firstname', 'Alice');
    const repr = chain.__repr__();

    assert.isArray(repr);
    assert.equal(repr.length, '3')
  });

  it('should be an Array', () => {
    const { g } = Objects;
    const repr = g.has('firstname').__repr__();
    assert.isArray(repr);
  });

  it('should return the correct representation for chained steps', () => {
    const { g } = Objects;
    const chain = g.has('firstname', 'Alice').out('knows');
    const repr = chain.__repr__();

    assert.lengthOf(repr, 5);

    assert.deepPropertyVal(repr, '0.name', 'g');
    assert.deepPropertyVal(repr, '1.name', 'has');
    assert.deepPropertyVal(repr, '2.params.0', 'firstname');
    assert.deepPropertyVal(repr, '2.params.1', 'Alice');
    assert.deepPropertyVal(repr, '3.name', 'out');
    assert.deepPropertyVal(repr, '4.params.0', 'knows');
  });

  it('should not conflict when creating multiple chains', () => {
    const { g } = Objects;

    const chain1 = g.has('firstname', 'Alice');
    const chain2 = g.out('knows');

    const repr1 = chain1.__repr__();
    const repr2 = chain2.__repr__();

    assert.isArray(repr1);
    assert.deepPropertyVal(repr1, '0.name', 'g');
    assert.deepPropertyVal(repr1, '1.name', 'has');
    assert.deepPropertyVal(repr1, '2.params.0', 'firstname');
    assert.deepPropertyVal(repr1, '2.params.1', 'Alice');


    assert.isArray(repr2);
    assert.deepPropertyVal(repr2, '0.name', 'g');
    assert.deepPropertyVal(repr2, '1.name', 'out');
    assert.deepPropertyVal(repr2, '2.params.0', 'knows');
  });
});
