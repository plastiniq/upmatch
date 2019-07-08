
<script>
import { tick } from 'svelte';
import { setParentSelection, getParentSelection } from './helpers/text.js';
import { createEventDispatcher } from 'svelte';
import { onMount } from 'svelte';

const dispatch = createEventDispatcher();
let jobKey
let jobInput
let textContent

async function handleInput(event) {
  textContent = this.textContent
  const selection = getParentSelection(this)

  const matched = textContent.match(/[\^~][^/$]+/)
  jobKey = matched && matched[0]

  if (jobKey) {
    this.innerHTML = textContent.replace(/(^[^~]*)(~[^/$]+)(.*)/, '$1<span class="hl">$2</span>$3')
  } else {
    this.innerHTML = textContent
  }
  setParentSelection(this, selection)
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
  <div class="placeholder">Paste Job Link or Search</div>
  <div 
    id="job-input"
    type="text" 
    contenteditable="true"
    on:input|preventDefault={handleInput}
    bind:this={jobInput}
    on:dblclick|preventDefault
  >
  </div>
  <svg class="check" width="19" height="15" class:on={ jobKey }>
    <path d="M 0 7.61 L 6.95 15 L 24.59 -6.89" />
  </svg>
</div>

<style>

  .search-input {
    position: relative;
    font-size: 21px;
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

  .placeholder, #job-input {
    padding: 20px 25px 22px 25px;
  }

  .search-input :global(.hl) {
    color: #76CD8B;
    font-weight: 700;
  }

  .check {
    overflow: visible;
    position: absolute;
    right: 26px;
    top: 26px;
  }

  .check path {
    stroke-width: 3px;
    stroke: #76CD8B;
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

  #job-input {
    position: relative;
    border-radius: 7px;
    -webkit-appearance: none;
    appearance: none;
    font-family : inherit;
    box-sizing: border-box;
    background-color: #FFF;
    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.04);
    transition: box-shadow 0.2s;
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    /* margin-right: 70px; */
    background-color: #fff;
  }

  #job-input:focus {
    outline: none;
    box-shadow: 0 0 0  2px rgba(0, 0, 255, 0.2);
  }

  #job-input:empty {
    background-color: transparent;
  }
 </style>

