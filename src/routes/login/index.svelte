<script>
	let message
	let body = JSON.stringify({url: `${window.location.origin}/login/complete/`})

	fetch(`/api/login`, { 
		method: 'POST', 
		body, 
		credentials: 'include', 
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	}).then(resp => resp.json()).then(resp => {
		location.replace(resp.url)
	}).catch((e) => {
		message = e
	})

</script>

<div>
{#if message}
	{message}
{/if}
</div>