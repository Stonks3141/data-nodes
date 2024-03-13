import { useCallback } from 'preact/hooks';
import type { Signal } from '@preact/signals';
import './TextInput.css';

export interface TextInputProps {
	signal?: Signal<string>;
	props: Record<string, any>;
}

const TextInput = ({ signal, ...props }: TextInputProps) => {
	const onInputSignal = useCallback((event: InputEvent) => {
		signal.value = event.target.value;
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