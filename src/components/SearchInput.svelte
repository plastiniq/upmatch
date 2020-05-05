
<script>
import { tick } from 'svelte'
import { setParentSelection, getParentSelection } from './helpers/text.js'
import { createEventDispatcher } from 'svelte'

export let value = ''

const dispatch = createEventDispatcher()
let jobKey
let jobInput
let textContent
let justFocused

$: if ((value != textContent) && jobInput) {
  jobInput.innerHTML = value
  handleInput(null, jobInput)
}

async function handleInput(event, input) {
  input = input || this
  value = textContent = input.textContent
  const selection = getParentSelection(input)

  const matched = textContent.match(/[\^~][^/$]+/)
  jobKey = matched && matched[0]

  if (jobKey) {
    input.innerHTML = textContent.replace(/(^[^~]*)(~[^/$]+)(.*)/, '$1<span class="hl">$2</span>$3')
  } else {
    input.innerHTML = textContent
  }
  setParentSelection(input, selection)
}

function focusHandler () {
  justFocused = true
  selectAll()
}

function windowFocusHandler () {
  selectAll()
}

function mouseUpHandler (e) {
  justFocused && e.preventDefault()
  justFocused = false
}

function selectAll () {
  setParentSelection(jobInput, [0, jobInput.textContent.length])
} 

$: {
  dispatch('key', { jobKey })
}

$: {
  dispatch('text', { textContent })
}

</script>

<svelte:window on:focus={windowFocusHandler}/>

<div class="search-input" on:dblclick={selectAll}>
  <div 
    id="job-input"
    type="text" 
    contenteditable="true"
    on:input|preventDefault={handleInput}
    bind:this={jobInput}
    on:dblclick|preventDefault
    on:mouseup={mouseUpHandler}
    on:focus={focusHandler}
  ></div>
  <svg class="mark-check" class:on={jobKey} viewBox="0 0 19 15">
    <path d="M 0 7.61 L 6.95 15 L 24.59 -6.89" />
  </svg>
  <svg class="mark-error" class:on={textContent && !jobKey} viewBox="0 0 15 15">
    <circle r="10.5" cx="7.5" cy="7.5" />
    <line x1="0" y1="15" x2="15" y2="0" />
  </svg>
</div>

<style>
  .search-input {
    position: relative;
  }

  .search-input :global(.hl) {
    color: var(--color-green);
    font-weight: 700;
  }

  .mark-check {
    overflow: visible;
    position: absolute;
    right: 2.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2rem;
    height: 1.5rem;
    pointer-events: none;
  }

  .mark-check path {
    stroke-width: 3px;
    stroke: var(--color-green);
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: 28.74px 100px;
    stroke-dashoffset: 28.74px;
    transition: stroke-dashoffset 0.25s;
    transition-timing-function: cubic-bezier(0.620, 0.135, 0.325, 1.615);
  }

  .mark-check.on path {
    stroke-dashoffset: 0;
  }

  .mark-error {
    display: block;
    overflow: visible;
    position: absolute;
    right: 2.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 1.5rem;
    height: 1.5rem;
    pointer-events: none;
  }

  .mark-error > circle {
    stroke-dasharray: 66px 100px;
    stroke-dashoffset: 66px;
    transition: stroke-dashoffset 0.5s;
    stroke-linecap: round;
  }

  .mark-error > line {
    stroke-dasharray: 21px 100px;
    stroke-dashoffset: 21px;
    transition: stroke-dashoffset 0.4s;
    transition-delay: 0.1s;
  }

  .mark-error > line, .mark-error > circle {
    fill: none;
    stroke-width: 3px;
    stroke: var(--color-red);
  }

  .mark-error.on > line, .mark-error.on > circle {
    stroke-dashoffset: 0;
  }

  #job-input {
    border-style: solid;
    padding-top: 1.6rem;
    padding-bottom: 1.8rem;
    border-right-width: 7rem;
    border-left-width: 2.5rem;
    border-color: transparent;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
    cursor: text;
  }

  #job-input {
    position: relative;
    border-radius: 1.2rem;
    -webkit-appearance: none;
    appearance: none;
    font-family : inherit;
    box-shadow: 0 0.2rem 3rem rgba(0, 89, 116, 0.2);
    transition: box-shadow 0.2s;
    background-color: #fff;
  }

  #job-input:focus {
    outline: none;
    box-shadow: 0 0 0 2px #1C95FF;
  }

  #job-input:empty {
    background-color: transparent;
  }

  #job-input:empty:before {
    content: "Paste Job Link Here";
    display: inline-block;
    color: #808080;
  }
  
 </style>

