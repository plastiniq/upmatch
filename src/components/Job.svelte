<script>
	import Comparator from './comparison/comparator.js'
	import castConfig from './comparison/config.js'
	import castHandler from './comparison/handler.js'
	import { stores } from '@sapper/app'
	import { profile } from '../stores.js'
	import updateGraph from './graphs/match.js'
	import { tweened } from 'svelte/motion';
	import { onMount } from 'svelte'

	export let key

	let matchValue = tweened(0, {
		duration: 800
	})

	let mounted
	let svg
	let graphWidth = 380
	let graphHeight = 200
	let graphBottom = 30
	let loadingCounter = 0
	let loadingTimeoutID
	let loaded = false
	let job = null
	let profilesError = ''
	let jobError = ''

	onMount(() => {
		mounted = true
	})


	$:myProfile = castHandler($profile)

	$:matchPrc = Math.round($matchValue * 100) + '%'

	$:loadingProgress = Math.atan(Math.atan(loadingCounter))

	$:jobTitle = job && job.op_title

	$:candidates = job && parseInt(job.op_tot_cand)
	$:interviews = job && parseInt(job.op_tot_intv)

	$: if (myProfile && mounted) {
		key
		compute()
	}

	function compute () {
		$matchValue = 0
		loadingCounter = 0
		jobError = ''
		profilesError = ''
		job = null
		loaded = false
		updateGraph(svg, null, null, graphWidth, graphHeight, graphBottom)
		
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
			let comparator = new Comparator(castConfig)
			json.profiles.forEach(v => {
				comparator.train(castHandler(v))
			})
			$matchValue = comparator.intersection(myProfile)
			updateGraph(svg, comparator, myProfile, graphWidth, graphHeight, graphBottom)
			finishLoading()
		})
		.catch(error => {
			if (error.status === 404) {
				profilesError = 'The client does not have active profiles in the hiring history for analysis.'
			} else {
				profilesError = error.statusText
			}
		})
	}

	function startLoading () {
		loaded = false
		loadingCounter = 0
		loadingTick()
	}

	function getAssignments (response) {
		let assignments = (response.profile.assignments && response.profile.assignments.assignment) || response.profile.assignment || response.profile.assignments
		return (Array.isArray(assignments) ? assignments : [assignments]).map(v => v.as_ciphertext)
	}

	function loadingTick () {
		loadingCounter += Math.random() < 0.1 ? 0.2 : 0.03
		loadingTimeoutID = setTimeout(loadingTick, 100)
	}

	function finishLoading () {
		loaded = true
		loadingCounter = Infinity
		clearTimeout(loadingTimeoutID)
	}
</script>

{#if jobError}
	<div>{jobError}</div>
{:else}
<div class="job-grid" class:job-info-available={job && jobTitle} class:job-value-available={loaded}>
	<div class="grid-cell" style="padding-bottom: {graphBottom}px;">
		<div class="acquired-info">
			<h3>{jobTitle}</h3>
			<div class="candidates">
				<div class="total-candidates" class:zero={!candidates}>{candidates} {candidates === 1 ? 'candidate' : 'candidates'}</div>
				<div class="interviewed-candidates" class:zero={!interviews}>{interviews} {interviews === 1 ? 'interview' : 'interviews'}</div>
			</div>
			<a href={`https://www.upwork.com/ab/proposals/job/${key}/apply`} target="_blank">Apply Job</a>
		</div>
	</div>
	<div class="grid-cell">
		{#if profilesError}
			<div class="profiles-error" style="margin-bottom: {graphBottom}px">{profilesError}</div>
		{:else}
			<div class="job-graph" class:loaded>
				<div class="match-value">
					<div class="label">Intersection</div>
					<div class="value">{matchPrc}</div>
					<div class="loading-text"></div>
				</div>
				<div class="match-graph-wrapper" style="width: 100%; max-width: {graphWidth}px; padding-top: {graphHeight / graphWidth * 100}%;">
					<svg class="match-graph" bind:this={svg}>
					<g class="loading">
						<line class="loading-track" x1="0" y1={graphHeight - graphBottom} x2="100%" y2={graphHeight - graphBottom} />
						<line class="loading-progress" x1="0" y1={graphHeight - graphBottom} x2="100%" y2={graphHeight - graphBottom} stroke-dasharray={`${loadingProgress * graphWidth} ${graphWidth}`} />
					</g>
					</svg>
				</div>
			</div>
		{/if}
	</div>
	<div class="grid-cell" style="padding-bottom: {graphBottom}px;">
		<div class="legend">
			<div class="my">My Profile</div>
			<div class="customer">Customer Preferences</div>
		</div>
	</div>
</div>
{/if}

<style>
:root {
	--appear-duration: 1s;
	--appear-translate: translateY(20px);
}

.job-grid {
	display: flex;
	flex-grow: 1;
	max-width: 1300px;
}

.job-grid.job-info-available .acquired-info {
	opacity: 1;
	transform: translateY(0);
}

.job-grid.job-value-available .legend {
	opacity: 1;
	transform: translateY(0.2em);
}

.job-grid.job-value-available .match-value {
	transform: translateY(0);
	opacity: 1;
}

.acquired-info {
	max-width: 300px;
	box-sizing: border-box;
	opacity: 0;
	transform: var(--appear-translate);
	transition-property: opacity, transform;
	transition-duration: var(--appear-duration);
}

.acquired-info h3 {
	padding: 0;
	margin: 0;
	font-size: inherit;
	opacity: 0.5;
	font-weight: inherit;
	margin-bottom: 3.5rem;
}

.candidates {
	font-size: 1.4rem;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	margin-bottom: 3.5rem;
}

.candidates > * {
	border-radius: 100px;
	padding: 0.3rem 1.1rem;
	font-weight: 700;
	color: #fff;
	box-sizing: border-box;
}

.candidates > :not(:last-child) {
	margin-bottom: 0.8rem;
}

.candidates .total-candidates {
	background-color: #76CD8B;
}

.candidates .interviewed-candidates {
	background-color: #FF95A4;
}
.candidates .zero {
	background-color: transparent !important;
	/* box-shadow: inset 0 0 0 1px #E8E8E8; */
	border: 2px solid #EBEBEB;
}

.total-candidates.zero {
	color: #76CD8B;
}

.interviewed-candidates.zero {
	color: #FF95A4;
}

.acquired-info a {
	color: inherit;
	text-decoration: none;
}

.profiles-error {
	border: 2px solid #FF95A4;
	border-radius: 1.4rem;
	padding: 2.6rem;
}

.grid-cell {
	display: flex;
	justify-content: center;
	align-items: flex-end;
	flex-basis: 0;
	padding: 0 2.5vw;
	flex-grow: 1;
}

.grid-cell:first-child, .grid-cell:last-child {
	flex-grow: 1;
}

.grid-cell:first-child {
	justify-content: flex-end;
}

.grid-cell:last-child {
	justify-content: flex-start;
}

.job-graph {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	padding-bottom: 5px;
	width: 100%;
}

.legend {
	opacity: 0;
	transform: var(--appear-translate);
	transition-property: transform, opacity;
	transition-duration: var(--appear-duration);
}

.legend > * {
	display: flex;
	align-items: center;
}

.legend > :not(:last-child) {
	margin-bottom: 2px;
}

.legend .my:before, .legend .customer:before {
	content: "";
	display: block;
	width: 14px;
	height: 14px;
	border-radius: 100%;
	margin-right: 15px;
}

.legend .my, .legend .customer {
	white-space: nowrap;
}

.legend .my:before {
	background-color: #C8EFF7;
}

.legend .customer:before {
	background-color: #FF95A4;
}

.match-value {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	position: relative;
	margin-bottom: 1.4285em;
	transform: translateY(80px);
	transition-property: transform, opacity;
	transition-duration: var(--appear-duration);
	opacity: 0;
}

.match-value .value {
	font-size: 48px;
	font-weight: 700;
}

.match-value .loading-text {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: 0;
	opacity: 0.5;
}

.match-value .label {
	font-size: 14px;
	font-weight: 400;
}

.match-graph-wrapper {
	position: relative;
}

.match-graph {
	overflow: visible;
	max-width: 100%;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
}

.match-graph .loading {
  transition: opacity 0.2s;
}

.job-graph.loaded .loading {
	opacity: 0;
}

.match-graph .loading-track {
  stroke-width: 2;
  stroke: #F1F1F1;
  stroke-linecap: round;
}

.match-graph .loading-progress {
  stroke-width: 2;
  stroke: #FF95A4;
  stroke-linecap: round;
  transition: stroke-dasharray 0.2s;
}

.match-graph :global(path.customer) {
  fill: #FF95A4;
}

.match-graph :global(path.me) {
  fill: #C8EFF7;
  mix-blend-mode: multiply;
}

.match-graph :global(.axis-text) {
  font-size: 14px;
  font-family: inherit;
  fill: #71636C;
}

@media (max-width: 800px) {
	.job-grid {
		flex-direction: column;
		height: 100%;
		align-items: stretch;
		justify-content: space-between;
	}

	.grid-cell {
		flex-shrink: 0;
		flex-grow: 0 !important;
		flex-basis: auto;
		align-items: initial;
		padding: 0;
		justify-content: stretch !important;
		padding-bottom: 0 !important;
	}


	.acquired-info {
		max-width: none;
		width: 100%;
	}
}
</style>