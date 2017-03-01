/* @flow */
import util from 'util';

import { createChain, Chain, ChainMember } from './chain';
import type { Syntax, Renderer, Render } from './types';


export type ChainCreatorProxy = Proxy<createProxiedChain>;

export function createChainCreator(render: Renderer<Render<*>>, syntax: Syntax): ChainCreatorProxy {
  // This Proxy initiates the chain, and must return a new Chain
  const handler = {
    get(createProxiedChainTarget: Function, name: string): ChainProxy {
      return createProxiedChainTarget(name, render, syntax, {});
    }
  };

  return new Proxy(createProxiedChain, handler);
};

export const rendererSymbol: Symbol = Symbol('renderFunction');

export function inspectRenderer(chain) {
  return chain[rendererSymbol]
}

export const syntaxSymbol: Symbol = Symbol('syntax');

export function inspectSyntax(chain) {
  return chain[syntaxSymbol];
}
/**
 * A ProxiedChain is a Proxy<Function>
 */
function createProxiedChain(chainName: string, render: Renderer<Render<*>>, syntax: Syntax): Proxy<Function> {
  const proxiedChain = new Proxy(createChainBuilder, {
    get(target: Function, name: string): ChainBuilder {
      const chain: Chain = createChain()
        .startWith(chainName);
      const builder = target(chain, render, syntax)[name];

      return builder;
    },

    apply(target: Function, thisArg: *, args: Array<*>): ChainBuilder {
      const chain = createChain()
        .startWith(chainName);
      const builder = target(chain, render, syntax)(...args);

      return builder;
    },
  });

  return proxiedChain;
}

export const inspectSymbol: Symbol = Symbol('inspect');
export const renderSymbol: Symbol = Symbol('render');

function createProxyHandlers(chain: Chain, methodName: string, render: Renderer<Render<*>>, syntax: Syntax): any {
  const handlers = {
    [inspectSymbol](): Array<ChainMember> {
      return chain.members;
    },
    [renderSymbol](): Renderer<Render<*>> {
      return render(chain, syntax);
    },
    [rendererSymbol]() {
      return render;
    },
    [syntaxSymbol]() {
      return syntax;
    },
    toString(): Renderer<Render<string>> {
      return (): Render<string> => render(chain, syntax);
    },
    // Called with console.log(chain) -- single arg
    [util.inspect.custom](): Renderer<Render<string>> {
      return (): Render<string> => util.inspect(render(chain, syntax));
    },
    // Called with console.log('arg', chain) -- multiple args
    [Symbol.toPrimitive](): Renderer<Render<string>> {
      return (): Render<string> => util.inspect(render(chain, syntax));
    },
    [Symbol.toStringTag](): Renderer<Render<string>> {
      return (): Render<string> => render(chain, syntax);
    },    
    __repr__(): Function {
      return (): Array<ChainMember> => chain.members;
    }
  };

  return handlers[methodName];
}


export type ChainBuilder = Proxy<ProxiedFunction>;

export function createChainBuilder(chain: Chain, render: Renderer<Render<*>>, syntax: Syntax, custom = {}): ChainBuilder {
  const builder = new Proxy(() => {}, {
    get(target: Function, name: string, receiver: ChainBuilder): ChainBuilder {
      const handler = createProxyHandlers(chain, name, render, syntax);

      if (handler) {
        return handler();
      }

      chain.addStep(name);

      return receiver;
    },

    apply(target: Function, thisArg: any, args: Array<any>): ChainBuilder {
      chain.addArguments(...args);

      return builder;
    }
  });

  return builder;
};
