import { ComponentChildren } from 'preact';
import Button from './Button.tsx';
import './Header.css';

export interface HeaderProps {
	children: ComponentChildren;
	class?: string;
	title?: string;
}

const Header = ({ children, title, ...props }: HeaderProps) => {
	return (
		<header class={(props.class || '') + ' __Header'}>
			{!!title && <Button kind="ghost" class="title" href="/">{title}</Button>}
			<nav>
				{children}
			</nav>
		</header>
	);
};

export default Header;