<script lang="ts">
	import { TabItem, Tabs, Toggle } from 'flowbite-svelte';

	import { applyAction, enhance } from '$app/forms';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import InputMask from '$lib/components/InputMask.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { allInstitution, getInstitutionKey } from '$lib/interface/professional/enums/institution';
	import { user } from '$lib/stores/user';
	import { Button, Input, Label, Select } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	let error: string | null = null;
	let loading = false;
	let isEdit = false;
	let isEditPass = false;
	let isEditEmail = false;
	let mounted = false;

	$: mounted && toggleAllInputsEditForm(isEdit, 'edit_form');
	$: mounted && toggleAllInputsEditForm(isEditPass, 'edit_pass_form');
	$: mounted && toggleAllInputsEditForm(isEditEmail, 'edit_email_form');

	function refreshAllInputs() {
		toggleAllInputsEditForm(isEdit, 'edit_form');
		toggleAllInputsEditForm(isEditPass, 'edit_pass_form');
		toggleAllInputsEditForm(isEditEmail, 'edit_email_form');
	}

	function toggleAllInputsEditForm(go: boolean, id: string) {
		var form = document.getElementById(id);
		if (form) {
			var inputs = form.getElementsByTagName('input');
			var selects = form.getElementsByTagName('select');
			var elements = [...inputs, ...selects];
			for (var i = 0, len = elements.length; i < len; ++i) {
				elements[i].disabled = !go;
			}
			var labels = form.getElementsByTagName('label');
			for (var i = 0, len = labels.length; i < len; ++i) {
				if (go) {
					labels[i].classList.remove('text-gray-400');
					labels[i].classList.add('text-gray-900');
					continue;
				}
				labels[i].classList.add('text-gray-400');
				labels[i].classList.remove('text-gray-900');
			}
		}
	}

	onMount(() => {
		toggleAllInputsEditForm(false, 'edit_form');
		toggleAllInputsEditForm(false, 'edit_pass_form');
		toggleAllInputsEditForm(false, 'edit_email_form');
		mounted = true;
		isEdit = false;
		isEditPass = false;
		isEditEmail = false;
		console.log('🚀 ~ file: +page.svelte:51 ~ onMount ~ mounted:', mounted);
	});

	let institution_selected: string;

	let institutions = allInstitution.map((inst) => ({
		value: inst.toString(),
		name: getInstitutionKey(inst)
	}));

	async function edit() {
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

<Tabs>
	<TabItem open title="Informações" on:click={refreshAllInputs}>
		<Toggle class="mb-2" bind:checked={isEdit}>Edição</Toggle>
		<form use:enhance={edit} method="POST" action="?/edit" id="edit_form">
			<div class="grid gap-6 mb-6 md:grid-cols-2">
				<input type="hidden" value={$user?.username} name="id" id="id" />
				<input type="hidden" value={$user?.email} name="email" id="email" />
				<div>
					<Label for="name" class="my-2 ">Nome completo</Label>
					<Input type="text" id="name" required name="name" />
				</div>
				<div>
					<Label for="document" class="mb-2">Cpf</Label>
					<InputMask
						type="text"
						id="document"
						required
						mask="000.000.000-00"
						maskChar="_"
						name="document"
					/>
				</div>
				<div>
					<Label for="phone" class="mb-2">Telefone</Label>
					<InputMask
						type="tel"
						id="phone"
						required
						mask="+55 (00) 0 0000-0000"
						size={16}
						name="phone"
					/>
				</div>
				<div>
					<h4 class="my-1">Documento profissional</h4>
					<Label>
						Orgão:
						<Select class="mt-2" items={institutions} bind:value={institution_selected} />
					</Label>

					<Label for="professionalDocument" class="mb-2 mt-1">Número</Label>
					<Input
						disabled={institution_selected == ''}
						type="text"
						id="professionalDocument"
						name="professionalDocument"
						placeholder="122552425"
						required
					/>
				</div>
			</div>

			<Button type="submit" disabled={!isEdit}>
				{#if loading}
					<Spinner class="my-1 mx-3" size="3" color="white" />
				{:else}
					Salvar
				{/if}
			</Button>
			<ErrorMessage show={!!error} message={error} />
		</form>
	</TabItem>
	<TabItem title="Email" on:click={refreshAllInputs}>
		<Toggle class="mb-2" bind:checked={isEditEmail}>Edição</Toggle>
		<form use:enhance={edit} method="POST" action="?/editEmail" id="edit_email_form">
			<input hidden value={$user?.id} name="id" />
			<div class="mb-6">
				<Label for="email" class="mb-2">E-mail</Label>
				<Input type="email" id="email" placeholder="john.doe@company.com" required name="email" />
			</div>
			<Button type="submit" disabled={!isEditEmail}>
				{#if loading}
					<Spinner class="my-1 mx-3" size="3" color="white" />
				{:else}
					Salvar
				{/if}
			</Button>
			<ErrorMessage show={!!error} message={error} />
		</form>
	</TabItem>
	<TabItem title="Senha" on:click={refreshAllInputs}>
		<Toggle class="mb-2" bind:checked={isEditPass}>Edição</Toggle>
		<form use:enhance={edit} method="POST" action="?/editAccess" id="edit_pass_form">
			<div class="mb-6">
				<Label for="oldPassword" class="mb-2">Senha atual</Label>
				<Input
					type="password"
					id="oldPassword"
					placeholder="•••••••••"
					required
					name="oldPassword"
				/>
			</div>
			<div class="mb-6">
				<Label for="password" class="mb-2">Senha nova</Label>
				<Input type="password" id="password" placeholder="•••••••••" required name="password" />
			</div>
			<Button type="submit" disabled={!isEditPass}>
				{#if loading}
					<Spinner class="my-1 mx-3" size="3" color="white" />
				{:else}
					Salvar
				{/if}
			</Button>
			<ErrorMessage show={!!error} message={error} />
		</form>
	</TabItem>
</Tabs>
