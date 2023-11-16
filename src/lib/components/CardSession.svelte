<script lang="ts">
	import type { Session } from '$lib/interface/session/session';

	export let session: Session;
</script>

<div>
	{JSON.stringify(session)}
</div>
