import { NodeShell, InputArray, OutputNumber } from '../components/nodes';
import type { NodeComponentProps, NodeInfo } from '../node.ts';
import { unzip } from '../wasm.ts';

export interface UnzipInputs {
	data: Float32Array | null,
}

export interface UnzipOutputs {
	a: Float32Array | null,
	b: Float32Array | null,
}

export const Unzip = ({ id, x, y, inputs }: NodeComponentProps<UnzipInputs>) => {
	return (
		<NodeShell name="Unzip" id={id} x={x} y={y}>
			<OutputNumber name="a" label="Even" />
			<OutputNumber name="b" label="Odd" />
			<InputArray name="data" label="Data" />
		</NodeShell>
	);
};

export const UnzipNode: NodeInfo<UnzipInputs, UnzipOutputs> = {
	component: Unzip,
	func: ({ data }) => {
		const out = data ? unzip(data) as Float32Array : null;
		return { a: out?.slice(0, out.length/2) || null, b: out?.slice(out.length/2) || null };
	},
	inputs: { data: null },
};