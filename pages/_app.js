import Footer from "../src/components/patterns/Footer";
import GlobalStyle from "../src/theme/GlobalStyle";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <GlobalStyle />
            <Component {...pageProps} />
            <Footer />
        </>
    )
}

export default MyApp