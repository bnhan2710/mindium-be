import { SortDirection } from '@shared/common/constants';

export type SortQuery<K extends string> = Record<K, SortDirection>;
