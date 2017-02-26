/**
 * @flow
 */
import type { Chain } from './chain';

export type Syntax = {
  ARGUMENT_SEPARATOR: string,
  STRING(member: string): string,
  DEFAULT(member: any): string,
  CHAIN_START(member: any): string,
  STEP(member: any): string,
  ARGUMENTS(member: any): string,
};

export type ChainMember = {
  name: string,
};


export type Renderer<X> = (chain: Chain, syntax: Syntax) => Render<X>;

export type Render<X> = X;
