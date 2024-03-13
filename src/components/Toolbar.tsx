import type { ComponentChildren } from 'preact';
import Header from './Header.tsx';
import Button from './Button.tsx';
import './Toolbar.css';

export interface ToolbarProps {
	children: ComponentChildren;
	title: string;
}

const Toolbar = ({ children, title }: ToolbarProps) => {
	return (
		<Header class="__Toolbar">
			<menu class="actions">
				{children}
			</menu>
			<Button kind="ghost" class="title">{title}</Button>
			<div></div>
		</Header>
	);
};

export default Toolbar;