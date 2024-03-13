import { ComponentChildren } from 'preact';
import { batch, Signal } from '@preact/signals';
import { NodeId } from '../../node.ts';
import './NodeShell.css';

export interface NodeShellProps {
	children: ComponentChildren;
	id: number;
	name: string;
	x: Signal<number>;
	y: Signal<number>;
}

const NodeShell = ({ children, id, name, x, y }: NodeShellProps) => {
	const onMouseDown = (event: MouseEvent) => {
		event.stopPropagation();

		const onMouseMove = (event: MouseEvent) => batch(() => {
			x.value += event.movementX;
			y.value += event.movementY;
		});

		const onMouseUp = () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
	};

	return (
		<foreignObject x={x} y={y} width="0" height="0" class="__NodeShell">
			<details open tabindex={0} class="node" onMouseDown={onMouseDown}>
				<summary><span onClick={e => e.stopPropagation()}>{name}</span></summary>
				<ul>
					<NodeId.Provider value={id}>
						{children}
					</NodeId.Provider>
				</ul>
			</details>
		</foreignObject>
	);
};

export default NodeShell;