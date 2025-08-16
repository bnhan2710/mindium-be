import { OffsetPagination } from '@libs/common/dtos/offset-pagination.request';
import { CreatePage, PaginationMetadata } from '@libs/common/types';

export class Page<T> {
	items: T[];
	metadata: PaginationMetadata;

	static of<T, Q extends OffsetPagination>({
		query,
		items,
		totalRecords,
	}: CreatePage<T, Q>): Page<T> {
		const totalPages = Math.ceil(totalRecords / query.size);

		const metadata: PaginationMetadata = {
			size: query.size,
			page: query.page,
			totalRecords,
			totalPages,
		};
		const page = new Page<T>();
		page.items = items;
		page.metadata = metadata;

		return page;
	}
}
