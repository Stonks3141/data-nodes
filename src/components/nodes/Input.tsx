import { InputSocket } from '../../dataflow.ts';
import { InSocket } from './Socket.tsx';
import './Input.css';

interface InProps {
	children: ComponentChildren;
	linked?: boolean;
	class: string;
}

const Input = ({ children, linked = false, ...props }: InProps) => (
	<li class={'__Input ' + props.class + (linked ? 'linked' : '')}>{children}</li>
);

export interface InputProps<T> {
	name: string;
	label: string;
	value: InputSocket<T>;
}

export const InputAny = ({ name, label }: Omit<InputProps<any>, 'value'>) => {
	return (
		<Input class="__InputAny">
			<InSocket name={name} />
			{label}
		</Input>
	);
};

export const InputArray = ({ name, label }: Omit<InputProps<any>, 'value'>) => {
	return (
		<Input class="__InputArray">
			<InSocket name={name} />
			{label}
		</Input>
	);
};

const InputNum = (parseFunc: (string) => number) => ({ name, label, value }: InputProps<number>) => {
	const onInput = (event: InputEvent) => {
		value.value = parseFunc((event.target as HTMLInputElement).value);
	}
	return (
		<Input class={'__InputNum' + (value.link.value ? ' linked' : '')}>
			<InSocket name={name} />
			<span>{label}</span>
			<input type="number" value={value.manual.value} onInput={onInput} />
		</Input>
	);
};

export const InputInteger = InputNum(parseInt);
export const InputNumber = InputNum(parseFloat);

export const InputVector = ({ name, label, value }: InputProps<[number, number, number]>) => {
	const onInput = (i: 0 | 1 | 2) => (event: InputEvent) => {
		const newValue: [number, number, number] = [...value.value];
		newValue[i] = parseFloat((event.target as HTMLInputElement).value);
		value.value = newValue;
	};
	return (
		<Input class={'__InputVector' + (value.link.value ? ' linked' : '')}>
			<div>
				<InSocket name={name} />
				{label}
			</div>
			<input type="number" value={value.value[0]} onInput={onInput(0)} />
			<input type="number" value={value.value[1]} onInput={onInput(1)} />
			<input type="number" value={value.value[2]} onInput={onInput(2)} />
		</Input>
	);
};

export interface InputSelectProps extends InputProps<string> {
	options: string[] | Record<string, string[]>;
}

export const InputSelect = ({ name, label, value, options }: InputSelectProps) => {
	const onChange = (event: InputEvent) => {
		value.value = (event.target as HTMLSelectElement).value;
	}
	return (
		<Input class={'__InputSelect' + (value.link.value ? ' linked' : '')}>
			<InSocket name={name} />
			<select aria-label={label} onChange={onChange}>
				{Array.isArray(options)
					? options.map(opt => <option value={opt}>{opt}</option>)
					: Object.entries(options).map(([label, group]) => (
						<optgroup label={label}>
							{group.map(opt => <option value={opt}>{opt}</option>)}
						</optgroup>
					))
				}
			</select>
		</Input>
	);
};
