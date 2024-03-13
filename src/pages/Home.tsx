import { Header, Content, Button } from '../components';

const Home = () => {
	return (
		<>
			<Header>
				<Button kind="ghost" href="/play">Try Now</Button>
				<Button kind="ghost" href="/login">Log In</Button>
				<Button kind="ghost" href="/signup">Sign Up</Button>
			</Header>
			<Content>
				<p><a href="/play">Try Now</a></p>
				<p><a href="/signup">Create Account</a></p>
			</Content>
		</>
	);
};

export default Home;