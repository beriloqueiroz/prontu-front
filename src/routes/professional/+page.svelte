<script lang="ts">
	import { goto } from '$app/navigation';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import type { Professional, ProfessionalRecord } from '$lib/interface/professional/professional';
	import { professional } from '$lib/stores/professional';
	import { user } from '$lib/stores/user';

	import { TabItem, Tabs, Toggle } from 'flowbite-svelte';

	import InputMask from '$lib/components/InputMask.svelte';
	import { allInstitution, getInstitutionKey } from '$lib/interface/professional/enums/institution';
	import { Button, Input, Label, Select } from 'flowbite-svelte';
	import { deserialize } from '$app/forms';

	let error: string | null = null;
	let loading = false;
	let isEdit = false;
	let isEditPass = false;
	let isEditEmail = false;

	let editFormKey = {};
	let editFormPassKey = {};
	let editFormEmailKey = {};

	let institution_selected = $professional?.professionalDocumentInstitution;

	let institutions = allInstitution.map((inst) => ({
		value: inst.toString(),
		name: getInstitutionKey(inst)
	}));

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

		const result = deserialize<ProfessionalRecord, ProfessionalRecord>(await response.text());

		if (result.type === 'error') {
			error = result.error.message;
			loading = false;
			return;
		}

		if (result.type === 'success') professional.set(result.data as Professional);

		loading = false;

		isEdit = false;
		isEditPass = false;
		isEditEmail = false;
	}

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
				<Toggle
					class="mb-2"
					bind:checked={isEdit}
					on:click={isEdit ? () => (editFormKey = {}) : () => {}}>Edição</Toggle
				>
				{#key editFormKey}
					<form on:submit|preventDefault={edit} method="POST" action="?/edit" id="edit_form">
						<div class="grid gap-6 mb-6 md:grid-cols-2">
							<input type="hidden" value={$user?.username} name="id" id="id" />
							<input type="hidden" value={$user?.email} name="email" id="email" />
							<div>
								<Label for="name" class={`mb-2 ${!isEdit ? 'text-gray-400' : 'text-gray-900'}`}
									>Nome completo</Label
								>
								<Input
									disabled={!isEdit}
									type="text"
									id="name"
									required
									name="name"
									value={$professional?.name}
								/>
							</div>
							<div>
								<Label for="document" class={`mb-2 ${!isEdit ? 'text-gray-400' : 'text-gray-900'}`}
									>Cpf</Label
								>
								<InputMask
									type="text"
									id="document"
									required
									mask="000.000.000-00"
									maskChar="_"
									name="document"
									disabled={!isEdit}
									value={$professional?.document}
								/>
							</div>
							<!-- <div>
							<Label for="phone" class={`mb-2 ${!isEdit ? 'text-gray-400' : 'text-gray-900'}`}
								>Telefone</Label
							>
							<InputMask
								type="tel"
								id="phone"
								required
								mask="+55 (00) 0 0000-0000"
								size={16}
								name="phone"
								disabled={!isEdit}
								value={$professional?.phone}
							/>
						</div> -->
							<div>
								<h4 class={`my-1 ${!isEdit ? 'text-gray-400' : 'text-gray-900'}`}>
									Documento profissional
								</h4>
								<Label class={`mb-2 ${!isEdit ? 'text-gray-400' : 'text-gray-900'}`}>
									Orgão:
									<Select
										class={`mt-2 ${!isEdit ? 'text-gray-400' : 'text-gray-900'}`}
										items={institutions}
										disabled={!isEdit}
										bind:value={institution_selected}
									/>
									<input
										type="hidden"
										value={institution_selected}
										name="professionalDocumentInstitution"
										id="professionalDocumentInstitution"
									/>
								</Label>

								<Label
									for="professionalDocument"
									class={`mb-2 ${!isEdit ? 'text-gray-400' : 'text-gray-900'}`}>Número</Label
								>
								<Input
									disabled={institution_selected == '' || !isEdit}
									type="text"
									id="professionalDocument"
									name="professionalDocument"
									placeholder="122552425"
									required
									class={`mb-2 ${!isEdit ? 'text-gray-400' : 'text-gray-900'}`}
									value={$professional?.professionalDocument}
								/>
							</div>
						</div>
						{#if isEdit}
							<Button type="submit" disabled={!isEdit}>
								{#if loading}
									<Spinner class="my-1 mx-3" size="3" color="white" />
								{:else}
									Salvar
								{/if}
							</Button>
						{/if}
						<ErrorMessage show={!!error} message={error} />
					</form>
				{/key}
			</TabItem>
			<TabItem title="Email">
				<Toggle
					class="mb-2"
					bind:checked={isEditEmail}
					on:click={isEditEmail ? () => (editFormEmailKey = {}) : () => {}}>Edição</Toggle
				>
				{#key editFormEmailKey}
					<form
						on:submit|preventDefault={edit}
						method="POST"
						action="?/editEmail"
						id="edit_email_form"
					>
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
						{/if}
						<ErrorMessage show={!!error} message={error} />
					</form>
				{/key}
			</TabItem>
			<TabItem title="Senha">
				<Toggle
					class="mb-2"
					bind:checked={isEditPass}
					on:click={isEditPass ? () => (editFormPassKey = {}) : () => {}}>Edição</Toggle
				>
				{#key editFormPassKey}
					<form
						on:submit|preventDefault={edit}
						method="POST"
						action="?/editAccess"
						id="edit_pass_form"
					>
						<div class="mb-6">
							<Label
								for="oldPassword"
								class={`mb-2 ${!isEditPass ? 'text-gray-400' : 'text-gray-900'}`}>Senha atual</Label
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
							<Label
								for="password"
								class={`mb-2 ${!isEditPass ? 'text-gray-400' : 'text-gray-900'}`}>Senha nova</Label
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
						<ErrorMessage show={!!error} message={error} />
					</form>
				{/key}
			</TabItem>
		</Tabs>
	{:catch error}
		<div>
			<ErrorMessage message={error} show={error} />
		</div>
	{/await}
</section>
