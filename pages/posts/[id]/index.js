import { useRouter } from "next/router"
import Link from "../../../src/components/Link";

export default function Post() {
    const router = useRouter();

    return (
        <div>
            Post com id: {router.query.id}
            <br />
            <ul>
                <li>
                    <Link href="/">
                        Ir para a home
                    </Link>
                </li>
                <li>
                    <Link href={`/posts/${router.query.id}/comentarios`}>
                        Ir para os comentários
                    </Link>
                </li>
            </ul>
        </div>
    )
}