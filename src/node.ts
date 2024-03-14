import { createContext, FunctionComponent } from 'preact';
import type { Signal } from '@preact/signals';
import { InputSocket } from './dataflow.ts';

export type SocketHandler = (nodeId: number, socket: string, event: MouseEvent) => void;
export interface SocketHandlers {
	onOutMouseDown?: SocketHandler;
	onOutMouseUp?: SocketHandler;
	onInMouseDown?: SocketHandler;
	onInMouseUp?: SocketHandler;
}

export interface NodeComponentProps<I extends {}> {
	id: number;
	x: Signal<number>;
	y: Signal<number>;
	inputs: { [Property in keyof I]: InputSocket<I[Property]> };
}
export type NodeComponent<I extends {}> = FunctionComponent<NodeComponentProps<I>>;

export interface NodeInfo<I extends {}, O extends {}> {
	component: NodeComponent<I>;
	func: (inputs: I) => O;
	inputs: I;
}

export const SocketHandlers = createContext<SocketHandlers>({});
export const NodeId = createContext<number>(0);
