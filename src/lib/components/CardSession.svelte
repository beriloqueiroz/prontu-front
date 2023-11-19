<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Session } from '$lib/interface/session/session';
	import { professional } from '$lib/stores/professional';
	import { Button, Card } from 'flowbite-svelte';

	export let session: Session;
</script>

<Card class="my-2 gap-2 flex flex-col relative">
	{#each session.patientIds as patientId}
		<div>
			<p>{$professional?.patients.find((p) => p.id === patientId)?.name}</p>
		</div>
	{/each}
	<div>
		<h3>Data</h3>
		<p>{session.startDate}</p>
	</div>
	<div>
		<h3>Tempo</h3>
		<p>{session.timeInMinutes}</p>
	</div>
	<Button type="button" on:click={() => goto(`/session/${session.id}`)}>Acessar</Button>
</Card>
