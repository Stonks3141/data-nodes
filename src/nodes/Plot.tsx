import { NodeShell, InputAny, InputNumber, NodeComponentProps, NodeInfo } from '../node.tsx';

export interface PlotInputs {
	data: any;
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
}

export interface PlotOutputs {}

export const Plot = ({ id, x, y, inputs }: NodeComponentProps<PlotInputs>) => {
	const data = inputs.data.value;
	const width = 400;
	const height = 400;
	const dx = inputs.maxX.value - inputs.minX.value;
	const dy = inputs.maxY.value - inputs.minY.value;

	let path = '';
	if (data !== null && data.length > 3) {
		for (let i = 0; i < data.length; i += Math.max(2, Math.floor(data.length / 1000))) {
			if (i >= data.length) break;
			const X = (data[i] - inputs.minX.value) / dx * width;
			const Y = height - (data[i+1] - inputs.minY.value) / dy * height;
			path += (i ? 'L' : 'M') + X + ' ' + Y;
		}
	}
	//alert(dx);
	return (
		<NodeShell name="Plot" id={id} x={x} y={y}>
			<InputAny name="data" label="Data" />
			<InputNumber name="minX" label="Min X" value={inputs.minX} />
			<InputNumber name="minY" label="Min Y" value={inputs.minY} />
			<InputNumber name="maxX" label="Max X" value={inputs.maxX} />
			<InputNumber name="maxY" label="Max Y" value={inputs.maxY} />
			<li>
				<svg width={width} height={height} style="background-color:white;margin:4px 8px 0 8px;">
					<path fill="none" stroke="blue" stroke-width="2" d={path} />
				</svg>
			</li>
		</NodeShell>
	);
};

export const PlotNode: NodeInfo<PlotInputs, PlotOutputs> = {
	component: Plot,
	func: () => ({}),
	inputs: { data: null, minX: -10, minY: -10, maxX: 10, maxY: 10 },
};