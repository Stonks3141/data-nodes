import Button, { ButtonProps } from './Button.tsx';
import './ArrowButton.css';

export type ArrowButtonProps = ButtonProps;

const ArrowButton = ({ children, ...props }: ArrowButtonProps) => {
	return (
		<Button {...props} class={(props.class || '') + ' __ArrowButton'}>
			{children}
		</Button>
	);
};

export default ArrowButton;