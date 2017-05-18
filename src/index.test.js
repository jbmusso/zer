import { assert } from 'chai';

import { inspectChain, renderChain, groovy } from './';

describe('inspectChain', () => {
  it('should return the internal proxied Chain object', function() {
    const { g } = groovy;
    const chain = inspectChain(g.V('name', 'Alice'));

    assert.deepPropertyVal(chain, '0.name', 'g');
    assert.deepPropertyVal(chain, '1.name', 'V');
    assert.deepPropertyVal(chain, '2.params.0', 'name');
    assert.deepPropertyVal(chain, '2.params.1', 'Alice');

    assert.isArray(chain);
    assert.lengthOf(chain, 3);
  });
});

describe('renderChain', () => {
  it('should return the proxied Chain representation', function() {
    const { g } = groovy;
    const chain = renderChain(g.V('name', 'Alice'));

    assert.equal(chain, "g.V('name', 'Alice')");
  });

  it('should return the correct representation for chained steps', () => {
    const { g } = groovy;
    const chain = g.has('firstname', 'Alice').out('knows');
    const repr = inspectChain(chain);

    assert.lengthOf(repr, 5);

    assert.deepPropertyVal(repr, '0.name', 'g');
    assert.deepPropertyVal(repr, '1.name', 'has');
    assert.deepPropertyVal(repr, '2.params.0', 'firstname');
    assert.deepPropertyVal(repr, '2.params.1', 'Alice');
    assert.deepPropertyVal(repr, '3.name', 'out');
    assert.deepPropertyVal(repr, '4.params.0', 'knows');
  });
});
