<script lang="ts">
	import type { Patient } from '$lib/interface/professional/patient';
	import { patient } from '$lib/stores/patient';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	export let data: { patient: Patient };
	$: patient.set(data.patient);

	let breadCrumbMessage = '';

	onMount(() => {
		breadCrumbMessage = window.location.pathname.includes('session')
			? `Sessões de ${$patient.name}`
			: `Editar ${$patient.name}`;
	});
</script>

<Breadcrumb aria-label="Default breadcrumb" navClass="mb-6">
	<BreadcrumbItem href="/" home>Pacientes</BreadcrumbItem>
	<BreadcrumbItem>{breadCrumbMessage}</BreadcrumbItem>
</Breadcrumb>

<slot />
