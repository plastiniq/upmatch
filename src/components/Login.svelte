<script>

	let urlLoading = false

	let loginHandler = function() {
		urlLoading = true

    let body = JSON.stringify({url: `${window.location.origin}/login/complete/`})
    
    if (location.hash) {
      localStorage.loginHash = location.hash
    }

		fetch(`/api/login`, { 
			method: 'POST', 
			body, 
			credentials: 'include', 
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then(resp => resp.json()).then(resp => {
			location.replace(resp.url)
		}).catch((e) => {
			urlLoading = false
		})
  }
  
</script>

<div class="login">
  <h1>UpMatch</h1>
  <h2>
    Assess&nbsp;your&nbsp;chances before&nbsp;applying for&nbsp;a&nbsp;job.
  </h2>
  <div>
    <div class="login-button" class:loading={urlLoading} on:click={loginHandler}>
      Login to Upwork
    </div>
    <div class="open-source-project">
      <a href="https://github.com/plastiniq/upmatch" target="_blank">Open-Source Project</a>
    </div>
  </div>
</div>

<style>
  @keyframes loading {
    0% { stroke-dashoffset: 0 }
    100% { stroke-dashoffset: -15 }
  }

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
    color: #B6B6B6;
    font-size: 2.6rem;
    font-weight: 700;
  }

  h2 {
    font-size: 4.3rem;
  }

  .login-button {
    position: relative;
    cursor: pointer;
    border: 2px solid var(--bright-green);
    padding: 1.3rem 2.6rem 1.5rem 2.6rem;
    border-radius: 1000px;
    font-size: 2.1rem;
    font-weight: 700;
  }

  .open-source-project {
    font-size: 1.4rem;
    opacity: 0.3;
    margin-top: 2rem;
    text-align: center;
  }

  .login-loader {
    position: absolute;
    display: block;
    width: 100%;
    left: 0;
    bottom: 0;
    height: 3px;
    overflow: visible;
  }

  .login-loader line {
    transition: stroke-dasharray 0.4s;
    stroke-dasharray: 10 0;
    stroke-width: 5;
    stroke: #EBA65C;
  }

  .login-button.loading line {
    stroke-dasharray: 8 7;
    animation-duration: 0.4s;
    animation-name: loading;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
</style>
