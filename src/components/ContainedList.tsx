import type { ComponentChildren } from 'preact';
import './ContainedList.css';

export interface ContainedListProps {
	children: ComponentChildren;
}

const ContainedList = ({ children }: ContainedListProps) => {
	return (
		<ul class="__ContainedList">
			{children}
		</ul>
	);
};

export default ContainedList;