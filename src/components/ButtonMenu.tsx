import type { ComponentChildren } from 'preact';
import { useEffect, useCallback, useRef, useId } from 'preact/hooks';
import { useSignal, batch } from '@preact/signals';
import Button from './Button.tsx';
import Menu from './Menu.tsx';
import './ButtonMenu.css';

export interface ButtonMenuProps {
	children: ComponentChildren;
	label: string;
}

const ButtonMenu = ({ children, label }: ButtonMenuProps) => {
	const id = useId();
	const ref = useRef(null);
	const x = useSignal(0);
	const y = useSignal(0);

	const updateRect = useCallback(() => batch(() => {
		const rect = ref.current?.getBoundingClientRect();
		if (!rect) return;
		x.value = rect.x;
		y.value = rect.y + rect.height + 1;
	}), []);
	useEffect(updateRect, [ref.current]);

	return (
		<div
			class="__ButtonMenu"
			ref={ref}
			onScroll={updateRect}
			style={`--anchor-x: ${x}px; --anchor-y: ${y}px;`}
		>
			<Button kind="ghost" popoverTarget={id}>{label}</Button>
			<Menu id={id} popover="auto">
				{children}
			</Menu>
		</div>
	);
};

export default ButtonMenu;
