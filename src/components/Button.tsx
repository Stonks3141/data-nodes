import type { ComponentChildren } from 'preact';
import './Button.css';

export interface ButtonProps {
	children: ComponentChildren;
	kind?: 'primary' | 'outline' | 'ghost';
	[prop: string]: any;
}

const Button = ({ children, kind = 'primary', ...props }: ButtonProps) => {
	const Elem = props.href ? 'a' : 'button';
	return (
		<Elem {...props} class={(props.class || '') + ' __Button ' + kind}>
			{children}
		</Elem>
	);
};

export default Button;