<script lang="ts">
	import type { Patient } from '$lib/interface/professional/patient';
	import { patient } from '$lib/stores/patient';
	export let data: { patient: Patient };
	$: patient.set(data.patient);
</script>

<slot />
