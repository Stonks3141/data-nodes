import { OutSocket } from './Socket.tsx';
import './Output.css';

export interface OutputProps {
	name: string;
	label: string;
}

const Output = (type: string, cls: string) => ({ name, label }: OutputProps) => {
	return (
		<li class={cls + ' __Output out ' + type}>
			{label}
			<OutSocket name={name} />
		</li>
	);
};

export const OutputNumber = Output('number', '__OutputNumber');
export const OutputVector = Output('vector', '__OutputVector');
