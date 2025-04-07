import { PUBLIC_jwLibraryDNS, PUBLIC_jwMaxResolution } from '$env/static/public';

// in the load function
export async function load() {
	const returnObject = {
		jwLibraryDNS: PUBLIC_jwLibraryDNS,
		jwMaxResolution: PUBLIC_jwMaxResolution,
		jwPlayerId: 'fN7jF0wP'
	};

	return returnObject;
}
