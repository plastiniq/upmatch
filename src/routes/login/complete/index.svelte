<script context="module">
  import * as AuthAPI from '../../../components/api/auth.js'
  import * as sapper from '@sapper/app';

	export async function preload({ params, query }) {
    const resp = await this.fetch(`/api/login/complete?${new URLSearchParams(query)}`, { credentials: 'include' })
    
    if (resp.ok) {
      this.redirect(302, '/')
    } else {
      this.redirect(302, '/login')
    }
	}
</script>