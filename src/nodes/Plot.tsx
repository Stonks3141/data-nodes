import { NodeShell, InputAny, InputNumber } from '../components/nodes';
import type { NodeComponentProps, NodeInfo } from '../node.ts';
import { useComputed } from '@preact/signals';

export interface PlotInputs {
	data: any;
	minX: number;
	minY: number;
	maxX: number;
	maxY: number;
}

export interface PlotOutputs {}

export const Plot = ({ id, x, y, inputs }: NodeComponentProps<PlotInputs>) => {
	const { minX, maxX, minY, maxY } = inputs;
	const data = inputs.data.value;
	const width = 400;
	const height = 400;
	const xtickCount = 5;
	const ytickCount = 5;
	const dx = useComputed(() => maxX.value - minX.value);
	const dy = useComputed(() => maxY.value - minY.value);

	let path = '';
	if (data !== null && data.length > 3) {
		for (let i = 0; i < data.length; i += Math.max(2, Math.floor(data.length / 1000))) {
			if (i >= data.length) break;
			const X = (data[i] - minX.value) / dx.value * width;
			const Y = height - (data[i+1] - minY.value) / dy.value * height;
			path += (i ? 'L' : 'M') + X + ' ' + Y;
		}
	}

	let xticks = [];
	for (let x = minX.value; x <= maxX.value; x += dx.value / xtickCount) {
		xticks.push([x.toFixed(1), (x - minX.value) / dx.value * width]);
	}
	let yticks = [];
	for (let y = minY.value; y <= maxY.value; y += dy.value / ytickCount) {
		yticks.push([y.toFixed(1), height - (y - minY.value) / dy.value * height]);
	}

	const onMouseDown = (event: MouseEvent) => {
		event.stopPropagation();
		const onMouseMove = (event: MouseEvent) => {
			minX.value -= event.movementX / width * dx.value;
			minY.value += event.movementY / height * dy.value;
		};
		const onMouseUp = () => {
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		};
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	};

	return (
		<NodeShell name="Plot" id={id} x={x} y={y}>
			<InputAny name="data" label="Data" />
			<InputNumber name="minX" label="Min X" value={minX} />
			<InputNumber name="minY" label="Min Y" value={minY} />
			<InputNumber name="maxX" label="Max X" value={maxX} />
			<InputNumber name="maxY" label="Max Y" value={maxY} />
			<li>
				<svg
					width={width + 64}
					height={height + 64}
					onMouseDown={onMouseDown}
					style="background-color:white;margin:4px 8px 0 8px;"
				>
					{xticks.map(([lbl, x]) => (
						<>
							<path fill="none" stroke="black" stroke-width="1.5" d={`M ${x+32} ${height+32} v8`} />
							<path fill="none" stroke="#aaa" stroke-width="1.5" d={`M ${x+32} ${height+32} v${-height}`} />
							<text x={x+24} y={height+56}>{lbl}</text>
						</>
					))}
					{yticks.map(([lbl, y]) => (
						<>
							<path fill="none" stroke="black" stroke-width="1.5" d={`M ${32} ${y+32} h-8`} />
							<path fill="none" stroke="#aaa" stroke-width="1.5" d={`M ${32} ${y+32} h${width}`} />
							<text x={4} y={y+36}>{lbl}</text>
						</>
					))}
					<path fill="none" stroke="black" stroke-width="1.5" d={`M ${-minX.value/dx.value*width+32} ${height+32} v${-height}`} />
					<path fill="none" stroke="black" stroke-width="1.5" d={`M ${32} ${height+minY.value/dy.value*height+32} h${width}`} />
					<rect fill="none" stroke="black" stroke-width="2" x="32" y="32" width={width} height={height} />
					<path fill="none" stroke="blue" stroke-width="2" transform="translate(32,32)" d={path} />
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
