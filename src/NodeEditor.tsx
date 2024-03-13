import { useContext, useEffect, useMemo, useRef } from 'preact/hooks';
import { signal, computed, batch, useSignal, useComputed, Signal } from '@preact/signals';
import { Pb } from './pb.ts';
import { nodeRegistry } from './nodes';
import { SocketHandlers, SocketHandler, NodeInfo } from './node.tsx';
import { InputSocket } from './dataflow.ts';
import { Toolbar } from './Toolbar.tsx';
import './NodeEditor.css';

export const nodeFactory = () => {
	let nextNodeId = 0;
	return (x: number, y: number, { component, func, inputs }: NodeInfo<any, any>) => {
		const mapEntries = (obj: {}, f: (x: [string, any]) => [string, any]) => (
			Object.fromEntries(Object.entries(obj).map(f))
		);
		const instanceInputs = mapEntries(inputs, ([k, v]) => [k, new InputSocket(v)]);
		const output = computed(() => func(mapEntries(instanceInputs, ([k, v]) => [k, v.value])));
		return {
			id: nextNodeId++,
			component,
			x: signal(x),
			y: signal(y),
			inputs: instanceInputs,
			outputs: mapEntries(output.value, ([k, _]) => [k, computed(() => output.value[k])]),
		};
	};
};

interface LinkProps {
	fromX: Signal<number>;
	fromY: Signal<number>;
	toX: Signal<number>;
	toY: Signal<number>;
}

const Link = ({ fromX, fromY, toX, toY }: LinkProps) => {
	const c1x = fromX.value + Math.abs(toX.value - fromX.value) / 3;
	const c2x = toX.value - Math.abs(toX.value - fromX.value) / 3;
	return (
		<path
			class={styles.link}
			d={`M ${fromX} ${fromY} C ${c1x} ${fromY} ${c2x} ${toY} ${toX} ${toY}`}
		/>
	);
};

const getPos = (elem: Element) => {
	const rect = elem.getBoundingClientRect();
	const x = rect.x + (rect.right - rect.x) / 2;
	const y = rect.y + (rect.bottom - rect.y) / 2;
	return {x, y};
};

interface LinkData extends LinkProps {
	from: { nodeId: number, socket: string };
	to: { nodeId: number, socket: string };
}

const NodeEditor = ({ user, project }) => {
	const pb = useContext(Pb);

	const offsetX = useSignal(0);
	const offsetY = useSignal(0);
	const scale = useSignal(1);

	const instantiateNode = useMemo(nodeFactory, []);
	const svgRef = useRef(null);

	const nodes = useSignal([]);

	const currentLink = useSignal<null | Omit<LinkData, 'to'>>(null);
	const links = useSignal<LinkData[]>([]);
	const allLinks = useComputed(() => (links.value as LinkProps[]).concat(currentLink.value as LinkProps ?? []));

	useEffect(async () => {
		const projectData = await pb.collection('projects')
			.getFirstListItem(pb.filter('name = {:project} && owner.username = {:user}', { project, user }));
		const filter = pb.filter('project.id = {:id}', { id: projectData.id });
		const projectNodes = await pb.collection('nodes').getFullList({ filter });
		const projectLinks = await pb.collection('links').getFullList({ filter });
		console.log(projectNodes);
		console.log(projectLinks);
		const instances = projectNodes.map(node => instantiateNode(node.x, node.y, node.name));
		nodes.value = nodes.value.concat(instances);
	}, []);

	const onOutMouseDown: SocketHandler = (nodeId, socket, event) => {
		event.stopPropagation();
		const svgRect = svgRef.current?.getBoundingClientRect();
		const svgX = svgRect?.x ?? 0;
		const svgY = svgRect?.y ?? 0;
		const pos = getPos(event.target as Element);
		pos.x -= svgX;
		pos.y -= svgY;
		const node = nodes.value.find(x => x.id === nodeId);
		if (!node) throw new Error('no node for mousedown id');

		const xOffs = (pos.x - offsetX.value) / scale.value - node.x.value;
		const yOffs = (pos.y - offsetY.value) / scale.value - node.y.value;

		const fromX = computed(() => node.x.value + xOffs);
		const fromY = computed(() => node.y.value + yOffs);

		const mouseX = signal(event.clientX);
		const mouseY = signal(event.clientY);
		const toX = computed(() => (mouseX.value - svgX - offsetX.value) / scale.value);
		const toY = computed(() => (mouseY.value - svgY - offsetY.value) / scale.value);

		const onMouseMove = (event: MouseEvent) => batch(() => {
			mouseX.value += event.movementX;
			mouseY.value += event.movementY;
		});

		const onMouseUp = () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
			currentLink.value = null;
		};

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);

		currentLink.value = {from: {nodeId, socket}, fromX, fromY, toX, toY};
	};

	const onInMouseDown: SocketHandler = (nodeId, socket, event) => {
		event.stopPropagation();
		const i = links.value.findIndex(l => l.to.nodeId === nodeId && l.to.socket === socket);
		if (i == -1) return;
		const node = nodes.value.find(x => x.id === nodeId);
		if (!node) throw new Error('no node for inmousedown id');

		const svgRect = svgRef.current?.getBoundingClientRect();
		const svgX = svgRect?.x ?? 0;
		const svgY = svgRect?.y ?? 0;

		const mouseX = signal(event.clientX);
		const mouseY = signal(event.clientY);
		const toX = computed(() => (mouseX.value - svgX - offsetX.value) / scale.value);
		const toY = computed(() => (mouseY.value - svgY - offsetY.value) / scale.value);

		batch(() => {
			node.inputs[socket].link.value = null;
			currentLink.value = {...links.value[i], toX, toY};
			links.value = links.value.toSpliced(i, 1);
		});

		const onMouseMove = (event: MouseEvent) => batch(() => {
			mouseX.value += event.movementX;
			mouseY.value += event.movementY;
		});

		const onMouseUp = () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
			currentLink.value = null;
		};

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
	};

	const onInMouseUp: SocketHandler = (nodeId, socket, event) => {
		if (!currentLink.value) return;
		event.stopPropagation();
		const fromNode = nodes.value.find(x => x.id === currentLink.value!.from.nodeId);
		const node = nodes.value.find(x => x.id === nodeId);
		if (!node || !fromNode) throw new Error('no nodes for inmouseup ids');

		const svgRect = svgRef.current?.getBoundingClientRect();
		const svgX = svgRect?.x ?? 0;
		const svgY = svgRect?.y ?? 0;
		const pos = getPos(event.target as Element);
		pos.x -= svgX;
		pos.y -= svgY;

		const xOffs = (pos.x - offsetX.value) / scale.value - node.x.value;
		const yOffs = (pos.y - offsetY.value) / scale.value - node.y.value;

		const toX = computed(() => node.x.value + xOffs);
		const toY = computed(() => node.y.value + yOffs);

		batch(() => {
			node.inputs[socket].link.value = fromNode.outputs[currentLink.value!.from.socket];
			links.value = [
				...links.value.filter(l => l.to.nodeId !== nodeId || l.to.socket !== socket),
				{...currentLink.value!, to: {nodeId, socket}, toX, toY},
			];
			currentLink.value = null;
		});
	};

	const socketHandlers = {
		onOutMouseDown,
		onInMouseDown,
		onInMouseUp,
	};

	const onKeyDown = (event: KeyboardEvent) => {
		if (event.code === 'KeyX') {
			alert('X');
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, []);

	const onBgMouseDown = () => {
		const onMouseMove = (event: MouseEvent) => batch(() => {
			offsetX.value += event.movementX;
			offsetY.value += event.movementY;
		});

		const onMouseUp = () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
		};

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mouseup', onMouseUp);
	};

	const onBgWheel = (event: WheelEvent) => batch(() => {
		const delta = event.deltaY * 0.001;
		offsetX.value -= (event.clientX - offsetX.value) * delta;
		offsetY.value -= (event.clientY - offsetY.value) * delta;
		scale.value *= 1 + delta;
	});

	const onNodeAdded = (node: NodeInfo) => {
		nodes.value = nodes.value.concat(instantiateNode(100, 100, node));
	};

	return (
		<div class="__NodeEditor">
		<Toolbar nodes={nodeRegistry} onNodeAdded={onNodeAdded} />
		<svg width="100vw" height="100vh" ref={svgRef} onMouseDown={onBgMouseDown} onWheel={onBgWheel}>
			<pattern
				id="bg-grid-major"
				patternUnits="userSpaceOnUse"
				x={offsetX} y={offsetY}
				width={120 * scale.value} height={120 * scale.value}
			>
				<pattern id="bg-grid-minor" patternUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
					<circle cx="2" cy="2" r="1" fill="#242424" />
				</pattern>
				<g transform={`scale(${scale})`}>
					<rect fill="url(#bg-grid-minor)" x="0" y="0" width="100%" height="100%" />
					<circle cx="2" cy="2" r="2" fill="#242424" />
				</g>
			</pattern>
			<rect fill="url(#bg-grid-major)" x="0" y="0" width="100%" height="100%" />
			<g transform={`translate(${offsetX},${offsetY}) scale(${scale})`}>
				{allLinks.value.map(({fromX, fromY, toX, toY}) => (
					<Link fromX={fromX} fromY={fromY} toX={toX} toY={toY} />
				))}
				<SocketHandlers.Provider value={socketHandlers}>
					{nodes.value.map(node => (
						<node.component id={node.id} x={node.x} y={node.y} inputs={node.inputs} />
					))}
				</SocketHandlers.Provider>
			</g>
		</svg>
		</div>
	);
};

export default NodeEditor;