import Link from "../src/components/Link";

export default function Page401() {
    return (
        <div>
            <h1>Você não tem permissão para acessar essa página!</h1>
            <Link href="/">
                Ir para o Home
            </Link>
        </div>
    )
}