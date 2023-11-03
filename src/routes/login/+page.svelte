<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { Input, Label, Button, A } from 'flowbite-svelte';
	let error: string | null = null;
	let loading = false;
	async function handleLogin() {
		loading = true;
		return async ({ result }: any) => {
			if (result.type === 'error') {
				error = result.error.message;
				loading = false;
				return;
			}
			loading = false;
			await applyAction(result);
		};
	}
</script>

<form use:enhance={handleLogin} method="POST" action="?/login">
	<div class="mb-6">
		<Label for="email" class="mb-2">E-mail</Label>
		<Input type="email" id="email" placeholder="john.doe@company.com" required name="email" />
	</div>
	<div class="mb-6">
		<Label for="password" class="mb-2">Senha</Label>
		<Input type="password" id="password" placeholder="•••••••••" required name="password" />
	</div>
	<div class="flex gap-3">
		<Button type="submit">
			{#if loading}
				<Spinner class="my-1 mx-3" size="3" color="white" />
			{:else}
				Entrar
			{/if}
		</Button>
		<A href="/register">Cadastrar-se</A>
	</div>
	<ErrorMessage show={!!error} message={error} />
</form>
