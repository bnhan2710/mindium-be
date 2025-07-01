import { SortDirection } from '@shared/constants';

export type SortQuery<K extends string> = Record<K, SortDirection>;
