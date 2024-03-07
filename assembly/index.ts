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