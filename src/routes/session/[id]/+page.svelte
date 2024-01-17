<script lang="ts">
	import { possibleCids } from '$lib/static/cids';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import EditSessionForm from './EditSessionForm.svelte';
	export let data;
</script>

<Breadcrumb aria-label="Default breadcrumb" navClass="mb-6">
	<BreadcrumbItem href="/" home>Pacientes</BreadcrumbItem>
	<BreadcrumbItem href="/#session">Sessões</BreadcrumbItem>
	<BreadcrumbItem>{`Sessão`}</BreadcrumbItem>
</Breadcrumb>

<EditSessionForm possiblesCids={possibleCids} session={data.session} />
