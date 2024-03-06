import { instantiate } from '../build/out.js';
import url from '../build/out.wasm';
export const {
	memory,
	linspace,
	intersperse,
	dft,
	fft,
} = await instantiate(await WebAssembly.compileStreaming(fetch(url)));