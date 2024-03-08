import { instantiate } from '../build/out.js';
import url from '../build/out.wasm';
export const {
	memory,
	mathS, mathV, mathSS, mathSV, mathVS, mathVV,
	linspace,
	intersperse,
	unzip,
	fft,
} = await instantiate(await WebAssembly.compileStreaming(fetch(url)), {});