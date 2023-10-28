import { useState } from 'react';
import Link from '../../src/components/Link'
import { Box, Text, Image } from '../../src/theme/components';
import dados from './dados.json';
import { useRouter } from 'next/router';
import { isEmpty } from '../../src/lib/CustomFunctions';

export async function getServerSideProps() {
    const dadosDaAPI = await fetch(`https://fakeapi-omariosouto.vercel.app/api/posts`).then((res) => res.json())

    return {
        props: { posts: dadosDaAPI.posts },
    };
}

export default function Profile(props) {
    const router = useRouter();
    const infos = {
        nome: 'Vitor Vasconcelos',
        githubUser: 'vitorvaske6',
    }
    const query = router.query

    const posts = isEmpty(query) ? props.posts : props.posts.filter(
        (post, _) => post.date === router.query.date
    )
 
    const [postsPage, setPostsPage] = useState({ start: 0, end: 4 })
    const [pagesFilter, setPagesFilter] = useState({ start: 0, end: 9 })
    const [pages, setPages] = useState(Array.from({ length: parseInt(posts.length / 5) }, (_, i) => i + 1))

    const filteredPosts = posts.filter(
        (post, _) =>
            _ >= postsPage.start && _ <= postsPage.end
    );

    const filteredPages = pages.filter(
        (post, _) =>
            _ >= pagesFilter.start && _ <= pagesFilter.end
    );

    function handlePage(direction = 'back' | 'forward', reset = false) {
        if(direction === 'back') {
            setPagesFilter(prev => ({start: reset ? 0 : prev.start >= 9 ? prev.start - 9 : 0, end: reset ? 9 : prev.start >= 9 ? prev.end - 9: 9 }))
        }
        else if (direction === 'forward') {
            setPagesFilter(prev => ({start: reset ? pages.length-10 : prev.end <= pages.length ? prev.start + 10 : 0, end: reset ? pages.length : prev.end <= pages.length ? prev.end + 10: 10 }))
        }
    }

    function handlePagePosts(page) {
        setPostsPage({start: (page*5)-5, end: (page*5)-1 })
    }

    return (
        <Box
            styleSheet={{
                flexDirection: 'column',
                margin: '32px auto',
                maxWidth: '800px',
                paddingHorizontal: '16px',
            }}
        >
            <Image
                src={`https://github.com/${infos.githubUser}.png`}
                styleSheet={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    margin: '0 auto',
                    border: '2px solid #F9703E',
                }}
            />
            <Text
                variant="heading1"
                tag="h1"
                styleSheet={{ color: '#F9703E', justifyContent: 'center' }}
            >
                {infos.nome}
            </Text>

            <Box styleSheet={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                marginTop: '16px',
                gridGap: '16px',
            }}>
                {filteredPosts.map(({ title, content, id }) => (
                    <Post key={id} title={title} content={content} id={id} />
                ))}
            </Box>
            <Box styleSheet={{
                display: 'flex',
                marginTop: '16px',
                gridGap: '16px',
                maxWidth: '300px'
            }}>
                <Text
                    variant="heading1"
                    tag="p"
                    styleSheet={{ color: '#F9703E', justifyContent: 'center', cursor: 'pointer' }}
                    onClick={() => handlePage('back', false)}
                >
                    {"<<"}
                </Text>
                {pagesFilter.start !== 0 && (
                    <Text
                    variant="heading1"
                    tag="p"
                    styleSheet={{ color: '#F9703E', justifyContent: 'center', cursor: 'pointer' }}
                    onClick={() => handlePage('back', true)}
                >
                    ...
                </Text>
                )}
                {filteredPages.map((pageNum) => (
                    <Text
                        variant="heading1"
                        tag="p"
                        styleSheet={{ color: '#F9703E', justifyContent: 'center', cursor: 'pointer' }}
                        onClick={() => handlePagePosts(pageNum)}
                    >
                        {pageNum}
                    </Text>
                ))}
                {pagesFilter.end !== pages.length && (
                    <Text
                    variant="heading1"
                    tag="p"
                    styleSheet={{ color: '#F9703E', justifyContent: 'center', cursor: 'pointer' }}
                    onClick={() => handlePage('forward', true)}
                >
                    ...
                </Text>
                )}
                <Text
                    variant="heading1"
                    tag="p"
                    styleSheet={{ color: '#F9703E', justifyContent: 'center', cursor: 'pointer' }}
                    onClick={() => handlePage('forward', false)}
                >
                    {">>"}
                </Text>
            </Box>
        </Box>
    )
}

function Post({ title, content, id }) {
    return (
        <Box
            styleSheet={{
                flexDirection: 'column',
                border: '1px solid #F9703E',
                padding: '16px',
                boxShadow: '1px 1px 5px 0 rgba(255,69,0,0.2)',
                transition: '.3s',
                borderRadius: '4px',
                hover: {
                    boxShadow: '1px 1px 5px 5px rgba(255,69,0,0.2)',
                }
            }}
        >
            <Link href={`profile/posts/${id}`} passHref>
                <Text
                    tag="a"
                    variant="heading4"
                    styleSheet={{ display: ' block', color: '#F9703E', marginBottom: '8px' }}
                >
                    {title}
                </Text>
            </Link>
            <Text>
                {content.substring(0, 140)}...
            </Text>
        </Box>
    );
}
