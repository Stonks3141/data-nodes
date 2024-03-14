export interface Project {
	id: string;
	owner: string;
	name: string;
}

export interface Node {
	id: string;
	x: number;
	y: number;
	name: string;
}

export interface Link {
	id: string;
	from: string;
	to: string;
}
