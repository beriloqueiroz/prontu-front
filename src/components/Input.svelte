<script lang="ts">
	export let value = '';
	export let name = '';
	export let label = '';
	export let id = '';
	export let placeholder = '';
</script>

<div class="">
	<label for={name} class="">{label}</label>
	<input bind:value id={`${id}-${name}`} {name} type="text" class="" {placeholder} />
</div>
