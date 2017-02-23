# zer

Zer helps you serialize any JavaScript chains to String representations of any languages by leveraging ES2015 `Proxy` objects.

## Installation

```shell
npm install zer
```

## Usage

Zer is currently useful for generating Gremlin-Groovy graph database queries.

```javascript

import { createChainCreator } from 'zer';

import { toGroovy } from 'zer/src/groovy';
import { STRATEGY } from 'zer/src/chain';

const Objects = createChainCreator(STRATEGY, toGroovy);

const { g, out, has } = Objects;

const chain = g.V().has('name', 'Alice').repeat(out('knows')).until(has('name', 'Bob'));

console.log(chain.__repr__());
// g.V().has('name', 'Alice').repeat(out('knows')).until(has('name', 'Bob'))
```

## Argument escaping

Zer allows you to output Objects, not just Strings. This is especially useful when you wish to escape some arguments from your chain, such as when creating a DSL for a database client (SQL, Gremlin...).

```javascript
const chain = g.V().has('name', 'Alice').repeat(out('knows')).until(has('name', 'Bob'));

console.log(chain.__repr__())

/*
 { query: 'g.V().has(p0, p1).has(p2, p3).repeat(out(p4, p5))',
  params:
   { p0: 'name',
     p1: 'Alice',
     p2: 'age',
     p3: 30,
     p4: 'firstname',
     p5: 'Bob' }
*/
```

