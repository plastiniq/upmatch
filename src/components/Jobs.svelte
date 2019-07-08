<script>
  import { format } from 'timeago.js'
  import { onMount } from 'svelte'
  import { tick } from 'svelte'

  export let query

  let jobs = []
  let newJobs = []
  let lastSearchTime
  let searchTimeoutID
  let updateTimeoutID
  let mounted = false
  let searchAbortController
  let prependAbortController
  let loading = false

  onMount(() => {
    mounted = true
    document.addEventListener('scroll', scrollHandler)

    return () => {
      clearTimeout(searchTimeoutID)
      clearTimeout(updateTimeoutID)
      document.removeEventListener('scroll', scrollHandler)
    }
  })

  $: if (mounted) {
    lastSearchTime = 0
    jobs = []
    newJobs = []
    // prependAbortController && prependAbortController.abort()
    search(query)
  }

  $: {
    updateJobs(jobs)
  }

  async function search () {
    clearTimeout(searchTimeoutID)

    await searchAbortController && searchAbortController.abort()
    searchAbortController = new AbortController()

    getJobs(searchAbortController).then(async json => {
      let foundJobs = json.jobs.map(v => Object.assign(v, {time_ago: format(v.date_created)}))
      newJobs = foundJobs.filter(v => new Date(v.date_created).getTime() > lastSearchTime).concat(newJobs)
      lastSearchTime = new Date(foundJobs[0].date_created).getTime()

      if (!jobs.length) {
        jobs = newJobs
        newJobs = []
      }

      setTimeout(() => search(query), 20000)
      tick().then(() => {
        fillUp()
      })
    })
    .catch(() => {})
  }

  function getJobs (controller, paging = '0;5') {
    loading = true
    return fetch(`/api/search.json?${new URLSearchParams({ q: query || '', sort: 'create_time desc', paging })}`, { signal: controller.signal, credentials: 'include' }).then(jobsRes => {
      return jobsRes.json()
    }).finally(() => loading = false)
  }

  async function prependJobs () {
    // await prependAbortController && searchAbortController.abort()
    prependAbortController = {}

    getJobs(prependAbortController, `${jobs.length + newJobs.length};10`).then(json => {
      return Promise.resolve((jobs = jobs.concat(json.jobs)))
    }).then(() => {
      tick().then(() => {
        fillUp()
      })
    })
  }

  function scrollHandler () {
    if (window.scrollY > (document.body.scrollHeight - document.body.clientHeight) - 30 && !loading) {
      prependJobs()
    }
  }

  function fillUp () {
    if (document.body.scrollHeight <= document.body.clientHeight) {
      prependJobs()
    }
  }

  function updateJobs () {
    clearTimeout(updateTimeoutID)
    jobs = jobs.map(v => Object.assign(v, {time_ago: format(v.date_created)}))
    updateTimeoutID = setTimeout(updateJobs, 1000)
  }

  function newJobsClickHandler () {
    jobs = newJobs.map(v => Object.assign(v, { new: true })).concat(jobs.map(v => Object.assign(v, { new: false })))
  }

</script>

<div>
  <div on:click={newJobsClickHandler}>New Jobs: {newJobs.length}</div>
  <table class="jobs-table">
  {#each jobs as job, i}
    <tr class="job" class:new={job.new}>
      <td class="time-ago">{job.time_ago}</td>
      <td>{job.title}</td>
      <td>{job.client.country}</td>
    </tr>
  {/each}
  </table>
</div>

<style>

.jobs-table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
}

.job {
  font-size: 16px;
}

.job td {
  height: 70px;
  padding: 0 15px;
}

.job td:last-child {
  padding-right: 0;
}

.job td:first-child {
  padding-left: 0;
}

.job td {
   border-bottom: 1px solid #F2F2F2;
}

.job:first-child td {
  border-top: 1px solid #F2F2F2;
}

.time-ago {
  opacity: 0.5;
  font-size: 14px;
}

.job.new .time-ago {
  color: #4C9DAD;
  opacity: 1;
}
</style>