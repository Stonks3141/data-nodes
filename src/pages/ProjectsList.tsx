import { useContext, useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { route } from 'preact-router';
import { Pb } from '../context.ts';
import { logOut } from '../util.ts';
import { Header, Content, ContainedList, Form, FormLabel, TextInput, Button } from '../components';

const ProjectsList = ({ user }) => {
	console.log(user);
	const pb = useContext(Pb);
	const projects = useSignal(null);
	const projectName = useSignal('');

	useEffect(() => {
		pb.collection('projects')
			.getList(1, 20, { sort: '-mtime' })
			.then(p => projects.value = p);
	}, []);

	const onCreateProject = async (event: FormEvent) => {
		event.preventDefault();
		const project = await pb.collection('projects').create({
			name: projectName.value,
			owner: pb.authStore.model.id,
		});
		route(`/${user}/${project.name}`);
	};

	return (
		<>
			<Header>
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