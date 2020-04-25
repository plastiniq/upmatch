<script>
  import updateGraph from './graphs/match.js'
  import { tweened } from 'svelte/motion'
  import Comparator from 'cast-comparison'
	import castConfig from './comparison/config.js'
  import castHandler from './comparison/handler.js'
  
  export let freelancers = null
  export let me = null

  let matchValue = tweened(0, {
		duration: 800
  })
  
  let svg
  let graphWidth
  let graphHeight
  let graphBottom

  $:matchPrc = Math.round($matchValue * 100) + '%'
  $:myCast = castHandler(me)

  $: if (svg) {
    graphWidth = remToPixels(36)
    graphHeight = remToPixels(17)
    graphBottom = remToPixels(3)

    if (freelancers && me) {
      let comparator = new Comparator(castConfig)

      freelancers.forEach(v => {
        comparator.train(castHandler(v))
      })

      $matchValue = comparator.intersection(myCast)
      updateGraph(svg, comparator, myCast, graphWidth, graphHeight, graphBottom)
    } else {
      $matchValue = 0
      updateGraph(svg, null, null, graphWidth, graphHeight, graphBottom)
    }
  }

  function remToPixels (rem) {
    return document ? rem * parseFloat(getComputedStyle(document.documentElement).fontSize) : rem * 10
  }

</script>

<div class="graph" class:empty={!freelancers}>
	<div class="match-value placeholder">
      <div class="label">Intersection</div>
      <div class="value">{matchPrc}</div>
      <div class="loading-text"></div>
    </div>

    <div class="job-graph placeholder" style="width: 100%; max-width: {graphWidth}px;">
      <div class="match-graph-wrapper" style="padding-top: {graphHeight / graphWidth * 100}%;">
        <svg class="match-graph" bind:this={svg}>
        </svg>
      </div>
    </div>

    <div class="legend placeholder" style="max-width: {graphWidth}px;">
      <div class="customer">Customer Preferences</div>
      <div class="my">My Profile</div>
    </div>
</div>

<style>
  .graph {
    width: 100%;
    height: 100%;
	  align-items: center;
    padding: 0 5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    flex-shrink: 1;
    width: 100%;
    box-sizing: border-box;
  }

  /* .ready:not(.empty) .legend {
    opacity: 1;
    transform: translateY(0.2em);
  }

  .ready:not(.empty) .match-value {
    transform: translateY(0);
    opacity: 1;
  } */


.legend {
	display: flex;
	justify-content: space-between;
	font-size: 1.4rem;
	width: 100%;
}

.legend > * {
	display: flex;
	align-items: center;
}

.legend .my:before, .legend .customer:before {
	content: "";
	display: block;
	width: 2rem;
	height: 2rem;
	border-radius: 100%;
	margin-right: 0.9rem;
}

.legend .my, .legend .customer {
	white-space: nowrap;
}

.legend .my:before {
	background-color: var(--my-color);
}

.legend .customer:before {
	background-color: var(--customer-color);
}

.match-value {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	position: relative;
  line-height: 0.75;
  color: #3F695E;
  min-width: 130px;
}

.match-value .value {
	font-size: 4.8rem;
	font-weight: 700;
}

.match-value .label {
  margin-bottom: 1.8rem;
  font-size: 1.6rem;
  font-weight: 700;
}

.match-graph-wrapper {
	position: relative;
	width: 100%;
}

.match-graph {
	overflow: visible;
	max-width: 100%;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}

.match-graph :global(path.me) {
  fill: var(--my-color);
}

.match-graph :global(path.customer) {
	fill: var(--customer-color);
	mix-blend-mode: multiply;
}

.match-graph :global(.axis-text) {
  font-size: 1.4rem;
  font-family: inherit;
  fill: currentColor;
}

</style>