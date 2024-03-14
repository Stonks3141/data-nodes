import type { NodeInfo } from '../node.ts';
import { CombineXYZNode } from './CombineXYZ.tsx';
import { SeparateXYZNode } from './SeparateXYZ.tsx';
import { ViewerNode } from './Viewer.tsx';
import { FourierNode } from './Fourier.tsx';
import { LinspaceNode } from './Linspace.tsx';
import { IntersperseNode } from './Intersperse.tsx';
import { UnzipNode } from './Unzip.tsx';
import { MathNode } from './Math.tsx';
import { PlotNode } from './Plot.tsx';

// TODO: ComplexMath

const nodeRegistry: Record<string, NodeInfo<any, any>> = {
	'Combine XYZ': CombineXYZNode,
	'Separate XYZ': SeparateXYZNode,
	'Viewer': ViewerNode,
	'Fourier Transform': FourierNode,
	'Linspace': LinspaceNode,
	'Intersperse': IntersperseNode,
	'Unzip': UnzipNode,
	'Math': MathNode,
	'Plot': PlotNode,
}

export { nodeRegistry };