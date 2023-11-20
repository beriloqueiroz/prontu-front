<script lang="ts">
	import { TabItem, Tabs } from 'flowbite-svelte';
	import FinancialEditForm from './FinancialEditForm.svelte';
	import GeneralEditForm from './GeneralEditForm.svelte';
	import PersonalEditForm from './PersonalEditForm.svelte';
</script>

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
