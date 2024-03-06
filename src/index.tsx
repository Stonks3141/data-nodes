import { render } from 'preact';
import { useErrorBoundary } from 'preact/hooks';
import { NodeEditor } from './NodeEditor.tsx';
import './index.css';

export const App = () => {
	const [error] = useErrorBoundary(error => alert(error));
	return (
		<NodeEditor />
	);
};

render(<App />, document.body);
