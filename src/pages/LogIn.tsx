import { useContext } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { route } from 'preact-router';
import { Pb } from '../context.ts';
import { TextInput, ArrowButton, FormLabel, Content, Form } from '../components';

const LogIn = () => {
	const pb = useContext(Pb);

	const email = useSignal('');
	const password = useSignal('');

	const onSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		const user = await pb.collection('users').authWithPassword(email.value, password.value);
		if (pb.authStore.isValid) {
			route('/' + user.username);
		}
	};

	return (
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
					<TextInput type="password" placeholder="Email" signal={email} />
				</FormLabel>
				<ArrowButton>Continue</ArrowButton>
			</Form>
		</Content>
	);
};

export default LogIn;