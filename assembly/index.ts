
export function linspace(start: f64, stop: f64, n: i32): Float64Array {
	const out = new Float64Array(n);
	for (let i = 0; i < n; i++) {
		out[i] = start + (stop - start) * <f64>i / <f64>(n-1);
	}
	return out;
}

export function intersperse(a: Float64Array, b: Float64Array): Float64Array {
	const len = a.length < b.length ? a.length : b.length;
	const out = new Float64Array(len * 2);
	for (let i = 0; i < out.length / 2; i++) {
		out[i*2] = a[i];
		out[i*2+1] = b[i];
	}
	return out;
}

export function dft(x: Float64Array): Float64Array {
	const out = new Float64Array(x.length);
	for (let k = 0; k < out.length - out.length % 2; k += 2) {
		for (let n = 0; n < x.length - x.length % 2; n += 2) {
			const y = -2.0 * Math.PI * <f64>k / <f64>x.length * <f64>n;
			const u = Math.cos(y);
			const v = Math.sin(y);
			out[k] = x[n] * u - x[n+1] * v;
			out[k+1] = x[n] * v + x[n+1] * u;
		}
	}
	return out;
}

export function fft(x: Float64Array): Float64Array {
	//const out = new Float64Array(x.length);
	return dft(x);
}

export function add(a: i32, b: i32): i32 {
  return a + b;
}
