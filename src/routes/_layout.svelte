<script context="module">
	import { me } from '../stores.js'

	export async function preload(page, session) {
		if (!page.path.startsWith('/login')) {

			var infoRes = await this.fetch(`/api/get/auth/v1/info.json`, { credentials: 'include' })

			if (infoRes.ok) {
				const infoJSON = await infoRes.json()
				const myKey = infoJSON.info.profile_url.split('/').pop()
				const profileRes = await this.fetch(`/api/get/profiles/v1/providers/${myKey}/brief.json`, { credentials: 'include' })
				const profileJSON = await profileRes.json()
				me.set(profileJSON.profile)
			} else {
				me.set(null)
				this.redirect(302, '/login')
			}
		}
	}
</script>

<div class="layout">
	<slot></slot>
</div>

<style>
	.layout {
		box-sizing: border-box;
		height: 100%;
		padding-top: 4.5vmin;
		padding-bottom: 0;
		padding-left: 5.5vmin;
		padding-right: 5.5vmin;
	}
</style>