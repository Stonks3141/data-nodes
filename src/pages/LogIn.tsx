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
		<form onSubmit={onSubmit}>
			<label>
				Email:
				<input type="text" value={email} onInput={e => email.value = e.target.value} />
			</label>
			<label>
				Password:
				<input type="password" value={password} onInput={e => password.value = e.target.value} />
			</label>
			<button>Log In</button>
		</form>
	);
};