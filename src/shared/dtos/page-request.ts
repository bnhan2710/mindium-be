import { OffsetPagination } from './offset-pagination.request';
import { PageRequest as IPageRequest } from '@shared/types';

export class PageRequest {
	static of({ size, page }: OffsetPagination): IPageRequest {
		return {
			size,
			page,
			offset: (page - 1) * size,
		};
	}
}
