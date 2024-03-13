import { route } from 'preact-router';
import PocketBase from 'pocketbase';

export const logOut = (pb: PocketBase) => {
	pb.authStore.clear();
	route('/login');
};