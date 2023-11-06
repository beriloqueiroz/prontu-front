<script lang="ts">
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { professional } from '$lib/stores/professional';

	import { deserialize } from '$app/forms';
	import { user } from '$lib/stores/user';
	import { Button, Input, Label, Toggle } from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	let error: string | null = null;
	let loading = false;
	let isEditPass = false;

	let editFormPassKey = {};

	async function edit(event: { currentTarget: EventTarget & HTMLFormElement }) {
		loading = true;
		const data = new FormData(event.currentTarget);

		const response = await fetch(event.currentTarget.action, {
			method: 'POST',
			body: data,
			headers: {
				'x-sveltekit-action': 'true'
			}
		});

		const result = deserialize(await response.text());

		if (result.type === 'error') {
			error = result.error.message;
			loading = false;
			return;
		}

		professional.set(null);
		user.set(null);

		loading = false;
		isEditPass = false;

		// mostrar mensagem temporária de sucesso e de redirecionamento para o login
		goto('/login');
	}
</script>

<Toggle
	class="mb-2"
	bind:checked={isEditPass}
	on:click={isEditPass ? () => (editFormPassKey = {}) : () => {}}>Edição</Toggle
>
{#key editFormPassKey}
	<form on:submit|preventDefault={edit} method="POST" action="?/editPass" id="edit_pass_form">
		<div class="mb-6">
			<Label for="oldPassword" class={`mb-2 ${!isEditPass ? 'text-gray-400' : 'text-gray-900'}`}
				>Senha atual</Label
			>
			<Input
				type="password"
				id="oldPassword"
				placeholder="•••••••••"
				required
				name="oldPassword"
				disabled={!isEditPass}
			/>
		</div>
		<div class="mb-6">
			<Label for="password" class={`mb-2 ${!isEditPass ? 'text-gray-400' : 'text-gray-900'}`}
				>Senha nova</Label
			>
			<Input
				type="password"
				id="password"
				placeholder="•••••••••"
				required
				name="password"
				disabled={!isEditPass}
			/>
		</div>
		{#if isEditPass}
			<Button type="submit" disabled={!isEditPass}>
				{#if loading}
					<Spinner class="my-1 mx-3" size="3" color="white" />
				{:else}
					Salvar
				{/if}
			</Button>
		{/if}
		<p class="py-1 text-gray-600">
			Após alterar, você será "deslogado" e terá de entrar novamente usando a nova senha!
		</p>
		<ErrorMessage show={!!error} message={error} />
	</form>
{/key}
