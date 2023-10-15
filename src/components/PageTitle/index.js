import Head from "next/link"

export default function PageTitle({children}) {
    return (
        <Head href={href} passHref>
            <title>{children}</title>
        </Head>
    )
}