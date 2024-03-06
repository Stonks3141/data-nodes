import { signal, Signal } from '@preact/signals';

export class InputSocket<T> {
	link: Signal<null | Signal<T>>;
	manual: Signal<T>;

	constructor(initialValue: T) {
		this.link = signal(null);
		this.manual = signal(initialValue);
	}

	get value() {
		return this.link.value ? this.link.value.value : this.manual.value;
	}

	set value(x: T) {
		this.manual.value = x;
	}
}