<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { Input, Label, Button, A } from 'flowbite-svelte';
	import ErrorMessage from '../../components/ErrorMessage.svelte';
	let error: string | null = null;
	async function handleLogin() {
		return async ({ result }: any) => {
			if (result.type === 'error') {
				error = result.error.message;
				return;
			}
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
		<Button type="submit">Entrar</Button>
		<A href="/register">Cadastrar-se</A>
	</div>
	<ErrorMessage show={!!error} message={error} />
</form>
