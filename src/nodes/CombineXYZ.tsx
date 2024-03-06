import { NodeShell, InputNumber, OutputVector, NodeComponentProps, NodeInfo } from '../node.tsx';

export interface CombineXYZInputs {
	x: number;
	y: number;
	z: number;
}

export interface CombineXYZOutputs {
	vector: [number, number, number];
}

export type CombineXYZProps = NodeComponentProps<CombineXYZInputs>;

export const CombineXYZ = ({ id, x, y, inputs }: CombineXYZProps) => {
	return (
		<NodeShell name="Combine XYZ" id={id} x={x} y={y}>
			<OutputVector name="vector" label="Vector" />
			<InputNumber name="x" label="X" value={inputs.x} />
			<InputNumber name="y" label="Y" value={inputs.y} />
			<InputNumber name="z" label="Z" value={inputs.z} />
		</NodeShell>
	);
};

export const CombineXYZNode: NodeInfo<CombineXYZInputs, CombineXYZOutputs> = {
	component: CombineXYZ,
	func: ({ x, y, z }) => ({ vector: [x, y, z] }),
	inputs: { x: 0, y: 0, z: 0 },
};