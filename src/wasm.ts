import { instantiate } from '../build/out.js';
import module from '../build/out.wasm';
export const {
	memory,
	mathS, mathV, mathSS, mathSV, mathVS, mathVV,
	linspace,
	intersperse,
	unzip,
	fft,
} = await instantiate(await WebAssembly.compileStreaming(fetch(module)), { env: {} });