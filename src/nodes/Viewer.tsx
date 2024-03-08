import { NodeShell, InputAny, NodeComponentProps, NodeInfo } from '../node.tsx';

export interface ViewerInputs {
	value: any;
}

export interface ViewerOutputs {}

export const Viewer = ({ id, x, y, inputs }: NodeComponentProps<ViewerInputs>) => {
	let data = inputs.value.value;
	if (ArrayBuffer.isView(data)) {
		data = Array.from(data);
	}
	return (
		<NodeShell name="Viewer" id={id} x={x} y={y}>
			<InputAny name="value" label="Value" />
			<li>
				<pre style="padding-left: 8px; white-space: pre-wrap; overflow-wrap: anywhere;">
					{JSON.stringify(data)}
				</pre>
			</li>
		</NodeShell>
	);
};

export const ViewerNode: NodeInfo<ViewerInputs, ViewerOutputs> = {
	component: Viewer,
	func: () => ({}),
	inputs: { value: null },
};