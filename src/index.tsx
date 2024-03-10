import { render } from 'preact';
import { NodeEditor } from './NodeEditor.tsx';
import './index.css';

export const App = () => {
	return (
		<NodeEditor />
	);
};

render(<App />, document.body);
