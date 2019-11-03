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
  <h1>Upmatch</h1>
  <h2>
    Find the Intersection of&nbsp;Your Profile with Customer Preferences.
  </h2>
  <div class="login-button" class:loading={urlLoading} on:click={loginHandler}>
    Login to Upwork
    <svg class="login-loader">
      <line x1="0" y1="50%" x2="100%" y2="50%" />
    </svg>
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
    color: #8CCBB0;
    font-size: inherit;
    font-weight: 700;
  }

  .login-button {
    position: relative;
    padding-bottom: 1.6rem;
    cursor: pointer;
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
    stroke-width: 3;
    stroke-linecap: round;
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
