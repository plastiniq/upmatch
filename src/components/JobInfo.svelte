<script>
  export let job

  $:jobTitle = job && job.op_title

  $:hireRate = job && Math.min(100, Math.round(job.buyer.op_tot_jobs_filled / job.buyer.op_tot_jobs_posted * 100))

  $:candidates = job && parseInt(job.op_tot_cand)

  $:interviews = job && parseInt(job.op_tot_intv)

  $:key = job && job.ciphertext

</script>

<div class="job-info">
  <h2 class="job-title">{jobTitle}</h2>
  <div class="extra-info">
    <div class="hire-rate" class:hl={hireRate <= 50}>
      <span class="value">{isNaN(hireRate) ? 'Unknown' : hireRate + '%'}</span> Hire Rate
    </div>
    <div class="interviews" class:zero={!interviews}>
      <span class="value">{interviews}</span> {interviews === 1 ? 'Interview' : 'Interviews'}
    </div>
  </div>
  <a href={`https://www.upwork.com/jobs/${key}/`} class="apply-job" target="_blank">Open Job</a>
</div>

<style>
  .job-info {
    align-items: flex-start;
    padding-right: 10%; 
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    box-sizing: border-box;
  }

  .extra-info {
    color: var(--customer-color);
  }

  .extra-info :not(:last-child) {
    margin-bottom: 2rem;
  }

  .extra-info .value {
    font-weight: 700;
  }

  .extra-info .hl {
    color: #EB0000;
  }

  .apply-job {
    padding: 1.1rem 2.4rem 1.3rem 2.4rem;
    border-radius: 100rem;
    border: 1px solid #B9E1D7;
  }

  @media (max-width: 800px) {
	  .extra-info {
      display: flex;
      justify-content: space-between;
    }

    .extra-info :not(:last-child) {
      margin: 0;
      margin-right: 3rem;
    }

    .grid-cell {

    }
  }

  @media (max-width: 650px) {
    .job-info {
      padding: 0;
    }
  }
</style>