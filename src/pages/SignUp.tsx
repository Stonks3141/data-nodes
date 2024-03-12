import { useContext } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import { route } from 'preact-router';
import { Pb } from '../pb.ts';

export const SignUp = () => {
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
		<main>
				<form onSubmit={onSubmit}>
					<h1>Sign Up</h1>
					<p>
						Already have an account? <a href="/login">Log in</a>
					</p>
					<hr />
					<label>
						Username
						<input type="text" placeholder="Username" value={username} onInput={e => username.value = e.target.value} />
					</label>
					<label>
						Email
						<input type="text" placeholder="Email" value={email} onInput={e => email.value = e.target.value} />
					</label>
					<label>
						Password
						<input type="password" placeholder="Password" value={password} onInput={e => password.value = e.target.value} />
					</label>
					<label>
						Confirm password
						<input type="password" placeholder="Confirm password" value={confirm} onInput={e => confirm.value = e.target.value} />
					</label>
					<input type="submit" value="Continue" />
				</form>
		</main>
	);
};