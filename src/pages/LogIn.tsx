import { useContext } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { route } from 'preact-router';
import { Pb } from '../pb.ts';

export const LogIn = () => {
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
		<main>
		<form onSubmit={onSubmit}>
			<h1>Log In</h1>
			<p>
				Don't have an account? <a href="/signup">Sign up</a>
			</p>
			<hr />
			<label>
				Email
				<input type="text" placeholder="Email" value={email} onInput={e => email.value = e.target.value} />
			</label>
			<label>
				Password
				<input type="password" placeholder="Password" value={password} onInput={e => password.value = e.target.value} />
			</label>
			<input type="submit" value="Continue" />
		</form>
		</main>
	);
};