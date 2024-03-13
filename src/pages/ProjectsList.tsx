import { useContext, useEffect } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { route } from 'preact-router';
import { Pb } from '../pb.ts';

export const ProjectsList = ({ user }) => {
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

	if (projects.value === null) {
		return (
			<p>Loading...</p>
		);
	}
	return (
		<main class="container">
			<h1>{user}'s Projects</h1>
			<form onSubmit={onCreateProject}>
				<fieldset class="group">
					<label>
						Name
						<input type="text" placeholder="Project name" value={projectName} onInput={e => projectName.value = e.target.value} />
					</label>
					<input type="submit" value="Create project" />
				</fieldset>
			</form>
			<ul class="contained">
				{projects.value.items.map(p => (
					<li><a class="action" href={`/${user}/${p.name}`}>{p.name}</a></li>
				))}
			</ul>
		</main>
	);
};