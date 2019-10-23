<script context="module">
	import * as UserAPI from '../components/api/user.js'
	import { profile } from '../stores.js'

	export async function preload(page, session) {
		if (!page.path.startsWith('/login')) {

			var infoRes = await this.fetch(`/api/get/auth/v1/info.json`, { credentials: 'include' })

			if (infoRes.ok) {
				const infoJSON = await infoRes.json()
				const profileKey = infoJSON.info.profile_url.split('/').pop()
				const profileRes = await this.fetch(`/api/get/profiles/v1/providers/${profileKey}/brief.json`, { credentials: 'include' })
				const profileJSON = await profileRes.json()
				profile.set(profileJSON.profile)
			} else {
				profile.set(null)
				this.redirect(302, '/login')
			}
		}
	}
</script>

<slot></slot>