<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import SuccessMessage from '$lib/components/SuccessMessage.svelte';
	import { clearFormError, processFormError } from '$lib/helpers/forms';
	import { Input, Label, Button, A, Modal } from 'flowbite-svelte';
	let error: string | null = null;
	let loading = false;
	async function handleLogin() {
		loading = true;
		error = null;
		clearFormError();
		return async ({ result }: any) => {
			if (result.type === 'error') {
				error = result.error.message;
				processFormError(result);
				loading = false;
				return;
			}
			loading = false;
			await applyAction(result);
		};
	}

	let clickOutsideModal = false;
	let errorForgot: string | null = null;
	let loadingForgot = false;
	let successForgotMessage: string | null = null;
	async function handleForgot() {
		loadingForgot = true;
		errorForgot = null;
		return async ({ result }: any) => {
			if (result.type === 'error') {
				errorForgot = result.error.message;
				loadingForgot = false;
				return;
			}
			loadingForgot = false;
			successForgotMessage = 'Sucesso ao enviar email com sua senha!';
			setTimeout(() => {
				clickOutsideModal = false;
				successForgotMessage = null;
				errorForgot = null;
			}, 5000);
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
	<A on:click={() => (clickOutsideModal = true)} type="button" class="my-2 text-blue-700 underline"
		>Esqueceu a senha?</A
	>
	<ErrorMessage show={!!error} message={error} />
</form>

<Modal title="Esqueci a senha" bind:open={clickOutsideModal} outsideclose>
	<p>Você receberá neste e-mail sua nova senha. Você poderá altera-la após login.</p>
	<form use:enhance={handleForgot} method="POST" action="?/forgot">
		<div class="mb-6">
			<Label for="email" class="mb-2">E-mail</Label>
			<Input type="email" id="email" placeholder="john.doe@company.com" required name="email" />
		</div>
		<div class="flex gap-3">
			<Button type="submit">
				{#if loadingForgot}
					<Spinner class="my-1 mx-3" size="3" color="white" />
				{:else}
					Enviar
				{/if}
			</Button>
			<Button color="alternative" on:click={() => (clickOutsideModal = false)}>Cancelar</Button>
		</div>
		<ErrorMessage show={!!errorForgot} message={errorForgot} />
		<SuccessMessage show={!!successForgotMessage} message={successForgotMessage} />
	</form>
</Modal>
