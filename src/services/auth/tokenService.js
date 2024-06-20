import nookies from 'nookies'
import { REFRESH_TOKEN_KEY } from '../../../pages/api/refresh'

export const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY'

const ONE_SECOND = 1
const ONE_MINUTE = ONE_SECOND * 60
const ONE_HOUR = ONE_MINUTE * 60
const ONE_DAY = ONE_HOUR * 24
const ONE_MONTH = ONE_DAY * 30
const ONE_YEAR = ONE_MONTH * 12

export const tokenService = {
    save({ access_token, refresh_token }, ctx = null) {
        globalThis?.localStorage?.setItem(ACCESS_TOKEN_KEY, access_token)
        globalThis?.sessionStorage?.setItem(ACCESS_TOKEN_KEY, access_token)
        nookies.set(ctx, ACCESS_TOKEN_KEY, access_token, {
            maxAge: ONE_MINUTE,
            path: '/'
        })
        globalThis?.localStorage?.setItem(REFRESH_TOKEN_KEY, refresh_token)
        globalThis?.sessionStorage?.setItem(REFRESH_TOKEN_KEY, refresh_token)
        nookies.set(ctx, REFRESH_TOKEN_KEY, refresh_token, {
            maxAge: ONE_MINUTE,
            path: '/'
        })
    },
    get(ctx = null) {
        const cookies = nookies.get(ctx)
        return cookies || {} //[ACCESS_TOKEN_KEY] || ''
        // return localStorage.getItem(ACCESS_TOKEN_KEY)
        // return globalThis?.sessionStorage?.getItem(ACCESS_TOKEN_KEY)
    },
    delete(ctx = null) {
        globalThis?.localStorage?.removeItem(ACCESS_TOKEN_KEY)
        globalThis?.sessionStorage?.removeItem(ACCESS_TOKEN_KEY)
        nookies.destroy(ctx, ACCESS_TOKEN_KEY)
    }
}