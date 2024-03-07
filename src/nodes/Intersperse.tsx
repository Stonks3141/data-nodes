import { NodeShell, InputArray, OutputNumber, NodeComponentProps, NodeInfo } from '../node.tsx';
import { intersperse } from '../wasm.ts';

export interface IntersperseInputs {
	a: Float32Array,
	b: Float32Array,
}

export interface IntersperseOutputs {
	out: Float32Array,
}

export const Intersperse = ({ id, x, y, inputs }: NodeComponentProps<IntersperseInputs>) => {
	return (
		<NodeShell name="Intersperse" id={id} x={x} y={y}>
			<OutputNumber name="out" label="Data" />
			<InputArray name="a" label="Even" />
			<InputArray name="b" label="Odd" />
		</NodeShell>
	);
};

export const IntersperseNode: NodeInfo<IntersperseInputs, IntersperseOutputs> = {
	component: Intersperse,
	func: ({ a, b }) => ({ out: a && b ? intersperse(a, b) : null }),
	inputs: { a: null, b: null },
};