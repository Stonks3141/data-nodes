import { ComponentChildren } from 'preact';
import './Content.css';

export interface ContentProps {
	children: ComponentChildren;
}

const Content = ({ children }: ContentProps) => {
	return (
		<main class="__Content">
			{children}
		</main>
	);
};

export default Content;