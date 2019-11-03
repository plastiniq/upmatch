
<script>
import { tick } from 'svelte';
import { setParentSelection, getParentSelection } from './helpers/text.js';
import { createEventDispatcher } from 'svelte';

export let value = '';

const dispatch = createEventDispatcher();
let jobKey
let jobInput
let textContent

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

<div class="search-input" on:dblclick={selectAll}>
  <div class="placeholder">Paste Job Link Here</div>
  <div 
    id="job-input"
    type="text" 
    contenteditable="true"
    on:input|preventDefault={handleInput}
    bind:this={jobInput}
    on:dblclick|preventDefault
    on:focus={selectAll}
  >
  </div>
  <svg class="check" class:on={jobKey} viewBox="0 0 19 15">
    <path d="M 0 7.61 L 6.95 15 L 24.59 -6.89" />
  </svg>
</div>

<style>

  :root {
    --green-color: #6FBCA8;
  }

  .search-input {
    position: relative;
  }

  .placeholder {
    opacity: 0.4;
    position: absolute;
    left: 26px;
    top: 0;
    left: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .search-input :global(.hl) {
    color: var(--green-color);
    font-weight: 700;
  }

  .check {
    overflow: visible;
    position: absolute;
    right: 2.5rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2rem;
    height: 1.5rem;
    pointer-events: none;
  }

  .check path {
    stroke-width: 3px;
    stroke: var(--green-color);
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: 28.74px 100px;
    stroke-dashoffset: 28.74px;
    transition: stroke-dashoffset 0.25s;
    transition-timing-function: cubic-bezier(0.620, 0.135, 0.325, 1.615);
  }

  .check.on path {
    stroke-dashoffset: 0;
  }

  .placeholder, #job-input {
    border-style: solid;
    border-top-width: 2rem;
    border-right-width: 7rem;
    border-bottom-width: 2.2rem;
    border-left-width: 2.5rem;
    border-color: transparent;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
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
 </style>

