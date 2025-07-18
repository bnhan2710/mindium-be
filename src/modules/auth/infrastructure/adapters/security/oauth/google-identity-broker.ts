import { Injectable } from '@nestjs/common';
import { EnvironmentKeyFactory } from '@configs/environment-key.factory';
import { IOAuthProvider } from '@modules/auth/domain/ports/oauth/oauth-provider';
import axios from 'axios';
import * as qs from 'qs';

export interface GoogleTokenResponse {
	accessToken: string;
	idToken: string;
}

export interface GoogleUserProfile {
	id: string;
	email: string;
	name: string;
	picture?: string;
}

@Injectable()
export class GoogleIdentityBroker implements IOAuthProvider {
	private readonly clientId: string;
	private readonly clientSecret: string;
	private readonly redirectUrl: string;

	constructor(private readonly envFactory: EnvironmentKeyFactory) {
		this.clientId = this.envFactory.getGoogleClientId();
		this.clientSecret = this.envFactory.getGoogleClientSecret();
		this.redirectUrl = this.envFactory.getGoogleRedirectUrl();
	}

	async exchangeAuthorizationCode(code: string): Promise<GoogleTokenResponse> {
		const url = 'https://oauth2.googleapis.com/token';
		const values = {
			code,
			client_id: this.clientId,
			client_secret: this.clientSecret,
			redirect_uri: this.redirectUrl,
			grant_type: 'authorization_code',
		};

		const response = await axios.post(url, qs.stringify(values), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});

		return {
			accessToken: response.data.access_token,
			idToken: response.data.id_token,
		};
	}

	async fetchProfile(data: {
		idToken: string;
		accessToken: string;
	}): Promise<GoogleUserProfile> {
		const response = await axios.get(
			`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${data.accessToken}`,
			{
				headers: {
					Authorization: `Bearer ${data.idToken}`,
				},
			},
		);
		return response.data;
	}
}
