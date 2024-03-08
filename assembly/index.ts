@inline
function vf32(x: f32): v128 {
	return f32x4(x,x,x,x);
}

const zero = f32x4(0,0,0,0);
const one = f32x4(1,1,1,1);
const pi = f32x4(Mathf.PI, Mathf.PI, Mathf.PI, Mathf.PI);
const deg_to_rad = v128.div<f32>(pi, f32x4(180,180,180,180));
const rad_to_deg = v128.div<f32>(f32x4(180,180,180,180), pi);

@inline
function vsin(x: v128): v128 {
	return f32x4(
		Mathf.sin(v128.extract_lane<f32>(x, 0)),
		Mathf.sin(v128.extract_lane<f32>(x, 1)),
		Mathf.sin(v128.extract_lane<f32>(x, 2)),
		Mathf.sin(v128.extract_lane<f32>(x, 3)),
	);
}

@inline
function vcos(x: v128): v128 {
	return f32x4(
		Mathf.cos(v128.extract_lane<f32>(x, 0)),
		Mathf.cos(v128.extract_lane<f32>(x, 1)),
		Mathf.cos(v128.extract_lane<f32>(x, 2)),
		Mathf.cos(v128.extract_lane<f32>(x, 3)),
	);
}

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

		case MathOp.Round: return Mathf.round(x);
		case MathOp.Floor: return Mathf.floor(x);
		case MathOp.Ceil: return Mathf.ceil(x);
		case MathOp.Trunc: return Mathf.trunc(x);
		case MathOp.Frac: return x - Mathf.trunc(x);
		case MathOp.Clamp: return Mathf.max(0, Mathf.min(x, 1));

		case MathOp.Sin: return Mathf.sin(x);
		case MathOp.Cos: return Mathf.cos(x);
		case MathOp.Tan: return Mathf.tan(x);
		case MathOp.Asin: return Mathf.asin(x);
		case MathOp.Acos: return Mathf.acos(x);
		case MathOp.Atan: return Mathf.atan(x);
		case MathOp.Sinh: return Mathf.sinh(x);
		case MathOp.Cosh: return Mathf.cosh(x);
		case MathOp.Tanh: return Mathf.tanh(x);

		case MathOp.ToRad: return x / 180 * Mathf.PI;
		case MathOp.ToDeg: return x * 180 / Mathf.PI;
		default: return 0;
	}
}

function unaryMathV(op: MathOp, x: v128): v128 {
	switch (op) {
		case MathOp.Sqrt: return v128.sqrt<f32>(x);

		case MathOp.Sign: return v128.sub<f32>(v128.gt<f32>(x, vf32(0)), v128.lt<f32>(x, vf32(0)));

		case MathOp.Round: return v128.nearest<f32>(x);
		case MathOp.Floor: return v128.floor<f32>(x);
		case MathOp.Ceil: return v128.ceil<f32>(x);
		case MathOp.Trunc: return v128.trunc<f32>(x);
		case MathOp.Frac: return v128.sub<f32>(x, v128.trunc<f32>(x));
		case MathOp.Clamp: return v128.max<f32>(zero, v128.min<f32>(x, vf32(1)));

		case MathOp.ToRad: return v128.mul<f32>(x, vf32(Mathf.PI / 180));
		case MathOp.ToDeg: return v128.mul<f32>(x, vf32(180 / Mathf.PI));

		// fallthrough
		case MathOp.Exp:
		case MathOp.Sin:
		case MathOp.Cos:
		case MathOp.Tan:
		case MathOp.Asin:
		case MathOp.Acos:
		case MathOp.Atan:
		case MathOp.Sinh:
		case MathOp.Cosh:
		case MathOp.Tanh:
			return f32x4(
				unaryMathS(op, v128.extract_lane<f32>(x, 0)),
				unaryMathS(op, v128.extract_lane<f32>(x, 1)),
				unaryMathS(op, v128.extract_lane<f32>(x, 2)),
				unaryMathS(op, v128.extract_lane<f32>(x, 3)),
			);
		default: return vf32(0);
	}
}

function binaryMathS(op: MathOp, a: f32, b: f32): f32 {
	switch (op) {
		case MathOp.Add: return a + b;
		case MathOp.Sub: return a - b;
		case MathOp.Mul: return a * b;
		case MathOp.Div: return a / b;
		case MathOp.Pow: return Mathf.pow(a, b);
		case MathOp.Log: return Mathf.log(b) / Mathf.log(a);

		case MathOp.Max: return Mathf.max(a, b);
		case MathOp.Min: return Mathf.min(a, b);
		case MathOp.Lt: return a < b ? 1 : 0;
		case MathOp.Gt: return a > b ? 1 : 0;

		case MathOp.Mod: return a % b;
		case MathOp.Snap: return Mathf.round(a / b) * b;

		case MathOp.Atan2: return Mathf.atan2(a, b);
		default: return 0;
	}
};

function binaryMathV(op: MathOp, a: v128, b: v128): v128 {
	switch (op) {
		case MathOp.Add: return v128.add<f32>(a, b);
		case MathOp.Sub: return v128.sub<f32>(a, b);
		case MathOp.Mul: return v128.mul<f32>(a, b);
		case MathOp.Div: return v128.div<f32>(a, b);

		case MathOp.Max: return v128.max<f32>(a, b);
		case MathOp.Min: return v128.min<f32>(a, b);
		case MathOp.Lt: return v128.lt<f32>(a, b);
		case MathOp.Gt: return v128.gt<f32>(a, b);

		case MathOp.Mod: return v128.sub<f32>(a, v128.mul<f32>(b, v128.trunc<f32>(v128.div<f32>(a, b))));
		case MathOp.Snap: return v128.mul<f32>(v128.nearest<f32>(v128.div<f32>(a, b)), b);

		// fallthrough
		case MathOp.Pow:
		case MathOp.Log:
		case MathOp.Atan2:
			return f32x4(
				binaryMathS(op, v128.extract_lane<f32>(a, 0), v128.extract_lane<f32>(b, 0)),
				binaryMathS(op, v128.extract_lane<f32>(a, 1), v128.extract_lane<f32>(b, 1)),
				binaryMathS(op, v128.extract_lane<f32>(a, 2), v128.extract_lane<f32>(b, 2)),
				binaryMathS(op, v128.extract_lane<f32>(a, 3), v128.extract_lane<f32>(b, 3)),
			);
		default: return vf32(0);
	}
};

export { unaryMathS as mathS };

export function mathV(op: MathOp, x: StaticArray<f32>): StaticArray<f32> {
	const len = x.length;
	const out = new StaticArray<f32>(len);
	const outptr = changetype<usize>(out);
	const xptr = changetype<usize>(x);
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
	const outptr = changetype<usize>(out);
	const aptr = changetype<usize>(a);
	const vb = vf32(b);
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
	const outptr = changetype<usize>(out);
	const bptr = changetype<usize>(b);
	const va = vf32(a);
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
	const outptr = changetype<usize>(out);
	const aptr = changetype<usize>(a);
	const bptr = changetype<usize>(b);
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
	const ptr = changetype<usize>(out);

	const fac = (stop - start) / f32(n-1);
	let value = f32x4(start, start + fac, start + fac*2, start + fac*3);
	const vinc = vf32(fac*4);
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
	const aptr = changetype<usize>(a);
	const bptr = changetype<usize>(b);
	let len = a.length < b.length ? a.length : b.length;
	const out = new StaticArray<f32>(len * 2);
	const outptr = changetype<usize>(out);

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

export function unzip(x: StaticArray<f32>): StaticArray<f32> {
	const out = new StaticArray<f32>(x.length);
	for (let i = 0; i < x.length/2; i++) {
		out[i] = x[i*2];
		out[i + x.length/2] = x[i*2+1];
	}
	return out;
}

function ditfft2(x: StaticArray<f32>, n: i32, s: i32, out: StaticArray<f32>): void {
	if (n == 1) {
		out[0] = x[0];
		out[1] = x[1];
		return;
	} else if (n == 2) {
		for (let k = 0; k < out.length - out.length % 2; k += 2) {
			for (let n = 0; n < x.length - x.length % 2; n += 2) {
				const y = -<f32>2 * Mathf.PI * <f32>k / <f32>x.length * <f32>n;
				const u = Mathf.cos(y);
				const v = Mathf.sin(y);
				out[k] += x[n] * u - x[n+1] * v;
				out[k+1] += x[n] * v + x[n+1] * u;
			}
		}
		return;
	}
	ditfft2(x.slice<StaticArray<f32>>(0, n), n/2, 2*s, out.slice<StaticArray<f32>>(0, n));
	ditfft2(x.slice<StaticArray<f32>>(s * 2), n/2, 2*s, out.slice<StaticArray<f32>>(n));
	const outptr = changetype<usize>(out);
	const twiddle = vf32(-<f32>2 * Mathf.PI / <f32>n);
	let vk = f32x4(0,1,2,3);
	for (let k = 0; k < n/2 - n/2 % 2; k += 4) {
		const p = v128.load(outptr + k*2 * 4);
		const y = v128.mul<f32>(twiddle, vk);
		const tw = vsin(v128.neg<f32>(v128.sub<f32>(y, f32x4(Mathf.PI/2, 0, Mathf.PI/2, 0))));
		const q = v128.mul<f32>(tw, v128.load(outptr + (k*2 + k*2) * 4));
		v128.store(outptr + k*2 * 4, v128.add<f32>(p, q));
		v128.store(outptr + (k*2 + n/2) * 4, v128.sub<f32>(p, q));
		vk = v128.add<f32>(vk, vf32(1));
	}
	for (let k = n/2 - n/2 % 2; k < n/2; k++) {
		const pr = unchecked(out[k*2]);
		const pi = unchecked(out[k*2+1]);
		const y = -<f32>2 * Mathf.PI * <f32>k / <f32>n;
		const qr = Mathf.cos(y) * out[k*2+n/2]
		const qi = Mathf.sin(y) * out[k*2+n/2+1];
		unchecked(out[k*2] = pr + qr);
		unchecked(out[k*2+1] = pi + qi);
		unchecked(out[k*2+n/2] = pr - qr);
		unchecked(out[k*2+n/2+1] = pi - qi);
	}
}

export function fft(x: StaticArray<f32>): StaticArray<f32> {
	const out = new StaticArray<f32>(x.length);
	ditfft2(x, x.length/2, 1, out);
	return out;
}