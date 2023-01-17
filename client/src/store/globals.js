import { readable, writable } from "svelte/store";

export const BASE_URL = readable("http://localhost:8080")
export const IS_LOGGED_IN = writable(false)
export const IS_ADMIN = writable(false)
export const socket = writable()
