
<script lang="ts">
  import { Live } from 'rimecms/panel/client';

  import config from '../../../lib/+rime.generated/rime.config.js';

  const { data } = $props();
</script>


<Live {data} config={config} />