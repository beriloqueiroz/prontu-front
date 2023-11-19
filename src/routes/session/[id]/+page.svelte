<script lang="ts">
	import { possibleCids } from '$lib/static/cids';
	import EditSessionForm from './EditSessionForm.svelte';
	export let data;
</script>

<h3 class="my-2 text-center">Sessão: {data.session.id}</h3>
<EditSessionForm possiblesCids={possibleCids} session={data.session} />
