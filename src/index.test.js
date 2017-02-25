import { assert } from 'chai';

import { inspectChain, renderChain, groovy } from './';

const { g } = groovy;



describe('inspectChain', () => {
  it('should return the internal proxied Chain object', function () {
    const chain = inspectChain(g.V('name', 'Alice'));

    assert.isArray(chain);
    assert.lengthOf(chain, 3);
  });
});

describe('renderChain', () => {
  it('should return the proxied Chain representation', function () {
    const chain = renderChain(g.V('name', 'Alice'));
    

    assert.equal(chain, "g.V('name', 'Alice')");
  });
});
