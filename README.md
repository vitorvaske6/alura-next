# ALURA NEXT
Developed for study purposes.
# 


## Builds
-  Static Build (export and start-static): Commonly used for single page projects with low or no dynamic data. Deployed in certain web services like aws buckets s3.
- Dynamic Build (build and start): Commonly used for complex projects with lots of dynamic data. Deployed in servers with actual machines to process all incoming data.

## Glossário

 - **Static**
    - Por padrão;
    - Só vai usar o `next report`, em casos onde TUDO é pré-renderizado;
    - `getStaticProps`: versão com menos recursos
- **SSG (Static Site Generation)**:
    - `getStaticProps`;
    - `revalidate`: true [`npm run build` && `npm start`];
    - **Incremental Static Generation** [`npm run build` && `npm start`];
    - `fallback`: true || 'blocking' e o `getStaticPaths` vem vazio ou com somente alguns itens.
- **SSR (Server Side Render)**:
    - `getServerSideProps`;
    - Se tiver dentro da pasta /api é uma API Route e é SSR.