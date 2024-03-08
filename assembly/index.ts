export enum MathOp {
	Add,
	Sub,
	Mul,
	Div,
	Pow,
	Log,
	Sqrt,
	Exp,

	Min,
	Max,
	Lt,
	Gt,
	Sign,

	Round,
	Floor,
	Ceil,
	Trunc,
	Frac,
	Mod,
	Snap,
	Clamp,

	Sin,
	Cos,
	Tan,
	Asin,
	Acos,
	Atan,
	Atan2,
	Sinh,
	Cosh,
	Tanh,

	ToRad,
	ToDeg,
}

function unaryMathS(op: MathOp, x: f32): f32 {
	switch (op) {
		case MathOp.Sqrt: return Mathf.sqrt(x);
		case MathOp.Exp: return Mathf.exp(x);
		case MathOp.Sign: return Mathf.sign(x);
		default: return 0;
	}
}

function unaryMathV(op: MathOp, x: v128): v128 {
	const zero = f32x4(0,0,0,0);
	switch (op) {
		case MathOp.Sqrt: return v128.sqrt<f32>(x);
		case MathOp.Exp: return f32x4(
			Mathf.exp(v128.extract_lane<f32>(x, 0)),
			Mathf.exp(v128.extract_lane<f32>(x, 1)),
			Mathf.exp(v128.extract_lane<f32>(x, 2)),
			Mathf.exp(v128.extract_lane<f32>(x, 3)),
		);
		case MathOp.Sign: return v128.sub<f32>(v128.gt<f32>(x, zero), v128.lt<f32>(x, zero));
		default: return zero;
	}
}

function binaryMathS(op: MathOp, a: f32, b: f32): f32 {
	switch (op) {
		case MathOp.Add: return a + b;
		case MathOp.Sub: return a - b;
		case MathOp.Mul: return a * b;
		case MathOp.Div: return a / b;
		default: return 0;
	}
};

function binaryMathV(op: MathOp, a: v128, b: v128): v128 {
	switch (op) {
		case MathOp.Add: return v128.add<f32>(a, b);
		case MathOp.Sub: return v128.sub<f32>(a, b);
		case MathOp.Mul: return v128.mul<f32>(a, b);
		case MathOp.Div: return v128.div<f32>(a, b);
		default: return f32x4(0,0,0,0);
	}
};

export { unaryMathS as mathS };

export function mathV(op: MathOp, x: StaticArray<f32>): StaticArray<f32> {
	const len = x.length;
	const out = new StaticArray<f32>(len);
	const outptr = changetype<i32>(out);
	const xptr = changetype<i32>(x);
	for (let i = 0; i < len - len % 4; i += 4) {
		v128.store(outptr + i*4, unaryMathV(op, v128.load(xptr + i*4)));
	}
	// fallthrough
	switch (len % 4) {
		case 3: out[len-3] = unaryMathS(op, x[len-3]);
		case 2: out[len-2] = unaryMathS(op, x[len-2]);
		case 1: out[len-1] = unaryMathS(op, x[len-1]);
	}
	return out;
}

export { binaryMathS as mathSS };

export function mathVS(op: MathOp, a: StaticArray<f32>, b: f32): StaticArray<f32> {
	const len = a.length;
	const out = new StaticArray<f32>(len);
	const outptr = changetype<i32>(out);
	const aptr = changetype<i32>(a);
	const vb = f32x4(b,b,b,b);
	for (let i = 0; i < len - len % 4; i += 4) {
		v128.store(outptr + i*4, binaryMathV(op, v128.load(aptr + i*4), vb));
	}
	// fallthrough
	switch (len % 4) {
		case 3: out[len-3] = binaryMathS(op, a[len-3], b);
		case 2: out[len-2] = binaryMathS(op, a[len-2], b);
		case 1: out[len-1] = binaryMathS(op, a[len-1], b);
	}
	return out;
}

export function mathSV(op: MathOp, a: f32, b: StaticArray<f32>): StaticArray<f32> {
	const len = b.length;
	const out = new StaticArray<f32>(len);
	const outptr = changetype<i32>(out);
	const bptr = changetype<i32>(b);
	const va = f32x4(a,a,a,a);
	for (let i = 0; i < len - len % 4; i += 4) {
		v128.store(outptr + i*4, binaryMathV(op, va, v128.load(bptr + i*4)));
	}
	// fallthrough
	switch (len % 4) {
		case 3: out[len-3] = binaryMathS(op, a, b[len-3]);
		case 2: out[len-2] = binaryMathS(op, a, b[len-2]);
		case 1: out[len-1] = binaryMathS(op, a, b[len-1]);
	}
	return out;
}

export function mathVV(op: MathOp, a: StaticArray<f32>, b: StaticArray<f32>): StaticArray<f32> {
	const len = a.length < b.length ? a.length : b.length;
	const out = new StaticArray<f32>(len);
	const outptr = changetype<i32>(out);
	const aptr = changetype<i32>(a);
	const bptr = changetype<i32>(b);
	for (let i = 0; i < len - len % 4; i += 4) {
		v128.store(outptr + i*4, binaryMathV(op, v128.load(aptr + i*4), v128.load(bptr + i*4)));
	}
	// fallthrough
	switch (len % 4) {
		case 3: out[len-3] = binaryMathS(op, a[len-3], b[len-3]);
		case 2: out[len-2] = binaryMathS(op, a[len-2], b[len-2]);
		case 1: out[len-1] = binaryMathS(op, a[len-1], b[len-1]);
	}
	return out;
}

export function linspace(start: f32, stop: f32, n: i32): StaticArray<f32> {
	const out = new StaticArray<f32>(n);
	const ptr = changetype<i32>(out);

	const fac = (stop - start) / f32(n-1);
	let value = f32x4(start, start + fac, start + fac*2, start + fac*3);
	const vinc = f32x4(fac*4, fac*4, fac*4, fac*4);
	for (let i = 0; i < n - n % 4; i += 4) {
		v128.store(ptr + i * 4, value);
		value = v128.add<f32>(value, vinc);
	}
	// fallthrough
	switch (n % 4) {
		case 3: out[n-3] = start + (stop - start) * f32(n-3) / f32(n-1);
		case 2: out[n-2] = start + (stop - start) * f32(n-2) / f32(n-1);
		case 1: out[n-1] = stop;
	}
	return out;
}

export function intersperse(a: StaticArray<f32>, b: StaticArray<f32>): StaticArray<f32> {
	const aptr = changetype<i32>(a);
	const bptr = changetype<i32>(b);
	let len = a.length < b.length ? a.length : b.length;
	const out = new StaticArray<f32>(len * 2);
	const outptr = changetype<i32>(out);

	for (let i = 0; i < len - len % 4; i += 4) {
		const va = v128.load(aptr + i * 4);
		const vb = v128.load(bptr + i * 4);
		v128.store(outptr + (i*2) * 4, v128.shuffle<f32>(va, vb, 0, 4, 1, 5));
		v128.store(outptr + (i*2+4) * 4, v128.shuffle<f32>(va, vb, 2, 6, 3, 7));
	}
	// fallthrough
	switch (len % 4) {
		case 3:
			out[out.length-6] = a[len-3];
			out[out.length-5] = b[len-3];
		case 2:
			out[out.length-4] = a[len-2];
			out[out.length-3] = b[len-2];
		case 1:
			out[out.length-2] = a[len-1];
			out[out.length-1] = b[len-1];
	}
	return out;
}

export function dft(x: StaticArray<f32>): StaticArray<f32> {
	const out = new StaticArray<f32>(x.length);
	for (let k = 0; k < out.length - out.length % 2; k += 2) {
		for (let n = 0; n < x.length - x.length % 2; n += 2) {
			const y = -<f32>2.0 * Mathf.PI * <f32>k / <f32>x.length * <f32>n;
			const u = Mathf.cos(y);
			const v = Mathf.sin(y);
			out[k] = x[n] * u - x[n+1] * v;
			out[k+1] = x[n] * v + x[n+1] * u;
		}
	}
	return out;
}

export function fft(x: StaticArray<f32>): StaticArray<f32> {
	return dft(x);
}