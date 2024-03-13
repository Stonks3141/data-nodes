import { render } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { Router } from 'preact-router';
import PocketBase from 'pocketbase';
import { Pb } from './context.ts';
import { Home, SignUp, LogIn, ProjectsList } from './pages';
import NodeEditor from './NodeEditor.tsx';
import { Header, Button } from './components';
import './index.css';

export const App = () => {
	const pb = useMemo(() => new PocketBase(`/`));
	return (
		<Pb.Provider value={pb}>
			<Header>
				<Button kind="ghost" href="/play">Try Now</Button>
				<Button kind="ghost" href="/login">Log In</Button>
				<Button kind="ghost" href="/signup">Sign Up</Button>
			</Header>
			<Router>
				<Home path="/" />
				<SignUp path="/signup" />
				<LogIn path="/login" />
				<ProjectsList path="/:user" />
				<NodeEditor path="/:user/:project" />
			</Router>
		</Pb.Provider>
	);
};

render(<App />, document.body);