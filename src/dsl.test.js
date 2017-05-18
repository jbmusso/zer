import { assert } from 'chai';

import { createDsl } from './dsl';
import { groovy, renderChain } from './';

const { g, hasLabel, has, out, users, named, V } = createDsl(groovy, {
  humans() {
    return V().hasLabel('human');
  },
  users() {
    return hasLabel('user');
  },
  following() {
    return out('follows');
  },
  named(name) {
    return has('name', name);
  },
});

describe('Custom DSL', () => {
  it('should return a chain proxy', () => {
    const chain = g.V();

    assert.equal(renderChain(chain), 'g.V()');
  });

  it('should chain generic step', () => {
    const chain = g.V(1);

    assert.equal(renderChain(chain), 'g.V(1)');
  });

  it('should chain custom steps', () => {
    const chain = g.V(2).out().users();

    assert.equal(renderChain(chain), `g.V(2).out().hasLabel('user')`);
  });

  it('should handle custom steps parameters', () => {
    const chain = g.V(2).out().named('Alice');

    assert.equal(renderChain(chain), `g.V(2).out().has('name', 'Alice')`);
  });

  it.skip('should chain a generic step right after a chain start', () => {
    const chain = g.humans();

    assert.equal(renderChain(chain), `g.V().hasLabel('human')`);
  });

  it.skip('should chain a generic step after a custom step', () => {
    const chain = g.humans().in();

    assert.equal(renderChain(chain), `g.V().hasLabel('human').in()`);
  });

  it('should chain custom step after custom step', () => {
    const chain = g.V().users().following();

    assert.equal(renderChain(chain), `g.V().hasLabel('user').out('follows')`);
  });

  it('should chain generic and custom steps', () => {
    const chain = g.V().users().in().following();

    assert.equal(
      renderChain(chain),
      `g.V().hasLabel('user').in().out('follows')`,
    );
  });

  it('should render a chain with only generic steps', () => {});

  it.skip('should accept custom steps as arguments', () => {
    const chain = g.V().repeat(out()).until(named('Alice'));

    assert.equal(
      renderChain(chain),
      `g.V().repeat(out()).until(has('name', 'Alice'))`,
    );
  });
});
