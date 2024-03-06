import { NodeShell, InputNumber, InputSelect, OutputNumber, NodeComponentProps, NodeInfo } from '../node.tsx';

export enum MathOpFunc {
	Add = 'Add',
	Sub = 'Subtract',
	Mul = 'Multiply',
	Div = 'Divide',
	Power = 'Power',
	Log = 'Logarithm',
	Sqrt = 'Square Root',
	Exp = 'Exponent',
}
export enum MathOpCmp {
	Min = 'Minimum',
	Max = 'Maximum',
	Less = 'Less Than',
	Greater = 'Greater Than',
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

export interface MathInputs {
	op: MathOp,
	a: number | TypedArray,
	b: number | TypedArray,
}

export interface MathOutputs {
	out: boolean | number | TypedArray,
}

export const MathC = ({ id, x, y, inputs }: NodeComponentProps<MathInputs>) => {
	const options = {
		'Functions': Object.values(MathOpFunc),
		'Comparison': Object.values(MathOpCmp),
		'Rounding': Object.values(MathOpRound),
		'Trigonometric': Object.values(MathOpTrig),
		'Conversion': Object.values(MathOpConv),
	};
	return (
		<NodeShell name="Math" id={id} x={x} y={y}>
			<OutputNumber name="out" label="Value" />
			<InputSelect name="op" label="Operation" value={inputs.op} options={options} />
			<InputNumber name="a" label="a" value={inputs.a} />
			<InputNumber name="b" label="b" value={inputs.b}/>
		</NodeShell>
	);
};

const doMathOp = (op: MathOp, a: number, b: number): number => {
	switch (op) {
		case MathOp.Add: return a + b;
		case MathOp.Sub: return a - b;
		case MathOp.Mul: return a * b;
		case MathOp.Div: return a / b;
		case MathOp.Power: return a ** b;
		case MathOp.Log: return Math.log(a) / Math.log(b);
		case MathOp.Sqrt: return Math.sqrt(a);
		case MathOp.Exp: return Math.exp(a);

		case MathOp.Min: return Math.min(a, b);
		case MathOp.Max: return Math.max(a, b);
		case MathOp.Less: return a < b;
		case MathOp.Greater: return a > b;
		case MathOp.Sign: return Math.sign(a);

		case MathOp.Round: return Math.round(a);
		case MathOp.Floor: return Math.floor(a);
		case MathOp.Ceil: return Math.ceil(a);
		case MathOp.Trunc: return Math.trunc(a);
		case MathOp.Frac: return a - Math.trunc(a);
		case MathOp.Mod: return a % b;
		case MathOp.Snap: return Math.round(a * b) / b;
		case MathOp.Clamp: return Math.max(0, Math.min(a, 1));

		case MathOp.Sin: return Math.sin(a);
		case MathOp.Cos: return Math.cos(a);
		case MathOp.Tan: return Math.tan(a);
		case MathOp.Asin: return Math.asin(a);
		case MathOp.Acos: return Math.acos(a);
		case MathOp.Atan: return Math.atan(a);
		case MathOp.Atan2: return Math.atan2(a, b);

		case MathOp.Sinh: return Math.sinh(a);
		case MathOp.Cosh: return Math.cosh(a);
		case MathOp.Tanh: return Math.tanh(a);

		case MathOp.ToRad: return a / 180 * Math.PI;
		case MathOp.ToDeg: return a * 180 / Math.PI;

		default: throw new TypeError();
	}
};

const mathFunc = ({ op, a, b }: MathInputs): MathOutputs => {
	const countScalar = (typeof a === 'number' ? 1 : 0) + (typeof b === 'number' ? 1 : 0);
	if (typeof a === 'number') {
		if (typeof b === 'number') {
			return { out: doMathOp(op, a, b) };
		} else {
			const out = new Float64Array(b.length);
			for (let i = 0; i < out.length; i++) {
				out[i] = doMathOp(op, a, b[i]);
			}
			return { out };
		}
	} else {
		if (typeof b === 'number') {
			const out = new Float64Array(a.length);
			for (let i = 0; i < out.length; i++) {
				out[i] = doMathOp(op, a[i], b);
			}
			return { out };
		} else {
			const out = new Float64Array(Math.min(a.length, b.length));
			for (let i = 0; i < out.length; i++) {
				out[i] = doMathOp(op, a[i], b[i]);
			}
			return { out };
		}
	}
};

export const MathNode: NodeInfo<MathInputs, MathOutputs> = {
	component: MathC,
	func: mathFunc,
	inputs: { op: MathOp.Add, a: 0, b: 0 },
};
