<script>
  import * as JobsAPI from '../../components/api/jobs.js'
	import Comparator from '../../components/comparison/comparator.js'
	import castConfig from '../../components/comparison/config.js'
	import castHandler from '../../components/comparison/handler.js'
	import { stores } from '@sapper/app'
	import { profile } from '../../stores.js'
	// import updateGraph from '../../components/graphs/match.js'
	import { tweened } from 'svelte/motion';
	const { preloading, page, session } = stores()

	function updateGraph() {
		
	}

	let jobKey
	let matchValue = tweened(0, {
		duration: 800
	})
	let svg
	let graphWidth = 380
	let graphHeight = 160
	let loadingCounter = 0
	let loadingTimeoutID
	let loaded = false
	let job = null

	page.subscribe(v => {
		jobKey = v.params.slug
	})

	$:myProfile = castHandler($profile)

	$:matchPrc = Math.round($matchValue * 100) + '%'

	$:loadingProgress = Math.atan(Math.atan(loadingCounter))

	$:jobTitle = job && job.profile && job.profile.op_title

	$: if (myProfile && svg) {
		jobKey
		compute()
	}

	async function compute () {
		startLoading()
		$matchValue = 0
		job = null
		const jobRes = await fetch(`/api/job/${jobKey}.json`, { credentials: 'include' })

		if (jobRes.ok) {
			job = await jobRes.json()
			let profileKeys = getAssignments(job)
			const profilesRes = await fetch(`/api/profiles/${profileKeys.join(';')}.json`, { credentials: 'include' })
			const profilesJSON = await profilesRes.json()

			let comparator = new Comparator(castConfig)
			profilesJSON.profiles.forEach(v => {
				comparator.train(castHandler(v))
			})
			$matchValue = comparator.intersection(myProfile)
			updateGraph(svg, comparator, myProfile, graphWidth, graphHeight)
		} 

		finishLoading()
	}

	function startLoading () {
		loaded = false
		loadingCounter = 0
		updateGraph(svg, null, null, graphWidth, graphHeight)
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

<div class="job-grid" class:job-info-available={jobTitle} class:job-value-available={loaded}>
	<div class="grid-cell">
		<div class="acquired-info">
			<h3>{jobTitle}</h3>
			<a href={`https://www.upwork.com/ab/proposals/job/${jobKey}/apply`} target="_blank">Apply Job</a>
		</div>
	</div>
	<div class="grid-cell">
		<div class="job-graph" class:loaded>
			<div class="match-value">
				<div class="value">{matchPrc}</div>
				<div class="loading-text"></div>
			</div>
			<svg class="match-graph" bind:this={svg} width={graphWidth} height={graphHeight}>
			<g class="loading">
				<line class="loading-track" x1="0" y1="100%" x2="100%" y2="100%" />
				<line class="loading-progress" x1="0" y1="100%" x2="100%" y2="100%" stroke-dasharray={`${loadingProgress * graphWidth} ${graphWidth}`} />
			</g>
			</svg>
		</div>
	</div>
	<div class="grid-cell">
		<div class="legend">
			<div class="my">My Profile</div>
			<div class="customer">Customer Preferences</div>
		</div>
	</div>
</div>


<style>
:root {
	--appear-duration: 1s;
	--appear-translate: translateY(20px);
}

.job-grid {
	display: flex;
	flex-grow: 1;
	max-width: 1300px;
	flex-wrap: wrap;
}

.job-grid.job-info-available .acquired-info {
	opacity: 1;
	transform: translateY(0);
}

.job-grid.job-value-available .legend {
	opacity: 1;
	transform: translateY(0);
}

.job-grid.job-value-available .match-value {
	transform: translateY(0);
}

.job-grid.job-value-available .match-value .value {
	opacity: 1;
}

.job-grid.job-value-available .match-value:before {
	opacity: 1;
}

.job-grid.job-value-available .match-value .loading-text {
	opacity: 0;
}

.acquired-info {
	padding: 21px 25px;
	border: 2px solid #76CD8B;
	border-radius: 24px;
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
	margin-bottom: 15px;
}

.acquired-info a {
	color: inherit;
	text-decoration: none;
}

.grid-cell {
	display: flex;
	justify-content: center;
	align-items: flex-end;
	flex-basis: 0;
	padding: 0 2.5vw;
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
}

.legend {
	font-size: 21px;
	opacity: 0;
	transform: var(--appear-translate);
	transition-property: transform, opacity;
	transition-duration: var(--appear-duration);
	transition-delay: 0.3s;
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
	position: relative;
	margin-bottom: 30px;
	transform: translateY(80px);
	transition-property: transform;
	transition-duration: var(--appear-duration);
}

.match-value > * {
	transition-property: opacity;
	transition-duration: 0.3s;
}

.match-value .value {
	font-size: 48px;
	font-weight: 700;
	opacity: 0;
}

.match-value .loading-text {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	bottom: 0;
	opacity: 0.5;
}

.match-value:before {
	content: "Intersection";
	display: block;
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%);
	font-size: 14px;
	font-weight: 400;
	opacity: 0;
}

.match-graph {
  overflow: visible;
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
</style>