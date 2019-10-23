<script>
	import SearchInput from '../components/SearchInput.svelte'
	// import Feed from '../components/Feed.svelte'
	import Job from '../components/Job.svelte'
	import * as sapper from '@sapper/app'
	import { profile } from '../stores.js'
	import { onMount } from 'svelte'
	import { tick } from 'svelte'

	let jobKey
	let query = ''
	let searchInput
	let mounted = false

	onMount(() => {
		tick().then(() => {
			query = decodeURIComponent(location.hash.substr(1))
			mounted = true
		})
	})

	$: if (mounted) {
		if (query) {
			location.hash = encodeURIComponent(query)
		} else {
			history.pushState('', document.title, window.location.pathname + window.location.search)
		}
	}

	$:initials = $profile && $profile.dev_short_name.split(/\s+/).map(v => v[0]).join('')
	$:portrait = $profile && $profile.dev_portrait_100
	
	function handleKey (e) {
		jobKey = e.detail.jobKey
	}

</script>

<div class="layout">
	<header>
		<SearchInput on:key={handleKey} bind:this={searchInput} bind:value={query} />
		<div class="user-menu">
			<div class="portrait" style="background-image: {portrait ? `url(${portrait})` : `none`}">
				{#if !portrait}
					{initials}
				{/if}
			</div>
			<svg class="arrow" width="8px" height="7px">
					<polygon points="0 0 8 0 4 7"></polygon>
			</svg>
		</div>
	</header>

	<main>
		<Job key={jobKey} />
		<!-- <Jobs query={query} /> -->
	</main>
</div>

<style>
	.layout {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	main {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-grow: 1;
		height: 100%;
	}

	header {
		display: flex;
		margin-bottom: 40px;
		flex-shrink: 0;
	}

	header > :global(:first-child) {
		flex-grow: 1;
		width: 0;
	}

	.user-menu {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-left: 1.238em;
	}

	.user-menu .portrait {
		width: 36px;
		height: 36px;
		border-radius: 100%;
		background-size: contain;
		background-color: #71636C;
		font-size: 12px;
		text-transform: uppercase;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 700;
	}

	.user-menu .arrow {
		margin-left: 10px;
	}

	.user-menu .arrow polygon {
		fill: #D8D8D8;
	}

	@media (max-width: 800px) {
	}
</style>