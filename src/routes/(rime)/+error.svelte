
<script>
	import { page } from '$app/state';
</script>

<div class="container">
	<h1>Error {page.status}</h1>
	|
	<p>
		{page.error?.message}
	</p>
</div>