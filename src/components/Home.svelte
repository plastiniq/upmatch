<script>
	import SearchInput from './SearchInput.svelte'
	import Job from './Job.svelte'
	import * as sapper from '@sapper/app'
	import { me, errors } from '../stores.js'
	import { onMount } from 'svelte'
	import { tick } from 'svelte'
	import { goto } from '@sapper/app'

	let jobKey = null
	let query = ''
	let searchInput
	let menuIsOpen = false
	let mounted = false

	onMount(() => {
		query = decodeURIComponent(location.hash.substr(1) || sessionStorage.getItem('notLoggedQuery') || '')
		sessionStorage.removeItem('notLoggedQuery');
		mounted = true
	})

	$: if (mounted) {
		if (query) {
			location.hash = encodeURIComponent(query)
		} else {
			history.pushState('', document.title, window.location.pathname + window.location.search)
		}

		if (!$me) {
			sessionStorage.setItem('notLoggedQuery', query)
		}
	}

	$:initials = $me && $me.dev_short_name.split(/\s+/).map(v => v[0]).join('')
	$:portrait = $me && $me.dev_portrait_100
	
	function handleKey (e) {
		jobKey = e.detail.jobKey
  }
  
  function logOut () {
    fetch(`/api/logout`, { method: 'POST', credentials: 'include' }).then(resp => {
      if (resp.ok) {
				me.set(null)
        goto('/')
      } else {
        errors.update(v => v.concat(resp))
      }
    }).catch(error => errors.update(v => v.concat(error)))
  }
	
	function userClickHandler (e) {
		if (menuIsOpen) {
			menuIsOpen = false
			e.target.blur()
			e.preventDefault()
		}
	}

</script>

<div class="index">
	<header>
		<SearchInput on:key={handleKey} bind:this={searchInput} bind:value={query} />
		{#if $me}
			<div class="user-menu" tabindex="0">
				<div class="user-portrait" class:no-image={!portrait} style="background-image: {portrait ? `url(${portrait})` : `none`}" on:mousedown={userClickHandler} on:focus={ () => (menuIsOpen = true) } on:blur={ () => (menuIsOpen = false) }>
					{#if !portrait}
						{initials}
					{/if}
				</div>
				<div class="user-menu-popup popup" >
					<div on:click={logOut}>Log Out</div>
				</div>
			</div>
		{:else if query}
			<a class="login-button" href="/login">Login</a>
		{/if}
	</header>

	<main>
		<Job key={jobKey} />
	</main>
	<footer><a class="github-link" href="https://github.com/plastiniq/upmatch" target="_blank">github.com/plastiniq/upmatch</a></footer>
</div>

<style>
	main {		
		display: flex;
		justify-content: center;
		align-items: stretch;
		flex-grow: 1;
		padding: 0 6rem;
		flex-shrink: 0;
		flex-basis: 0;
	}

	.index {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	footer {
		height: calc(7rem + 4.5vmin);
		margin-top: 4.5vmin;
		font-size: 1.4rem;
		border-top: 1px solid #EEEBEF;
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.github-link:before {
		content: "";
		display: inline-block;
		width: 1.6rem;
		height: 1.6rem;
		background: url('/images/icons/github.svg') no-repeat;
		background-size: contain;
		margin-right: 1rem;
	}

	footer a {
		opacity: 0.5;
	}

	header {
		display: flex;
		margin-bottom: 4.5vmin;
		flex-shrink: 0;
		align-items: center;
	}

	header > :global(:first-child) {
		flex-grow: 1;
		width: 0;
	}

	header > :global(:first-child:not(:only-child)) {
		margin-right: 2.5rem;
	}
	
	.user-menu {
		display: flex;
		align-items: center;
		justify-content: flex-end;
    position: relative;
  }

	.user-portrait {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 100%;
		background-size: contain;
		font-size: 1.2rem;
		text-transform: uppercase;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: 700;
    box-sizing: border-box;
    cursor: pointer;
    overflow: visible;
    position: relative;
	}

	.user-portrait.no-image {
		border: 2px solid #EEEBEF;
  }
  
  .user-menu:focus {
     outline: none;
	}

	.user-menu:focus .user-menu-popup {
    display: block;
  }
	
	.user-portrait:active {
		filter: brightness(0.8);
	}

  .user-menu-popup {
    position: absolute;
    top: calc(100% + 1rem);
    right: 0;
    display: none;
	}
	
	@media (max-width: 800px) {
		main {
			padding: 0
		}
	}

	@media (max-width: 650px) {
		header {
			margin-bottom: 0;
		}

		footer {
			height: 30px;
			border: 0;
			margin: 0;
		}
	}
</style>