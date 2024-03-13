import { ComponentChildren } from 'preact';
import './Form.css';

export interface FormProps {
	children: ComponentChildren;
	onSubmit?: (event: SubmitEvent) => void;
}

const Form = ({ onSubmit, children }: FormProps) => {
	return (
		<form class="__Form" onSubmit={onSubmit}>
			{children}
		</form>
	);
};

export default Form;