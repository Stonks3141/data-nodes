import { NodeShell, InputArray, OutputNumber } from '../components/nodes';
import type { NodeComponentProps, NodeInfo } from '../node.ts';
import { intersperse } from '../wasm.ts';

export interface IntersperseInputs {
	a: Float32Array | null,
	b: Float32Array | null,
}

export interface IntersperseOutputs {
	out: Float32Array | null,
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
	func: ({ a, b }) => ({ out: a && b ? intersperse(a, b) as Float32Array : null }),
	inputs: { a: null, b: null },
};