<script lang="ts">
	import { TabItem, Tabs } from 'flowbite-svelte';
	import GeneralEditForm from './GeneralEditForm.svelte';
	import type { Patient } from '$lib/interface/professional/patient';
	import FinancialEditForm from './FinancialEditForm.svelte';
	import PersonalEditForm from './PersonalEditForm.svelte';
	export let data: { patient: Patient };
</script>

<h3 class="my-2 text-center">Paciente {data.patient.name}</h3>
<Tabs class="flex justify-center flex-nowrap">
	<TabItem open title="Informações gerais">
		<GeneralEditForm patient={data.patient} />
	</TabItem>
	<TabItem title="Financeiro">
		<FinancialEditForm patient={data.patient} />
	</TabItem>
	<TabItem title="Pessoais">
		<PersonalEditForm patient={data.patient} />
	</TabItem>
</Tabs>
