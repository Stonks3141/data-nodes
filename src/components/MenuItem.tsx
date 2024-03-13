import Button from './Button.tsx';
import './MenuItem.css';

export interface MenuItemProps {
	label: string;
	onClick?: (event: PointerEvent) => void;
}

const MenuItem = ({ label, onClick }: MenuItemProps) => {
	return (
		<li class="__MenuItem">
			<Button kind="ghost" onClick={onClick}>{label}</Button>
		</li>
	);
};

export default MenuItem;