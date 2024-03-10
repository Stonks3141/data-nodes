import { useId } from 'preact/hooks';
import { NodeInfo } from './node.tsx';
import styles from './Toolbar.module.css';

export interface ToolbarProps {
	nodes: Record<string, NodeInfo>;
	onNodeAdded?: (NodeInfo) => void;
}

export const Toolbar = ({ nodes, onNodeAdded = _ => {} }: ToolbarProps) => {
	const id = useId();
	return (
		<div class={styles.toolbar}>
			<menu>
				<li><button>Edit</button></li>
				<li><button>Select</button></li>
				<li>
					<menu id={id} class={styles.addMenu} popover="auto">
						{Object.entries(nodes).map(([name, node]) => (
							<li><button onClick={() => onNodeAdded(node)}>{name}</button></li>
						))}
					</menu>
					<button popoverTarget={id}>Add</button>
				</li>
			</menu>
			<h1>Sample Project</h1>
			<div></div>
		</div>
	);
};
