import { writable } from 'svelte/store'

export const me = writable(0)
export const errors = writable([])