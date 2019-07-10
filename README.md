# zer

Zer helps you serialize any JavaScript chains to String representations of any languages by leveraging ES2015 `Proxy` objects.

## Installation

```shell
npm install zer
```

## Usage

Zer is currently useful for generating Gremlin-Groovy graph database queries.

```javascript

import { gremlin, renderChain } from 'zer';

const { g, out, has } = gremlin;

const chain = g.V().has('name', 'Alice').repeat(out('knows')).until(has('name', 'Bob'));
const rendered_chain = renderChain(chain);

console.log(rendered_chain);
/*
 {
    query: 'g.V().has(p0, p1).repeat(out(p2)).until(has(p3, p4))',
    params: {
        p0: 'name',
        p1: 'Alice',
        p2: 'knows',
        p3: 'name',
        p4: 'Bob'
    }
 }
*/

console.log(chain.__repr__());
/*
 [
     ChainStart { name: 'g', type: 'CHAIN_START' },
     Step { name: 'V', type: 'STEP' },
     Arguments { params: [], type: 'ARGUMENTS' },
     Step { name: 'has', type: 'STEP' },
     Arguments { params: [ 'name', 'Alice' ], type: 'ARGUMENTS' },
     Step { name: 'repeat', type: 'STEP' },
     Arguments {
       params: [
         {
           query: 'out(p0)',
           params: {
             p0: 'knows'
           }
         }
       ],
       type: 'ARGUMENTS'
     },
     Step {
       name: 'until',
       type: 'STEP'
     },
     Arguments {
       params: [
         {
           query: 'has(p0, p1)',
           params: {
             p0: 'name',
             p1: 'Bob'
           }
         }
       ],
       type: 'ARGUMENTS'
     }
  ]
*/

```

## Argument escaping

Zer allows you to output Objects, not just Strings. This is especially useful when you wish to escape some arguments from your chain, such as when creating a DSL for a database client (SQL, Gremlin...).

```javascript
const chain = g.V().has('name', 'Alice').repeat(out('knows')).until(has('name', 'Bob'));

console.log(chain.__repr__())

/*
 { query: 'g.V().has(p0, p1).has(p2, p3).repeat(out(p4, p5))',
  params:
   {
     p0: 'name',
     p1: 'Alice',
     p2: 'age',
     p3: 30,
     p4: 'firstname',
     p5: 'Bob'
   }
*/
```

