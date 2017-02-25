import { assert } from 'chai';


import { createChainCreator } from './factories';
import { toGroovy } from './groovy';

import { inspect, render } from './';

const groovy = createChainCreator(toGroovy);

const { g } = groovy;



describe('inspect', () => {
  it('should return the internal proxied Chain object', function () {
    const chain = inspect(g.V('name', 'Alice'));

    assert.isArray(chain);
    assert.lengthOf(chain, 3);
  });
});

describe('render', () => {
  it('should return the proxied Chain representation', function () {
    const chain = render(g.V('name', 'Alice'));
    

    assert.equal(chain, "g.V('name', 'Alice')");
  });
});
