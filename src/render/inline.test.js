/* @flow */
import { assert } from 'chai';

import { createChain } from '../chain';

import { createChainCreator } from '../factories';
import groovySyntax from '../lang/groovy';
import renderInline from './inline';

const groovy = createChainCreator(renderInline, groovySyntax);


describe('Serialization', () => {
  it('should serialize a single function call', () => {
    const { g } = groovy;

    const chain1 = g.has('firstname', 'Alice');
    const groovyString = chain1.toString();

    assert.equal(groovyString, "g.has('firstname', 'Alice')");
  });

  it('should serialize multiple calls with arguments', () => {
    const { g } = groovy;

    const chain1 = g.has('firstname', 'Alice').out('knows');
    const groovyString = chain1.toString();

    assert.equal(groovyString, "g.has('firstname', 'Alice').out('knows')")
  });

  it('should serialize chain arguments', () => {
    const { g, out } = groovy;

    const chain1 = g.repeat(out('knows'));

    const groovyString = chain1.toString();

    assert.equal(groovyString, "g.repeat(out('knows'))");
  });

  it('should serialize as a Groovy string', () => {
    const chain = createChain()
      .startWith('foo')
      .addStep('bar')
      .addArguments('name', 'Alice');

    const repr = renderInline(chain, groovySyntax);

    assert.equal(repr, `foo.bar('name', 'Alice')`);
  });

  it('should return a nested string representation', () => {
    const chain = createChain()
      .startWith('g')
      .addStep('V')
      .addArguments()
      .addStep('has')
      .addArguments('name', 'Alice')
      .addStep('repeat')
      .addArguments(
        createChain()
          .startWith('out')
          .addArguments('name', 'Bob')
      );

    const repr = renderInline(chain, groovySyntax);

    assert.equal(repr, `g.V().has('name', 'Alice').repeat(out('name', 'Bob'))`);
  });
});
