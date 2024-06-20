import { db } from '../../../data/db';
import { HttpClient } from '../../../src/infra/HttpClient/HttpClient';
import { authService } from '../../../src/services/auth/authService';
import nookies from 'nookies'
import { tokenService } from '../../../src/services/auth/tokenService';

export const REFRESH_TOKEN_KEY = "REFRESH_TOKEN_KEY"

const controllers = {
    async refreshTokens(req, res) {
        const { access_token, refresh_token } = req.body;

        try {
            const { sub } = await authService.validateRefreshToken(refresh_token);

            db.users.findOne({ _id: sub, refresh_token }, async function (err, user) {
                if (err) return res.status(500).json({ error: { status: 500, message: 'Internal server error', } });

                if (!user?._id) {
                    return res.status(401).json({
                        error: {
                            status: 401,
                            message: 'Invalid refresh token, please login again.',
                        }
                    });
                }

                const tokens = {
                    access_token: await authService.generateAccessToken(sub),
                    refresh_token: await authService.generateRefreshToken(sub),
                };

                db.users.update({ _id: sub }, { $set: { refresh_token: tokens.refresh_token } }, function (err) {
                    if (err) throw new Error('Not avaiable to set refresh token');

                    return res.status(200).json({
                        data: tokens,
                    });
                });
            });
        } catch (err) {
            // console.log(err)
            return res.status(401).json({
                error: {
                    status: 401,
                    message: 'Invalid refresh token, please login again.',
                }
            });
        }
    },
    async storeRefreshTokens(req, res) {
        const { refresh_token } = req.body;
        const ctx = { req, res }

        nookies.set(ctx, REFRESH_TOKEN_KEY, refresh_token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/'
        })

        res.json({
            data: {
                ok: true,
                status: 200,
                message: 'Stored with success'
            }
        })
    },
    async displayCookies(req, res) {
        const ctx = { req, res }
        res.json({
            data: {
                cookies: nookies.get(ctx)
            }
        })
    },
    async regenerateTokens(req, res) {
        const ctx = { req, res }
        const cookies = nookies.get(ctx);
        const refresh_token = cookies[REFRESH_TOKEN_KEY] || req.body.refresh_token;

        const refreshRes = await HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refresh`, {
            method: 'POST',
            body: {
                refresh_token
            }
        })

        if (refreshRes.ok) {
            nookies.set(ctx, REFRESH_TOKEN_KEY, refreshRes.body.data.refresh_token, {
                httpOnly: true,
                sameSite: 'lax',
                path: '/'
            })

            tokenService.save(refreshRes.body.data.refresh_token, ctx)

            res.status(200).json({
                data: refreshRes.body.data
            })

        } else {
            res.json({
                status: 401,
                message: 'Unauthorized'
            })
        }
    },
    async deleteToken(req, res) {
        const ctx = { req, res }

        nookies.destroy(ctx, REFRESH_TOKEN_KEY, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/'
        })

        res.json({
            status: 200,
            message: 'Deleted successfully'
        })
    },
}

const controllerBy = {
    POST: controllers.refreshTokens,
    GET: controllers.regenerateTokens,
    PUT: controllers.regenerateTokens,
    DELETE: controllers.deleteToken,
}

/**
 * @swagger
 * /api/refresh:
 *   post:
 *     summary: Regenerate the user tokens
 *     requestBody:
 *        content:
 *          application/json:
 *             schema:
 *                properties: 
 *                   refresh_token:
 *                      type: string
 *                      default: omariosouto
 *                      description: You have to login first to get a refresh token
 *     responses:
 *       200:
 *         description: You refresh token is valid, you can refresh it.
 *       401:
 *         description: You are not authorized, refresh token invalid
 */
export default function handle(req, res) {
    if (controllerBy[req.method]) return controllerBy[req.method](req, res);

    res.status(404).json({
        status: 404,
        message: 'Not Found'
    });
}
