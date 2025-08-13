import { SortDirection } from '@libs/common/constants';

export type SortQuery<K extends string> = Record<K, SortDirection>;
