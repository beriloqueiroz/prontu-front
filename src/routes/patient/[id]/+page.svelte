<script lang="ts">
	import type { Patient } from '$lib/interface/professional/patient';

	export let data: { patient: Patient };
</script>

<section>
	{data.patient.email}
</section>
