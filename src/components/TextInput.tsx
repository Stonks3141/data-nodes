import { useCallback } from 'preact/hooks';
import type { Signal } from '@preact/signals';
import './TextInput.css';

export interface TextInputProps {
	signal?: Signal<string>;
	[prop: string]: any;
}

const TextInput = ({ signal, ...props }: TextInputProps) => {
	const onInputSignal = useCallback((event: InputEvent) => {
		if (signal) signal.value = (event.target as HTMLInputElement).value;
	}, [signal]);

	return (
		<input
			type="text"
			{...props}
			class={(props.class || '') + ' __TextInput'}
			value={signal || props.value}
			onInput={signal ? onInputSignal : props.onInput}
		/>
	);
};

export default TextInput;