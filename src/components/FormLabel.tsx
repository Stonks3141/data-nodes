import { ComponentChildren } from 'preact';
import './FormLabel.css';

export interface FormLabelProps {
	children: ComponentChildren;
}

const FormLabel = ({ children }: FormLabelProps) => {
	return (
		<label class="__FormLabel">
			{children}
		</label>
	);
};

export default FormLabel;