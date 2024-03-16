export type Id = string;

export type Relation<T> = Id | T;

export interface User {
	id: Id;
	username: string;
	email: string;
}

export interface Project {
	id: Id;
	owner: Relation<User>;
	name: string;
	public: boolean;
}

export interface Node {
	id: Id;
	project: Relation<Project>;
	type: string;
	x: number;
	y: number;
	collapsed: boolean;
}

export interface Link {
	id: Id;
	project: Relation<Project>;
	from: Relation<Node>;
	fromSocket: string;
	to: Relation<Node>;
	toSocket: string;
}
