<script>
	import JobGraph from './JobGraph.svelte'
	import JobInfo from './JobInfo.svelte'
	import Login from './Login.svelte'
	import { stores } from '@sapper/app'
	import { onMount } from 'svelte'
	import { me } from '../stores.js'
	import { template } from '../components/comparison/handler.js'
	
	export let key

	let mounted
	let loadingCounter = 0
	let loaderRadius = 2
	let loadingTimeoutID
	let loading = false
	let job = null
	let freelancersError = ''
	let jobError = ''
	let freelancers = null
	let randomProfile = null
	let _previousKey = null

	onMount(() => {
		mounted = true

		if (!$me) {
			startGraphAnimation()
		}

	})

	$:referenceProfile = $me || randomProfile

	$:loadingProgress = Math.atan(Math.atan(loadingCounter))

	$: if (mounted && $me && _previousKey !== key) {
		_previousKey = key
		update()
	}

	$:loaderDasharray = `${2 * Math.PI * loaderRadius * loadingProgress}rem ${2 * Math.PI * loaderRadius}rem`

	function update () {
		
		loadingCounter = 0
		jobError = ''
		freelancersError = ''
		job = null
		freelancers = null
		
		if (!key) {
			return
		}

		startLoading()

		fetch(`/api/job/${key}.json`, { credentials: 'include' }).then(resp => {
			if (resp.ok) {
				return resp.json()
			}
			return Promise.reject(resp)
		})
		.catch(error => {
			jobError = error.statusText
		})
		.then(resp => {
			console.log(resp)
			job = resp.profile
			let profileKeys = getAssignments(resp)
			return fetch(`/api/profiles/${profileKeys.join(';')}.json`, { credentials: 'include' })
		})
		.then(resp => {
			if (resp.ok) {
				return resp.json()
			}
			return Promise.reject(resp)
		})
		.then(json => {
			freelancers = json.profiles
			finishLoading()
		})
		.catch(error => {
			if (error.status === 404) {
				freelancersError = 'This client does not have active freelancers in the hiring history for analysis.'
			} else {
				freelancersError = error.statusText
			}
			finishLoading()
		})
	}

	function startLoading () {
		loading = true
		loadingCounter = 0
		loadingTick()
	}

	function getAssignments (response) {
		let assignments = (response.profile.assignments && response.profile.assignments.assignment) || response.profile.assignment || response.profile.assignments
		return (Array.isArray(assignments) ? assignments : [assignments]).map(v => v.as_ciphertext)
	}

	function loadingTick () {
		loadingCounter += Math.random() < 0.1 ? 0.2 : 0.03
		loadingTimeoutID = setTimeout(loadingTick, 200)
	}

	function finishLoading () {
		clearTimeout(loadingTimeoutID)
		loadingCounter = Infinity
		loading = false
	}

	function startGraphAnimation () {
		graphAnimationTick()
	}

	function graphAnimationTick () {
		let rand = []
		
		for (let i = 0; i < 10; i++) {
			rand.push(Object.assign({}, ...Object.values(template).map(k => ({[k]: Math.round(Math.random() * 5)}))))
		}


		randomProfile = rand.pop()
		freelancers = rand

		setTimeout(graphAnimationTick, 1000)
	}
</script>

{#if jobError}
	<div>{jobError}</div>
{:else}
<div class="job-grid">
	<div class="grid-cell">
		{#if $me}
			<div class="grid-cell-block transition-block" class:hidden-block={!job}>
				<JobInfo bind:job />
			</div>
		{:else}
			<div class="grid-cell-block">
				<Login />
			</div>
		{/if}
	</div>
	<div class="grid-cell">
		<div class="loader" class:loading>
			<svg style="width: {loaderRadius * 2}rem; height: {loaderRadius * 2}rem;">
				<circle r="50%" cx="50%" cy="50%" style="stroke-dasharray: {loaderDasharray};"></circle>
			</svg>
		</div>
		<div class="job-computation-wrapper transition-block" class:hidden-block={!(freelancers || freelancersError)}>
			<div class="job-computation grid-cell-block">
				{#if freelancersError}
					<div class="freelancers-error">{freelancersError}</div>
				{:else}
					<JobGraph bind:freelancers bind:me={referenceProfile} />
				{/if}
			</div>
		</div>
	</div>
</div>
{/if}

<style>
:root {
	--appear-duration: 1s;
	--appear-translate: translateY(20px);
	--my-color:#3FA2FF; 
	--customer-color: #FFA65E;
	--job-block-width: 550px;
	--job-block-height: 550px;
}

.loader {
	position: absolute;
	background-color: #5DC0A8;
	border-radius: 100%;
	padding: 1rem;
	top: 50%;
	transition: transform, opacity;
	transition-duration: 250ms;
	box-shadow: 0 0 20px rgba(0, 89, 116, 0.2);
	opacity: 0;
	transform: translate(-50%, -50%) scale(0.8);
	z-index: 1;
}

.loader.loading {
	transform: translate(-50%, -50%);
	opacity: 1;
}

.loader svg {
	width: 5rem;
	height: 5rem;
	overflow: visible;
	display: block;
	font-size: inherit;
}

.loader svg circle {
	transition: stroke-dasharray 0.3s;
	stroke-linecap: round;
	fill: none;
	stroke-width: 2;
	stroke: #fff;
}

.job-grid {
	display: flex;
	flex-grow: 1;
	max-width: 1300px;
	justify-content: center;
	min-height: 40rem;
}

.grid-cell {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	flex-shrink: 1;
	flex-basis: 0;
	flex-grow: 1;
}

.grid-cell:first-child {
	align-items: flex-end;
}

.grid-cell:last-child {
	align-items: flex-start;
}

.grid-cell-block {
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	flex-shrink: 1;
	width: 100%;
	box-sizing: border-box;
	max-width: var(--job-block-width);
	max-height: var(--job-block-height);
	height: 100%;
}

.transition-block {
	transition: transform 0.5s, opacity 0.5s;
}

.hidden-block {
	opacity: 0;
	transform: translateY(20);
}

.freelancers-error {
	padding: 2.6rem;
}

.job-computation-wrapper {
	height: 100%;
	max-height: calc(var(--job-block-height) + 10rem);
	display: flex;
	align-items: center;
	background-color: #EBFFFA;
	border-radius: 2rem;
	width: 100%;
	max-width: var(--job-block-width);
}


@media (max-width: 650px) {
	.job-grid {
		flex-direction: column;
	}

	.loader {
		left: 50%;
		top: 0;
	}
}
</style>