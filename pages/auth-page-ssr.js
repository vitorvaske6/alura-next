import { withSession } from "../src/services/auth/session"

export default function AuthPageSsr(props) {
    return (
        <div>
            <h1>
                Auth Page SSR
            </h1>
            <p>
                <a href="/logout">Logout</a>
            </p>
            <pre>
                {JSON.stringify(props, null, 2)}
            </pre>
        </div>
    )
}

// Decorator Pattern
export const getServerSideProps = withSession((ctx) => {
    return {
        props: {
            session: ctx.req.session
        }
    }
})