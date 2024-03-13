import type { ComponentChildren } from 'preact';
import './Menu.css';

export interface MenuProps {
	children: ComponentChildren;
	id?: string;
	popover?: string;
}

const Menu = ({ id, popover, children }: MenuProps) => {
	return (
		<>
			<menu id={id} class="__Menu" popover={popover}>
				{children}
			</menu>
		</>
	);
};

export default Menu;
