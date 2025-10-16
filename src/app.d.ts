// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {}

	type PaginationLink = { title: string; description?: string; url: string };
	type Pagination = {
		prev: PaginationLink | null;
		next: PaginationLink | null;
	};
}

export {};
