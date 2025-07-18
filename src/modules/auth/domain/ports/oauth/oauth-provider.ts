export interface IDPToken {
	accessToken: string;
	idToken: string;
}

export interface UserProfile {
	id: string;
	email: string;
	name: string;
	picture?: string;
}

export interface IOAuthProvider {
	exchangeAuthorizationCode(code: string): Promise<IDPToken>;
	fetchProfile(idpToken: IDPToken): Promise<UserProfile>;
}
