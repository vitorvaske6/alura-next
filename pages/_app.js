import Head from "next/head";
import GlobalStyle from "../src/theme/GlobalStyle";
import Script from "next/script";

function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                {/* <!-- Google tag (gtag.js) --> */}
                <Script async src="https://www.googletagmanager.com/gtag/js?id=G-PS8BCB3TFX" />
                <Script dangerouslySetInnerHTML={{
                    __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-PS8BCB3TFX');`
                }} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"true"} />
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet" />
            </Head>
            <GlobalStyle />
            <div style={{
                // marginTop: '70px'
            }}>
                <Component {...pageProps} />
            </div>
        </>
    )
}

export default MyApp