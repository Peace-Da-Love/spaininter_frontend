export type Filter =
	| 'latest'
	| 'technologies'
	| 'economics'
	| 'incident'
	| 'culture';

export const filters: Filter[] = [
	'latest',
	'technologies',
	'economics',
	'incident',
	'culture'
] as const;
