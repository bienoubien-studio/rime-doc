
<script lang="ts">
	import { CollectionDoc, type CollectionDocData } from '@bienbien/rime/panel/client';
	const { data }: { data: CollectionDocData<false> } = $props();
</script>

<CollectionDoc {data} />