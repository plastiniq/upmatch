<script>
</script>

<div class="login">
  <h1>UpMatch</h1>
  <h2>
    Assess&nbsp;your&nbsp;chances before&nbsp;applying for&nbsp;a&nbsp;job.
  </h2>
  <div>
    <a class="login-button" href="/login">
      Login to Upwork
    </a>
  </div>
</div>

<style>
  .login {
    align-items: flex-start;
    padding-right: 10%;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    box-sizing: border-box;
  }

  h1 {
    margin: 0;
    padding: 0;
    color: var(--color-green);
    font-size: 2.6rem;
    font-weight: 700;
  }

  h2 {
    font-size: 4.3rem;
  }

  @media (max-width: 650px) {
    .login {
      align-items: center;
      padding: 0;
    }

    h2 {
      text-align: center;
      font-size: 3rem;
    }
  }
</style>
