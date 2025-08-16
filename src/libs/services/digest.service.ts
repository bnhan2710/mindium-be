import { compare, genSalt, hash } from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { EnvironmentKeyFactory } from '@libs/config/environment-key.factory';

@Injectable()
export class DigestService {
	private readonly saltRounds: number;

	constructor(configService: EnvironmentKeyFactory) {
		this.saltRounds = configService.getAuthConfig().saltRounds;
	}

	public async hash(data: string): Promise<string> {
		const salt = await genSalt(this.saltRounds);

		return hash(data, salt);
	}

	public async compare(data: string, encrypted: string): Promise<boolean> {
		return await compare(encrypted, data);
	}
}
