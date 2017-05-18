/* @flow */
import { assert } from 'chai';

import { createChainCreator, inspectChain, groovy } from './';
import type { ChainCreator } from './factories';
import groovySyntax from './lang/groovy';
import renderInline from './render/inline';

describe('Steps', () => {
  it('should expose any step', () => {
    const { out } = groovy;
    const chain = out;

    assert.isFunction(chain);
  });

  it('should expose callable steps', () => {
    const { out } = groovy;
    const chain = out();

    assert.isFunction(chain);
  });

  it('should expose steps callable with arguments', () => {
    const { out } = groovy;
    const chain = out('firstname', 'Alice');

    assert.isFunction(chain);
  });
});

describe('groovy', () => {
  it('should expose any object', () => {
    const { g } = groovy;
    const chain = g;

    assert.isFunction(chain);
  });

  it('should expose any step', () => {
    const { g } = groovy;

    const chain = g.has;

    assert.isFunction(chain);
  });

  it('should expose callable steps', () => {
    const { g } = groovy;

    const chain = g.has();

    assert.isFunction(chain);
  });

  it('should expose callable steps', () => {
    const { g } = groovy;
    const chain = g.has('firstname', 'Alice');

    assert.isFunction(chain);
  });

  it('should expose non-function chainable properties', function() {
    const { g } = groovy;

    const chain = g.has.duh.foo.baz;

    assert.isFunction(chain);
  });

  it('should expose chainable steps', () => {
    const { g } = groovy;
    const chain = g.has().out();

    assert.isFunction(chain);
  });

  it('should expose chainable-callable steps', () => {
    const { g } = groovy;
    const chain = g.has.out();

    assert.isFunction(chain);
  });

  it('should expose infinitely chainable steps', () => {
    const { g } = groovy;

    const chain = g.has().out().in.foo.bar();

    assert.isFunction(chain);
  });

  it('should support arguments', () => {
    const { g } = groovy;
    const chain = g.has('firstname', 'Alice');

    assert.isFunction(chain);
  });

  it('should not conflict when creating multiple chains', () => {
    const { g } = groovy;

    const chain1 = g.has('firstname', 'Alice');
    const chain2 = g.out('knows');

    const repr1 = inspectChain(chain1);
    const repr2 = inspectChain(chain2);

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
