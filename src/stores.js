import { writable } from 'svelte/store'

export const me = writable(null)
export const errors = writable([])