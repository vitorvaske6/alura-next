import Link from '../../../../src/components/Link'
import { Box, Text } from '../../../../src/theme/components';
import { useRouter } from 'next/router';

// dica dos paths estáticos
export async function getStaticPaths() {
    // const dadosDaAPI = await fetch(`https://fakeapi-omariosouto.vercel.app/api/posts`).then((res) => res.json())

    // const paths = dadosDaAPI.posts.map((postAtual) => {
    //     return { params: { id: `${postAtual.id}` } }; 
    // })

    return {
        // paths: paths,
        paths: [],
        // 'blocking' -> static incremental - generation ao gerar a página, a mantém em cache para a próxima requisição
        // false -> dynamic generation - sempre gera a página depois do build
        // true -> static generation - sempre gera a página no build
        fallback: 'blocking' 
    };
}

export async function getStaticProps(context) {
    const id = context.params.id;
    const dadosDaAPI = await fetch(`https://fakeapi-omariosouto.vercel.app/api/posts/${id}`).then((res) => res.json())

    const post = dadosDaAPI
    
    console.log(post)

    return {
        props: {
            id: post.id,
            title: post.title,
            date: post.date,
            content: post.content,
            video: post.video,
        },
        // apenas atualiza os dados a cada N segundos
        revalidate: 60
    }
}

export default function PostByIdScreen(props) {
    const router = useRouter();
    // console.log(router);
    const post = {
        title: props.title,
        date: props.date,
        content: props.content,
        video: props.video,
    };

    if (router.isFallback) {
        return 'Essa página ainda não existe!';
    }

    return (
        <Box
            styleSheet={{
                flexDirection: 'column',
                margin: '32px auto',
                maxWidth: '700px',
                paddingHorizontal: '16px',
            }}
        >
            {/* Cabeçalho */}
            <Text
                variant="heading2"
                tag="h1"
                styleSheet={{ color: '#F9703E', justifyContent: 'center', lineHeight: '1.2' }}
            >
                {post.title}
            </Text>
            <Text styleSheet={{ color: '#F9703E', justifyContent: 'center', borderBottom: '1px solid #F9703E', paddingVertical: '16px', marginVertical: '16px' }}>
                {post.date}
            </Text>

            {/* Área de Conteudo */}
            <Box
                styleSheet={{
                    flexDirection: 'column',
                }}
            >
                <Text>
                    {post.content}
                </Text>

                {post.video && <iframe style={{ marginTop: '32px', minHeight: '400px', width: '100%' }} src={post.video} />}
            </Box>


            {/* Rodapé */}
            <Box
                styleSheet={{
                    marginTop: '16px',
                    paddingVertical: '16px',
                    borderTop: '1px solid #F9703E',
                    color: '#F9703E',
                    display: 'grid'
                }}
            >
                <Link href="/profile">
                    <Text tag="a" styleSheet={{ hover: { textDecoration: 'underline' } }}>
                        Voltar para o perfil
                    </Text>
                </Link>
                <Link href="/">
                    <Text tag="a" styleSheet={{ hover: { textDecoration: 'underline' } }}>
                        Voltar para a home
                    </Text>
                </Link>
            </Box>
        </Box>
    )
}
