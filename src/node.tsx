import { createContext, FunctionComponent, ComponentChildren } from 'preact';
import { useContext } from 'preact/hooks';
import { batch, Signal } from '@preact/signals';
import { InputSocket } from './dataflow.ts';
import { cls } from './util.ts';
import './node.css';

export type SocketHandler = (nodeId: number, socket: string, event: MouseEvent) => void;
export interface SocketHandlers {
	onOutMouseDown?: SocketHandler;
	onOutMouseUp?: SocketHandler;
	onInMouseDown?: SocketHandler;
	onInMouseUp?: SocketHandler;
}

export const SocketHandlers = createContext<SocketHandlers>({});
export const NodeId = createContext<number>(0);

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

interface SocketProps {
	name: string;
	onMouseDown?: SocketHandler;
	onMouseUp?: SocketHandler;
}

const Socket = ({ name, onMouseDown, onMouseUp }: SocketProps) => {
	const nodeId = useContext(NodeId);
	const wrap = (func?: SocketHandler) => (event: MouseEvent) => func && func(nodeId, name, event);
	return (
		<svg
			width="10"
			height="10"
			viewBox="0 0 16 16"
			onMouseDown={wrap(onMouseDown)}
			onMouseUp={wrap(onMouseUp)}
		>
			<circle cx="8" cy="8" r="7" stroke="black" stroke-width="1" />
		</svg>
	);
};

const InSocket = ({ name }: { name: string }) => {
	const handlers = useContext(SocketHandlers);
	return (
		<Socket name={name} onMouseDown={handlers.onInMouseDown} onMouseUp={handlers.onInMouseUp} />
	);
};

const OutSocket = ({ name }: { name: string }) => {
	const handlers = useContext(SocketHandlers);
	return (
		<Socket name={name} onMouseDown={handlers.onOutMouseDown} onMouseUp={handlers.onOutMouseUp} />
	);
};

export interface InputProps<T> {
	name: string;
	label: string;
	value: InputSocket<T>;
}

export const InputAny = ({ name, label }: Omit<InputProps<any>, 'value'>) => {
	return (
		<li class="in">
			<InSocket name={name} />
			{label}
		</li>
	);
};

export const InputArray = ({ name, label }: Omit<InputProps<any>, 'value'>) => {
	return (
		<li class="in number">
			<InSocket name={name} />
			{label}
		</li>
	);
};

const InputNum = (parseFunc: (string) => number) => ({ name, label, value }: InputProps<number>) => {
	const onInput = (event: InputEvent) => {
		value.value = parseFunc((event.target as HTMLInputElement).value);
	}
	return (
		<li class={'in number' + (value.link.value ? ' linked' : '')}>
			<InSocket name={name} />
			<span>{label}</span>
			<input type="number" value={value.manual.value} onInput={onInput} />
		</li>
	);
};

export const InputNumber = InputNum(parseFloat);
export const InputInteger = InputNum(parseInt);

export const InputVector = ({ name, label, value }: InputProps<[number, number, number]>) => {
	const onInput = (i: 0 | 1 | 2) => (event: InputEvent) => {
		const newValue: [number, number, number] = [...value.value];
		newValue[i] = parseFloat((event.target as HTMLInputElement).value);
		value.value = newValue;
	};
	return (
		<li class={'in vector' + (value.link.value ? ' linked' : '')}>
			<div>
				<InSocket name={name} />
				{label}
			</div>
			<input type="number" value={value.value[0]} onInput={onInput(0)} />
			<input type="number" value={value.value[1]} onInput={onInput(1)} />
			<input type="number" value={value.value[2]} onInput={onInput(2)} />
		</li>
	);
};

export interface InputSelectProps extends InputProps<string> {
	options: string[] | Record<string, string[]>;
}

export const InputSelect = ({ name, label, value, options }: InputSelectProps) => {
	const onChange = (event: InputEvent) => {
		value.value = (event.target as HTMLSelectElement).value;
	}
	return (
		<li class={'in select' + (value.link.value ? ' linked' : '')}>
			<InSocket name={name} />
			<select aria-label={label} onChange={onChange}>
				{Array.isArray(options)
					? options.map(opt => <option value={opt}>{opt}</option>)
					: Object.entries(options).map(([label, group]) => (
						<optgroup label={label}>
							{group.map(opt => <option value={opt}>{opt}</option>)}
						</optgroup>
					))
				}
			</select>
		</li>
	);
};

export interface OutputProps {
	name: string;
	label: string;
}

const Output = ({ name, label, type }: OutputProps & { type: string }) => {
	return (
		<li class={'out ' + type}>
			{label}
			<OutSocket name={name} />
		</li>
	);
};

export const OutputNumber = (props: OutputProps) => <Output {...props} type="number" />;
export const OutputVector = (props: OutputProps) => <Output {...props} type="vector" />;

export interface NodeShellProps {
	id: number;
	name: string;
	x: Signal<number>;
	y: Signal<number>;
	children: ComponentChildren;
}

export const NodeShell = ({ id, name, x, y, children }: NodeShellProps) => {
	const onMouseDown = (event: MouseEvent) => {
		event.stopPropagation();

		const onMouseMove = (event: MouseEvent) => batch(() => {
			x.value += event.movementX;
			y.value += event.movementY;
		});

		const onMouseUp = () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
	};

	return (
		<foreignObject x={x} y={y} width="0" height="0" class="__NodeShell">
			<details open tabindex={0} class="node" onMouseDown={onMouseDown}>
				<summary><span onClick={e => e.stopPropagation()}>{name}</span></summary>
				<ul>
					<NodeId.Provider value={id}>
						{children}
					</NodeId.Provider>
				</ul>
			</details>
		</foreignObject>
	);
};