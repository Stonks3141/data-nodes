import { NodeShell, InputNumber, InputInteger, OutputNumber, NodeComponentProps, NodeInfo } from '../node.tsx';
import { linspace } from '../wasm.ts';

export interface LinspaceInputs {
	start: number,
	stop: number,
	n: number,
}

export interface LinspaceOutputs {
	data: Float64Array,
}

export const Linspace = ({ id, x, y, inputs }: NodeComponentProps<LinspaceInputs>) => {
	return (
		<NodeShell name="Linspace" id={id} x={x} y={y}>
			<OutputNumber name="data" label="Data" />
			<InputNumber name="start" label="Start" value={inputs.start} />
			<InputNumber name="stop" label="Stop" value={inputs.stop}/>
			<InputInteger name="n" label="n" value={inputs.n} />
		</NodeShell>
	);
};

export const LinspaceNode: NodeInfo<LinspaceInputs, LinspaceOutputs> = {
	component: Linspace,
	func: ({ start, stop, n }) => ({ data: linspace(start, stop, Math.floor(n)) }),
	inputs: { start: 0, stop: 1, n: 10 },
};