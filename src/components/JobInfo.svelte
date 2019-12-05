<script>
  export let job

  $:jobTitle = (job && job.op_title) || 'Please paste job link or job key in the upper input'

  $:hireRate = job && Math.min(100, Math.round(job.buyer.op_tot_jobs_filled / job.buyer.op_tot_jobs_posted * 100))

  $:candidates = job && parseInt(job.op_tot_cand)

  $:interviews = job && parseInt(job.op_tot_intv)

  $:key = job && job.ciphertext

</script>

<div class="job-info" class:empty={!job}>
  <h2 class="job-title"><span class="placeholder">{jobTitle}</span></h2>
  <div class="extra-info">
    <div class="hire-rate" class:hl={hireRate <= 50}>
      <span class="placeholder">
        <span class="value">{isNaN(hireRate) ? 'Unknown' : hireRate + '%'}</span> Hire Rate
      </span>
    </div>
    <div class="interviews" class:zero={!interviews}>
      <span class="placeholder">
        <span class="value">{interviews}</span> {interviews === 1 ? 'Interview' : 'Interviews'}
      </span>
    </div>
  </div>
  <a class="apply-job placeholder" href={`https://www.upwork.com/jobs/${key}/`} target="_blank">Open Job</a>
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
    position: relative;
    cursor: pointer;
    border: 2px solid var(--bright-green);
    padding: 1.3rem 2.6rem 1.5rem 2.6rem;
    border-radius: 1000px;
    font-size: 2.1rem;
    font-weight: 700;
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