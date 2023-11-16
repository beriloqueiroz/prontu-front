<script lang="ts">
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import type { Professional, ProfessionalRecord } from '$lib/interface/professional/professional';
	import { professional } from '$lib/stores/professional';
	import { user } from '$lib/stores/user';

	import { Toggle } from 'flowbite-svelte';

	import { deserialize } from '$app/forms';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { clearFormError, processFormError } from '$lib/helpers/forms';

	let error: string | null = null;
	let loading = false;
	let isEditEmail = false;

	let editFormEmailKey = {};

	async function edit(event: { currentTarget: EventTarget & HTMLFormElement }) {
		loading = true;
		error = null;
		clearFormError();
		const data = new FormData(event.currentTarget);

		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data,
			headers: {
				'x-sveltekit-action': 'true'
			}
		});

		const result = deserialize<ProfessionalRecord, ProfessionalRecord>(await response.text());

		if (result.type === 'error') {
			error = result.error.message;
			loading = false;
			processFormError(result);
			return;
		}

		if (result.type === 'success') professional.set(result.data as Professional);

		loading = false;

		isEditEmail = false;
	}
</script>

<Toggle
	class="mb-2"
	bind:checked={isEditEmail}
	on:click={isEditEmail ? () => (editFormEmailKey = {}) : () => {}}>Edição</Toggle
>
{#key editFormEmailKey}
	<form on:submit|preventDefault={edit} method="POST" action="?/editEmail" id="edit_email_form">
		<input hidden value={$user?.id} name="id" />
		<div class="mb-6">
			<Label class={`mb-2 ${!isEditEmail ? 'text-gray-400' : 'text-gray-900'}`} for="email"
				>E-mail</Label
			>
			<Input
				type="email"
				id="email"
				placeholder="john.doe@company.com"
				required
				name="email"
				disabled={!isEditEmail}
				value={$user?.email}
			/>
		</div>
		{#if isEditEmail}
			<Button type="submit" disabled={!isEditEmail}>
				{#if loading}
					<Spinner class="my-1 mx-3" size="3" color="white" />
				{:else}
					Salvar
				{/if}
			</Button>
			<p class="py-1 text-gray-600">
				Após alterar, confirme na sua caixa de email e no próxima vez que entrar terá de ser com o
				novo email! =D
			</p>
		{/if}
		<ErrorMessage show={!!error} message={error} />
	</form>
{/key}
