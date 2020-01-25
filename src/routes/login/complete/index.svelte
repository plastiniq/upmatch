<script context="module">
  import * as sapper from '@sapper/app';

  let error
  let response

	export async function preload({ params, query }) {
    const resp = await this.fetch(`/api/login/complete?${new URLSearchParams(query)}`, { credentials: 'include' })

    let json = await resp.json()
    response = JSON.stringify(json)

    if (resp.ok) {
      this.redirect(302, '/')
    } else {
      error = JSON.stringify(resp)
    }
	}
</script>

<div>
<div></div>
</div>