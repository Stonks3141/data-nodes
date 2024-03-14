import { useContext, useCallback } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { route } from 'preact-router';
import { Pb } from '../context.ts';
import { Header, Content, Form, TextInput, Button, ArrowButton, FormLabel } from '../components';

const LogIn = () => {
	const pb = useContext(Pb);

	const email = useSignal('');
	const password = useSignal('');

	const onSubmit = useCallback(async (event: SubmitEvent) => {
		event.preventDefault();
		await pb.collection('users').authWithPassword(email.value, password.value);
		if (pb.authStore.isValid) {
			route('/' + pb.authStore.model.username);
		}
	}, []);

	return (
		<>
			<Header title="DataNodes">
				<Button kind="ghost" href="/play">Try Now</Button>
				<Button kind="ghost" href="/signup">Sign Up</Button>
			</Header>
			<Content>
				<Form onSubmit={onSubmit}>
					<h1>Log In</h1>
					<p>
						Don't have an account? <a href="/signup">Sign up</a>
					</p>
					<hr />
					<FormLabel>
						Email
						<TextInput placeholder="Email" signal={email} />
					</FormLabel>
					<FormLabel>
						Password
						<TextInput type="password" placeholder="Password" signal={password} />
					</FormLabel>
					<ArrowButton>Continue</ArrowButton>
				</Form>
			</Content>
		</>
	);
};

export default LogIn;