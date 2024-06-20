import { useRouter } from "next/router"
import { authService } from "./authService"
import { useEffect, useState } from "react"

export function withSession(_function) {
    return async (ctx) => {
        try {
            const session = await authService.getSession(ctx)

            return _function({
                ...ctx,
                req: {
                    ...ctx.req,
                    session,
                }
            })
        } catch (err) {
            return {
                redirect: {
                    permanent: false,
                    destination: '/401'
                }
            }
        }
    }
}

function useSession() {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        authService.getSession()
            .then((session) => {
                setSession(session)
            })
            .catch((err) => {
                setError(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])


    return {
        data: { session },
        error,
        loading
    }

}
// High Order Component
export function withSessionHOC(Component) {
    return function Wrapper(props) {
        const session = useSession()
        const router = useRouter()

        if (!session.loading && session.error) {
            router.push('/401')
        }

        const _props = {
            ...props,
            session: session.data.session
        }

        return (
            <Component {..._props} />
        )
    }
}