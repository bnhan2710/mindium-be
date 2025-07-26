import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
	Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private readonly tokenService: JwtService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req = context.switchToHttp().getRequest();

		const authHeader = req.headers['authorization'];

		console.log('Auth Header:', authHeader);

		if (!authHeader) throw new UnauthorizedException('Missing Authorization header');

		const token = authHeader.split(' ')[1];
		if (!token) throw new UnauthorizedException('Token not provided');

		try {
			const decoded = await this.tokenService.verifyAsync(token);
			req.user = decoded;
			return true;
		} catch (err) {
			throw new UnauthorizedException('Invalid or expired token');
		}
	}
}
