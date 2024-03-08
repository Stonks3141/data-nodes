import { mathS, mathV, mathSS, mathSV, mathVS, mathVV } from '../wasm.ts';
import { NodeShell, InputNumber, InputSelect, OutputNumber, NodeComponentProps, NodeInfo } from '../node.tsx';

export enum MathOpFunc {
	Add = 'Add',
	Sub = 'Subtract',
	Mul = 'Multiply',
	Div = 'Divide',
	Pow = 'Power',
	Log = 'Logarithm',
	Sqrt = 'Square Root',
	Exp = 'Exponent',
}
export enum MathOpCmp {
	Min = 'Minimum',
	Max = 'Maximum',
	Lt = 'Less Than',
	Gt = 'Greater Than',
	Sign = 'Sign',
}
export enum MathOpRound {
	Round = 'Round',
	Floor = 'Floor',
	Ceil = 'Ceiling',
	Trunc = 'Truncate',
	Frac = 'Fraction',
	Mod = 'Modulo',
	Snap = 'Snap',
	Clamp = 'Clamp',
}
export enum MathOpTrig {
	Sin = 'Sine',
	Cos = 'Cosine',
	Tan = 'Tangent',
	Asin = 'Arcsine',
	Acos = 'Arccosine',
	Atan = 'Arctangent',
	Atan2 = 'Arctan2',

	Sinh = 'Hyperbolic Sine',
	Cosh = 'Hyperbolic Cosine',
	Tanh = 'Hyperbolic Tangent',
}
export enum MathOpConv {
	ToRad = 'To Radians',
	ToDeg = 'To Degrees',
}

export const MathOp = { ...MathOpFunc, ...MathOpCmp, ...MathOpRound, ...MathOpTrig, ...MathOpConv };
export type MathOp = typeof MathOp;

const binaryOps = [
	MathOp.Add, MathOp.Sub, MathOp.Mul, MathOp.Div, MathOp.Pow, MathOp.Log,
	MathOp.Max, MathOp.Min, MathOp.Lt, MathOp.Gt,
	MathOp.Mod, MathOp.Snap,
	MathOp.Atan2,
];

export interface MathInputs {
	op: MathOp,
	a: number | Float32Array,
	b: number | Float32Array,
}

export interface MathOutputs {
	out: number | Float32Array,
}

export const MathC = ({ id, x, y, inputs }: NodeComponentProps<MathInputs>) => {
	const options = {
		'Functions': Object.values(MathOpFunc),
		'Comparison': Object.values(MathOpCmp),
		'Rounding': Object.values(MathOpRound),
		'Trigonometric': Object.values(MathOpTrig),
		'Conversion': Object.values(MathOpConv),
	};
	const isBinary = binaryOps.includes(inputs.op.value);
	return (
		<NodeShell name="Math" id={id} x={x} y={y}>
			<OutputNumber name="out" label="Value" />
			<InputSelect name="op" label="Operation" value={inputs.op} options={options} />
			<InputNumber name="a" label={isBinary ? 'a' : 'x'} value={inputs.a} />
			{isBinary && <InputNumber name="b" label="b" value={inputs.b} />}
		</NodeShell>
	);
};

const mathFunc = ({ op, a, b }: MathInputs): MathOutputs => {
	const ta = typeof a === 'number';
	const tb = typeof b === 'number';
	const opNum = Object.values(MathOp).indexOf(op);
	if (!binaryOps.includes(op)) {
		return { out: ta ? mathS(opNum, a) : mathV(opNum, a) as Float32Array };
	}
	if (ta && tb) {
		return { out: mathSS(opNum, a, b) };
	} else if (ta && !tb) {
		return { out: mathSV(opNum, a, b) as Float32Array };
	} else if (!ta && tb) {
		return { out: mathVS(opNum, a, b) as Float32Array };
	} else {
		return { out: mathVV(opNum, a, b) as Float32Array };
	}
};

export const MathNode: NodeInfo<MathInputs, MathOutputs> = {
	component: MathC,
	func: mathFunc,
	inputs: { op: MathOp.Add, a: 0, b: 0 },
};