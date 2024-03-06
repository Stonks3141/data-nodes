import { NodeShell, InputVector, OutputNumber, NodeComponentProps, NodeInfo } from '../node.tsx';

export interface SeparateXYZInputs {
	vector: [number, number, number];
}

export interface SeparateXYZOutputs {
	x: number;
	y: number;
	z: number;
}

export type SeparateXYZProps = NodeComponentProps<SeparateXYZInputs>;

export const SeparateXYZ = ({ id, x, y, inputs }: SeparateXYZProps) => {
	return (
		<NodeShell name="Separate XYZ" id={id} x={x} y={y}>
			<OutputNumber name="x" label="X" />
			<OutputNumber name="y" label="Y" />
			<OutputNumber name="z" label="Z" />
			<InputVector name="vector" label="Vector" value={inputs.vector} />
		</NodeShell>
	);
};

export const SeparateXYZNode: NodeInfo<SeparateXYZInputs, SeparateXYZOutputs> = {
	component: SeparateXYZ,
	func: ({ vector }) => ({ x: vector[0], y: vector[1], z: vector[2] }),
	inputs: { vector: [0, 0, 0] },
};