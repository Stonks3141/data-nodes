import { render } from 'preact';
import { useEffect, useMemo } from 'preact/hooks';
import { Router } from 'preact-router';
import PocketBase from 'pocketbase';
import { Pb } from './pb.ts';
import { Home, SignUp, LogIn, ProjectsList } from './pages';
import { NodeEditor } from './NodeEditor.tsx';
import './index.css';

export const App = () => {
	const pb = useMemo(() => new PocketBase(`/`));
	return (
		<Pb.Provider value={pb}>
			<header>
				<a class="title action" href="/">DataNodes</a>
				<nav>
					< a class="action" href="/play">Try Now</a>
					<a class="action" href="/login">Log In</a>
					<a class="action" href="/signup">Sign Up</a>
				</nav>
			</header>
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