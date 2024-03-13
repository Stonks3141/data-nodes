import { ComponentChildren } from 'preact';
import Button from './Button.tsx';
import './Header.css';

export interface HeaderProps {
	children: ComponentChildren;
}

const Header = ({ children }: HeaderProps) => {
	return (
		<header class="__Header">
			<div class="title">
				<Button kind="ghost" href="/">DataNodes</Button>
			</div>
			<nav>
				{children}
			</nav>
		</header>
	);
};

export default Header;