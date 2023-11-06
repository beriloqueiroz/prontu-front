<script lang="ts">
	import { goto } from '$app/navigation';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import type { Professional } from '$lib/interface/professional/professional';
	import { professional } from '$lib/stores/professional';
	import { user } from '$lib/stores/user';

	import { TabItem, Tabs } from 'flowbite-svelte';

	import PasswordEditForm from './PasswordEditForm.svelte';
	import ProfessionalEditForm from './ProfessionalEditForm.svelte';
	import UserEditForm from './UserEditForm.svelte';

	$: professionalId = $user?.username;

	async function captureProfessional(id: string | undefined): Promise<Professional | null> {
		if (!id) {
			goto('/login');
		}
		if ($professional) return $professional;
		const response = await fetch(
			`${location.protocol}//${location.host}/api/professional?id=${id}`
		);
		const professionalResponse = await response.json();
		professional.set(professionalResponse);
		return professionalResponse;
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="app" />
</svelte:head>

<section>
	{#await captureProfessional(professionalId)}
		<Spinner />
	{:then}
		<Tabs class="flex justify-center flex-nowrap">
			<TabItem open title="Informações">
				<ProfessionalEditForm />
			</TabItem>
			<TabItem title="Email">
				<UserEditForm />
			</TabItem>
			<TabItem title="Senha">
				<PasswordEditForm />
			</TabItem>
		</Tabs>
	{:catch error}
		<div>
			<ErrorMessage message={error} show={error} />
		</div>
	{/await}
</section>
