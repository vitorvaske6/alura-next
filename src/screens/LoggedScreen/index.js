import { redirect } from 'next/dist/server/api-utils';
import { Box, Text, Button } from '../../theme/components';
import { useRouter } from 'next/router';
import nookies from 'nookies';

export async function getServerSideProps(context) {
    const cookies = nookies.get(context)
    const SENHA_SECRETA =  cookies.SENHA_SECRETA
    const senhaInformada = ''
    const isAutorizado = SENHA_SECRETA === senhaInformada;

    if (!isAutorizado) {
        return {
            redirect: {
                permanent: false,
                destination: '/'
            }
        }
    }
}

export default function LoggedScreen(props) {
    const router = useRouter();
    return (
        <Box
            styleSheet={{
                border: '1px solid #F9703E',
                flexDirection: 'column',
                maxWidth: '400px',
                maxHeight: '200px',
                marginTop: '20%',
                marginHorizontal: 'auto',
                padding: '32px',
                borderRadius: '4px',
                boxShadow: '1px 1px 5px 0 rgba(255,69,0,0.2)',
            }}
        >
            <Text styleSheet={{ marginVertical: '32px' }}>
                Você acessou uma área protegida!
            </Text>

            <Button
                onClick={() => {
                    router.push('/auth/login')
                    nookies.destroy(null, 'SENHA_SECRETA');
                }}
                colorVariant='neutral'
                variant='secondary'
            >
                Logout
            </Button>
        </Box>
    );
}
