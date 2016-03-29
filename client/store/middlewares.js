import { STORAGE_KEY } from './index'

const localStorageMiddleware = {
	onMutation(mutation, state) {

		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	}
};

export default [localStorageMiddleware];