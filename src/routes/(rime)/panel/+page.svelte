
<script>
  import { Dashboard } from '@bienbien/rime/panel/client';
  const { data } = $props();
</script>

<Dashboard entries={data.entries} user={data.user} />