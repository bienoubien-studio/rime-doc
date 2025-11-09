
<script>
  import { Dashboard } from 'rimecms/panel/client';
  const { data } = $props();
</script>

<Dashboard entries={data.entries} user={data.user} />