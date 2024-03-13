import { useContext } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { route } from 'preact-router';
import { Pb } from '../context.ts';
import { TextInput, ArrowButton, Form, FormLabel, Content } from '../components';

const SignUp = () => {
	const pb = useContext(Pb);

	const username = useSignal('');
	const email = useSignal('');
	const password = useSignal('');
	const confirm = useSignal('');

	const onSubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		const user = await pb.collection('users').create({
			username: username.value,
			email: email.value,
			emailVisibility: true,
			password: password.value,
			passwordConfirm: confirm.value,
		});
		if (pb.authStore.isValid) {
			route('/' + user.username);
		}
	};

	return (
		<Content>
			<Form onSubmit={onSubmit}>
				<h1>Sign Up</h1>
				<p>
					Already have an account? <a href="/login">Log in</a>
				</p>
				<hr />
				<FormLabel>
					Username
					<TextInput placeholder="Username" signal={username} />
				</FormLabel>
				<FormLabel>
					Email
					<TextInput placeholder="Email" signal={email} />
				</FormLabel>
				<FormLabel>
					Password
					<TextInput type="password" placeholder="Password" signal={password} />
				</FormLabel>
				<FormLabel>
					Confirm password
					<TextInput type="password" placeholder="Confirm password" signal={confirm} />
				</FormLabel>
				<ArrowButton>Continue</ArrowButton>
			</Form>
		</Content>
	);
};

export default SignUp;