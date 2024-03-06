import { CombineXYZNode } from './CombineXYZ.tsx';
import { SeparateXYZNode } from './SeparateXYZ.tsx';
import { ViewerNode } from './Viewer.tsx';
import { FourierNode } from './Fourier.tsx';
import { LinspaceNode } from './Linspace.tsx';
import { IntersperseNode } from './Intersperse.tsx';
import { MathNode } from './Math.tsx';
import { PlotNode } from './Plot.tsx';

const nodeRegistry: Record<string, NodeInfo<any>> = {
	'Combine XYZ': CombineXYZNode,
	'Separate XYZ': SeparateXYZNode,
	'Viewer': ViewerNode,
	'Fourier Transform': FourierNode,
	'Linspace': LinspaceNode,
	'Intersperse': IntersperseNode,
	'Math': MathNode,
	'Plot': PlotNode,
}

export { nodeRegistry };