import { useEffect, useMemo, useContext } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { Pb } from '../context.ts';
import type { Project } from '../types.ts';
import { NodeEditor } from '../components';

export interface EditorProps {
	user: string;
	project: string;
}

const Editor = ({ user, project }: EditorProps) => {
	const pb = useContext(Pb)!;
	const projectData = useSignal<Project | null>(null);

	useEffect(() => {
		(async () => {
			projectData.value = await pb.collection('projects')
				.getFirstListItem(pb.filter('owner.username = {:user} && name = {:project}', { user, project }));
		})();
	}, []);

	return (
		<>
			{!!projectData.value && <NodeEditor project={projectData.value} />}
		</>
	);
};

export default Editor;
