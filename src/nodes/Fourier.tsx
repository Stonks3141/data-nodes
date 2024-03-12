import { NodeShell, InputArray, OutputNumber, NodeComponentProps, NodeInfo } from '../node.tsx';
import { fft } from '../wasm.ts';

export interface FourierInputs {
	data: Float32Array | null,
}

export interface FourierOutputs {
	data: Float32Array | null,
}

export const Fourier = ({ id, x, y, inputs }: NodeComponentProps<FourierInputs>) => {
	return (
		<NodeShell name="Fourier Transform" id={id} x={x} y={y}>
			<OutputNumber name="data" label="Frequency" />
			<InputArray name="data" label="Time" />
		</NodeShell>
	);
};

export const FourierNode: NodeInfo<FourierInputs, FourierOutputs> = {
	component: Fourier,
	func: ({ data }) => ({ data: data ? fft(data) : null }),
	inputs: { data: null },
};
