<script>
	let urlLoading = false

	let loginHandler = function() {
		urlLoading = true

		let body = JSON.stringify({url: `${window.location.origin}/login/complete`})
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
	<div class="intro">
		<div class="logo">UpMatch</div>
		<div class="app-description">
			<div class="main-description">
				Find the Intersection of&nbsp;Your&nbsp;Profile with Customer&nbsp;Preferences.
			</div>
			<div class="open-source">
				<a href="https://github.com/plastiniq/upmatch">Open Source Project</a>
			</div>
		</div>
		<div class="login-button" on:click={loginHandler}>
			<svg class="login-loader" class:loading={urlLoading}>
				<rect width="100%" height="100%" />
			</svg>
			<div>Login to Upwork</div>
		</div>
	</div>
</div>


<style>

.login {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	background: url('/images/login/background.svg') no-repeat right center;
	background-size: contain;
	padding: 10vmin;
	display: flex;
	align-items: stretch;
}


.intro {
	display: flex;
	max-width: 500px;
	flex-direction: column;
	justify-content: space-between;
	align-items: flex-start;
}

.open-source {
	font-size: 16px;
	margin-top: 1em;
}

.open-source a {
	color: #4C9DAD;
	margin-left: 0.2em;
}

.open-source a:before {
	content: "";
	display: inline-block;
	width: 16px;
	height: 16px;
	background: url('/images/icons/github.svg') no-repeat;
	background-size: contain;
	margin-right: 10px;
	transform: translateY(0.07em);
}

.logo {
	font-size: 21px;
	color: #76CD8B;
	font-weight: 500;
}

.app-description {
	font-size: 42px;
}

.login-button {
	color: inherit;
	font-weight: 500;
	display: inline-block;
	position: relative;
	cursor: pointer;
	padding: 50px;
	color: #76CD8B;
}

.login-loader {
	display: block;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
}

.login-loader rect {
	fill: none;
	stroke-width: 2px;
	stroke: rgba(118, 205, 139, 0.5);
	stroke-linecap: round;
	stroke-dasharray: 10 0;
	transition: stroke-dasharray 0.2s;
}

@keyframes login-url-loading {
  0% { stroke-dashoffset: 0 }
  100% { stroke-dashoffset: -16 }
}

.login-loader.loading rect {
	stroke-dasharray: 10 6;
	animation-duration: 0.5s;
  animation-name: login-url-loading;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
}

</style>