import LoggedScreenStatic from "../src/screens/LoggedScreenStatic";

export default LoggedScreenStatic


export function getStaticProps(ctx) {
    const SENHA_MESTRE = '123456';
    const cookies = nookies.get(ctx);

    // Cookies NÃO existem em build time
    // console.log('[static] Cookies', cookies);

    return {
        props: {},
    }
}
