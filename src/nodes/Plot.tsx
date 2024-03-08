import { NodeShell, InputAny, NodeComponentProps, NodeInfo } from '../node.tsx';

export interface PlotInputs {
	data: any;
}

export interface PlotOutputs {}

export const Plot = ({ id, x, y, inputs }: NodeComponentProps<PlotInputs>) => {
	const data = inputs.data.value;
	const scale = 100;
	const dx = 0;
	const dy = 0;
	let path = '';
	if (data !== null && data.length > 3) {
		for (let i = 0; i < data.length; i += Math.max(2, Math.floor(data.length / 1000))) {
			if (i >= data.length) break;
			path += (i ? 'L' : 'M') + (data[i] * scale + dx) + ' ' + (data[i+1] * scale + dy);
		}
	}
	//alert(path);
	return (
		<NodeShell name="Plot" id={id} x={x} y={y}>
			<InputAny name="data" label="Data" />
			<svg width="200" height="200">
				<path fill="none" stroke="blue" stroke-width="2" d={path} />
			</svg>
		</NodeShell>
	);
};

export const PlotNode: NodeInfo<PlotInputs, PlotOutputs> = {
	component: Plot,
	func: () => ({}),
	inputs: { data: null },
};