import Head from "next/head";
import Link from "../src/components/Link";
import Footer from "../src/components/patterns/Footer";
import PageTitle from "../src/components/PageTitle";
// faq.js
import FAQScreen from '../src/screens/FAQScreen/index';

export default FAQScreen; 

// SSG - Static Site Generation
// SSR - Server Side Rendering 
// ISG - Incremental Static Generation

// roda a cada acesso
// export async function getServerSideProps() 

// roda a cada build ou a cada acesso em modo dev
export async function getStaticProps() {
    return {
        props: {
            faq: await fetch('https://gist.githubusercontent.com/omariosouto/0ceab54bdd8182cbd1a4549d32945c1a/raw/578ad1e8e5296fa048e3e7ff6b317f7497b31ad9/alura-cases-faq.json').then((res) => {
                return res.json()
            })
        }
    }
}


