import Button, { ButtonProps } from './Button.tsx';
import './ArrowButton.css';

const ArrowButton = ({ children, ...props }: ButtonProps) => {
	return (
		<Button {...props} class={(props.class || '') + ' __ArrowButton'}>
			{children}
		</Button>
	);
};

export default ArrowButton;