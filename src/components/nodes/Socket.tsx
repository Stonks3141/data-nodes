import { useContext } from 'preact/hooks';
import { NodeId, SocketHandlers } from '../../node.ts';
import './Socket.css';

interface SocketProps {
	name: string;
	class?: string;
	onMouseDown?: SocketHandler;
	onMouseUp?: SocketHandler;
}

const Socket = ({ name, onMouseDown, onMouseUp, ...props }: SocketProps) => {
	const nodeId = useContext(NodeId);
	const wrap = (func?: SocketHandler) => (event: MouseEvent) => func && func(nodeId, name, event);
	return (
		<svg
			width="10"
			height="10"
			viewBox="0 0 16 16"
			class={'__Socket ' + props.class}
			onMouseDown={wrap(onMouseDown)}
			onMouseUp={wrap(onMouseUp)}
		>
			<circle cx="8" cy="8" r="7" stroke="black" stroke-width="1" />
		</svg>
	);
};

export const InSocket = ({ name }: { name: string }) => {
	const handlers = useContext(SocketHandlers);
	return (
		<Socket name={name} class="__InSocket" onMouseDown={handlers.onInMouseDown} onMouseUp={handlers.onInMouseUp} />
	);
};

export const OutSocket = ({ name }: { name: string }) => {
	const handlers = useContext(SocketHandlers);
	return (
		<Socket name={name} class="__OutSocket" onMouseDown={handlers.onOutMouseDown} onMouseUp={handlers.onOutMouseUp} />
	);
};
