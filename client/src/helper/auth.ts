import Axios from 'axios'

const token_key = 'storageVide_token'


export const setToken = (token: string) => {

	localStorage.setItem(token_key, token)
}

export const getToken = () => {

	return localStorage.getItem(token_key)
}

export const deletToken = () => {

	localStorage.removeItem(token_key)
}

export const initAxiosInterceptors = () => {

	Axios.interceptors.request.use((config) => {

		const token = getToken()

		if (token) {

			config.headers.Authorization = `bearer ${token}`
		}

		return config
	})

	Axios.interceptors.response.use(
		(response) => response,
		(err) => {

			if (err.status === 401) {

				deletToken()
				window.location.href = '/login'
			} else {

				return Promise.reject(err)
			}
		})
}