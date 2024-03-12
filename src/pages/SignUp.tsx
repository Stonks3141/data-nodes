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
		<main class="container">
			<article>
				<form onSubmit={onSubmit}>
					<label>
						Username:
						<input type="text" value={username} onInput={e => username.value = e.target.value} />
					</label>
					<label>
						Email:
						<input type="text" value={email} onInput={e => email.value = e.target.value} />
					</label>
					<label>
						Password:
						<input type="password" value={password} onInput={e => password.value = e.target.value} />
					</label>
					<label>
						Confirm Password:
						<input type="password" value={confirm} onInput={e => confirm.value = e.target.value} />
					</label>
					<button>Sign Up</button>
				</form>
			</article>
		</main>
	);
};