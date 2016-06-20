import { assert } from 'chai';

import { createChainCreator } from './';

import { toGroovy } from './groovy';
import { STRATEGY } from './chain';


const Objects = createChainCreator(STRATEGY, toGroovy);
const Steps = createChainCreator(STRATEGY, toGroovy);
const Statics = createChainCreator(STRATEGY, toGroovy);


describe('Steps', () => {
  it('should expose any step', () => {
    const { has } = Steps;

    assert.isFunction(has);
  });

  it('should expose callable steps', () => {
    const { has, out } = Steps;
    const chain = has('firstname', 'Alice');

    assert.isFunction(chain);
  });

  it('should expose non-function chainable properties', function () {
    const { has } = Steps;

    const chain = has.crap.foo.baz;

    assert.isFunction(chain);
  });

  it('should expose chainable steps', () => {
    const { has } = Steps;
    const chain = has().out();

    assert.isFunction(chain);
  });

  it('should expose chainable-callable steps', () => {
    const { has } = Steps;
    const chain = has.out();

    assert.isFunction(chain);
  });

  it('should expose infinitely chainable steps', () => {
    const { has } = Steps;

    const chain = has().out().in.foo.bar();

    assert.isFunction(chain);
  });

  it('should support arguments', () => {
    const { has } = Steps;
    const chain = has('firstname', 'Alice');

    assert.isFunction(chain);
  });

  it('should return an abstract chain representation object', () => {
    const { has } = Steps;
    const chain = has('firstname', 'Alice');
    const repr = chain.__repr__();

    assert.isArray(repr);
    assert.equal(repr.length, '2')
  });

  it('should not conflict when creating multiple chains', () => {
    const { has, out } = Steps;

    const chain1 = has('firstname', 'Alice');
    const chain2 = out('knows');

    const repr1 = chain1.__repr__();
    const repr2 = chain2.__repr__();

    assert.isArray(repr1);
    assert.deepPropertyVal(repr1, '0.name', 'has');
    assert.deepPropertyVal(repr1, '1.params.0', 'firstname');
    assert.deepPropertyVal(repr1, '1.params.1', 'Alice');


    assert.isArray(repr2);
    assert.deepPropertyVal(repr2, '0.name', 'out');
    assert.deepPropertyVal(repr2, '1.params.0', 'knows');
  });
});

describe('Chain tree', () => {
  it('should be an Array', () => {
    const { has } = Steps;
    const repr = has('firstname').__repr__();
    assert.isArray(repr);
  });

  it('should return the correct representation for chained steps', () => {
    const { has } = Steps;
    const chain = has('firstname', 'Alice').out('knows');
    const repr = chain.__repr__();

    assert.lengthOf(repr, 4);


    assert.deepPropertyVal(repr, '0.name', 'has');
    assert.deepPropertyVal(repr, '1.params.0', 'firstname');
    assert.deepPropertyVal(repr, '1.params.1', 'Alice');
    assert.deepPropertyVal(repr, '2.name', 'out');
    assert.deepPropertyVal(repr, '3.params.0', 'knows');
  });

  it.skip('should return the correct representation for chained steps', () => {
    const { has } = Steps;
    const chain = has('firstname', 'Alice').out('knows');
    const repr = chain.__repr__();

    assert.lengthOf(repr, 4);


    assert.deepPropertyVal(repr, '0.name', 'has');
    assert.deepPropertyVal(repr, '1.params.0', 'firstname');
    assert.deepPropertyVal(repr, '1.params.1', 'Alice');
    assert.deepPropertyVal(repr, '2.name', 'out');
    assert.deepPropertyVal(repr, '3.params.0', 'knows');
  });
});
