<script lang="ts">
	import { patient } from '$lib/stores/patient';
	import { TabItem, Tabs } from 'flowbite-svelte';
	import FinancialEditForm from './FinancialEditForm.svelte';
	import GeneralEditForm from './GeneralEditForm.svelte';
	import PersonalEditForm from './PersonalEditForm.svelte';
</script>

<h3 class="my-2 text-center">Paciente {$patient?.name}</h3>
<Tabs class="flex justify-center">
	<TabItem open title="Geral">
		<GeneralEditForm />
	</TabItem>
	<TabItem title="Financeiro">
		<FinancialEditForm />
	</TabItem>
	<TabItem title="Pessoais">
		<PersonalEditForm />
	</TabItem>
</Tabs>
