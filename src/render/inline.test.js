/* @flow */
import { assert } from 'chai';

import { createChain } from '../chain';

import { createChainCreator } from '../factories';
import groovySyntax from '../lang/groovy';
import renderInline from './inline';
import { renderChain } from '../';

const groovy = createChainCreator(renderInline, groovySyntax);

describe('Render: inline', () => {
  it('should serialize a single function call', () => {
    const { g } = groovy;
    const chain1 = g.V().has('firstname', 'Alice');
    const groovyString = chain1.toString();

    assert.equal(groovyString, "g.V().has('firstname', 'Alice')");
  });

  it('should serialize multiple calls with arguments', () => {
    const { g } = groovy;
    const chain1 = g.V().has('firstname', 'Alice').out('knows');
    const groovyString = chain1.toString();

    assert.equal(groovyString, "g.V().has('firstname', 'Alice').out('knows')");
  });

  it('should serialize chain arguments', () => {
    const { g, out } = groovy;
    const chain1 = g.V().repeat(out('knows'));
    const repr = renderChain(chain1);

    assert.equal(repr, "g.V().repeat(out('knows'))");
  });

  it('should serialize as a Groovy string', () => {
    const { g } = groovy;
    const chain = g.V().has('name', 'Alice');
    const repr = renderChain(chain);

    assert.equal(repr, `g.V().has('name', 'Alice')`);
  });

  it('should return a nested string representation', () => {
    const { g, out } = groovy;
    const chain = g.V().has('name', 'Alice').repeat(out('knows'));
    const repr = renderChain(chain);

    assert.equal(repr, `g.V().has('name', 'Alice').repeat(out('knows'))`);
  });
});
