import jwt from 'jsonwebtoken';
import { getTokenFromHeaders } from '../../utils/getTokenFromHeaders';
import { HttpClient } from '../../infre/HttpClient/HttpClient'
import { tokenService } from './tokenService';

const ACCESSTOKEN_SECRET = process.env.ACCESSTOKEN_SECRET;
const ACCESSTOKEN_EXPIRATION = '60s';
const REFRESHTOKEN_SECRET = process.env.REFRESHTOKEN_SECRET;
const REFRESHTOKEN_EXPIRATION = '7d';


export const authService = {
    async login({ username, password }) {
        return await HttpClient('/api/login', {
            method: 'POST',
            body: { username, password }
        })
        .then(async (res) =>{
            if(!res.ok) throw new Error(`Usuário ou senha inválida!`)
            const body = res.body
            console.log(body)
            tokenService.save(body.data.access_token)
            return body
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
    }
}
