import { useId } from 'preact/hooks';
import { NodeInfo } from './node.tsx';

export interface AddNodeMenuProps {
	nodes: Record<string, NodeInfo>;
	onClick?: (NodeInfo) => void;
}

export const AddNodeMenu = ({ nodes, onClick = _ => {} }: AddNodeMenuProps) => {
	const id = useId();
	return (
		<>
			<menu id={id} popover>
				{Object.entries(nodes).map(([name, node]) => (
					<li><button onClick={() => onClick(node)}>{name}</button></li>
				))}
			</menu>
			<button popoverTarget={id}>Add</button>
		</>
	);
};