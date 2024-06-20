import jwt from 'jsonwebtoken';
import { getTokenFromHeaders } from '../../utils/getTokenFromHeaders';
import { HttpClient } from '../../infra/HttpClient/HttpClient'
import { ACCESS_TOKEN_KEY, tokenService } from './tokenService';
import nookies from 'nookies'
import { REFRESH_TOKEN_NAME } from '../../../pages/api/refresh';

const ACCESSTOKEN_SECRET = process.env.ACCESSTOKEN_SECRET;
const ACCESSTOKEN_EXPIRATION = '1d';
const REFRESHTOKEN_SECRET = process.env.REFRESHTOKEN_SECRET;
const REFRESHTOKEN_EXPIRATION = '7d';

export const authService = {
    async login({ username, password }) {
        return await HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`, {
            method: 'POST',
            body: { username, password }
        })
            .then(async (res) => {
                if (!res.ok) throw new Error(`Usuário ou senha inválida!`)
                const body = res.body
                tokenService.save(body.data)

                return body
            })
            .then(async ({ data }) => {
                const { refresh_token } = data;
                const response = await HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refresh`, {
                    method: 'POST',
                    body: {
                        refresh_token
                    }
                })
            })
    },
    async generateAccessToken(userId) {
        return await jwt.sign(
            { roles: ['user'] },
            ACCESSTOKEN_SECRET,
            { subject: userId, expiresIn: ACCESSTOKEN_EXPIRATION }
        );
    },
    async validateAccessToken(accessToken) {
        return await jwt.verify(accessToken, ACCESSTOKEN_SECRET);
    },
    async isAuthenticated(req) {
        const token = getTokenFromHeaders(req);

        try {
            await authService.validateAccessToken(token);
            return true;
        } catch (err) {
            return false;
        }
    },
    async generateRefreshToken(userId) {
        return await jwt.sign(
            {},
            REFRESHTOKEN_SECRET,
            { subject: userId, expiresIn: REFRESHTOKEN_EXPIRATION }
        );
    },
    async validateRefreshToken(refreshToken) {
        return await jwt.verify(refreshToken, REFRESHTOKEN_SECRET);
    },
    async decodeToken(token) {
        return await jwt.decode(token);
    },
    async getSession(ctx = null) {
        const token = tokenService.get(ctx)

        return await HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/session`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token[ACCESS_TOKEN_KEY]}`
            },
            ctx,
            refresh: true,
        }).then((res) => {
            if (!res.ok) throw new Error(`Unauthorized`)
            return res.body.data
        })
    }
}
