import { REFRESH_TOKEN_KEY } from "../../../pages/api/refresh"
import { tokenService } from "../../services/auth/tokenService"
import nookies from 'nookies'

export async function HttpClient(fetchUrl, fetchOptions = {}) {
    const options = {
        ...fetchOptions,
        headers: {
            'Content-Type': 'application/json',
            ...fetchOptions?.headers,
        },
        body: fetchOptions?.body ? JSON.stringify(fetchOptions.body) : null,
    }

    return fetch(fetchUrl, options)
        .then(async (res) => {
            return {
                ok: res.ok,
                status: res.status,
                statusText: res.statusText,
                body: await res.json()
            }
        })
        .then(async (res) => {
            if (!fetchOptions?.refresh) return res
            if (res.status !== 401) return res

            const isServer = Boolean(fetchOptions?.ctx)
            const constCurrentRefreshToken = fetchOptions?.ctx?.req?.cookies[REFRESH_TOKEN_KEY]

            const refreshRes = await HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refresh`, {
                method: isServer ? 'PUT' : 'GET',
                body: isServer && { refresh_token: constCurrentRefreshToken }
            })

            const newAccessToken = refreshRes.body.data.access_token
            const newRefreshToken = refreshRes.body.data.refresh_token

            if (isServer) {
                nookies.set(fetchOptions.ctx, REFRESH_TOKEN_KEY, newRefreshToken, {
                    httpOnly: true,
                    sameSite: 'lax',
                    path: '/',
                })
            }

            tokenService.save(newAccessToken)

            const retryRes = await HttpClient(fetchUrl, {
                ...options,
                refresh: false,
                headers: {
                    'Authorization': `Bearer ${newAccessToken}`
                }
            })

            return retryRes
        })
}