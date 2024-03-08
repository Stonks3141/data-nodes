import { NodeShell, InputArray, OutputNumber, NodeComponentProps, NodeInfo } from '../node.tsx';
import { unzip } from '../wasm.ts';

export interface UnzipInputs {
	data: Float32Array,
}

export interface UnzipOutputs {
	a: Float32Array,
	b: Float32Array,
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
		const out = data ? unzip(data) : null;
		return { a: out?.slice(0, out.length/2), b: out?.slice(out.length/2) };
	},
	inputs: { data: null },
};