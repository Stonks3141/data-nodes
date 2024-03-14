import { useContext, useEffect, useCallback } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { route } from 'preact-router';
import type { ListResult } from 'pocketbase';
import type { Project } from '../types.ts';
import { Pb } from '../context.ts';
import { logOut } from '../util.ts';
import { Header, Content, ContainedList, Form, FormLabel, TextInput, Button } from '../components';

export interface ProjectsListProps {
	user: string;
}

const ProjectsList = ({ user }: ProjectsListProps) => {
	const pb = useContext(Pb)!;
	const projects = useSignal<ListResult<Project> | null>(null);
	const projectName = useSignal('');

	useEffect(async () => {
		projects.value = await pb.collection('projects').getList(1, 20, { sort: '-mtime' });
	}, []);

	const onCreateProject = useCallback(async (event: SubmitEvent) => {
		event.preventDefault();
		const project = await pb.collection('projects').create({
			name: projectName.value,
			owner: pb.authStore.model!.id,
		});
		route(`/${user}/${project.name}`);
	}, [user]);

	return (
		<>
			<Header title="DataNodes">
				<Button kind="ghost" href="/account">My Account</Button>
				<Button kind="ghost" onClick={() => logOut(pb)}>Log Out</Button>
			</Header>
			<Content>
				<h1>{user}'s Projects</h1>
				<Form onSubmit={onCreateProject}>
					<FormLabel>
						Name
						<TextInput placeholder="Project name" signal={projectName} />
					</FormLabel>
					<Button>Create project</Button>
				</Form>
				{projects.value === null
					? <p>Loading...</p>
					: <ContainedList>
							{projects.value.items.map(p => (
								<li><Button kind="ghost" href={`/${user}/${p.name}`}>{p.name}</Button></li>
							))}
						</ContainedList>
				}
			</Content>
		</>
	);
};

export default ProjectsList;