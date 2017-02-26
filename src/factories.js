/* @flow */
import util from 'util';

import { createChain, Chain, ChainMember } from './chain';
import type { Syntax, Renderer, Render } from './types';


export type ChainCreatorProxy = Proxy<createProxiedChain>;

export function createChainCreator(render: Renderer<Render<*>>, syntax: Syntax): ChainCreatorProxy {
  // This Proxy initiates the chain, and must return a new Chain
  const handler = {
    get(targetCreateChainProxy: Function, name: string): ChainProxy {
      return targetCreateChainProxy(name, render, syntax);
    }
  };

  return new Proxy(createProxiedChain, handler);
};

type GenericMap = { [key: any]: any };
type ProxiedFunction = (...args: Array<any>) => any;
type ChainProxy = Proxy<GenericMap>;


function createProxiedChain(chainName: string, render: Renderer<Render<*>>, syntax: Syntax): ChainProxy {
  const proxiedChain = new Proxy(() => {}, {
    get(target: Function, name: string): ChainBuilder {
      const chain: Chain = createChain()
        .startWith(chainName);

      const chainBuilder: ChainBuilder = createChainBuilder(chain, render, syntax);

      chainBuilder[name];

      return chainBuilder;
    },

    apply(target: Function, thisArg: *, args: Array<*>): ChainBuilder {
      const chain = createChain()
        .startWith(chainName);

      chain.addArguments(...args);

      const chainBuilder = createChainBuilder(chain, render, syntax);

      return chainBuilder;
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
    __repr__(): Function {
      return (): Array<ChainMember> => chain.members;
    }
  };

  return handlers[methodName];
}


export type ChainBuilder = Proxy<ProxiedFunction>;

export function createChainBuilder(chain: Chain, render: Renderer<Render<*>>, syntax: Syntax): ChainBuilder {
  const chainProxy = new Proxy(() => {}, {
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

      return chainProxy;
    }
  });

  return chainProxy;
};
