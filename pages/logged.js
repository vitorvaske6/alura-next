import LoggedScreen from "../src/screens/LoggedScreen";
import nookies from 'nookies';

export default LoggedScreen

export async function getServerSideProps(context) {
    const cookies = nookies.get(context);
    console.log('Cookies', cookies);
    const SENHA_SECRETA = '123456';
    const senhaInformadaPeloUsuario = cookies.SENHA_SECRETA;
    const isAutorizado = SENHA_SECRETA === senhaInformadaPeloUsuario;

    if (!isAutorizado) {
        console.log('NÃO Autorizado!!!');
        return {
            redirect: {
                permanent: false,
                destination: '/?status=401',
            }
        };
    }

    console.log('Autorizado!!!');
    return {
        props: {}
    }
}