module.exports = {
    trailingSlash: true,
    async redirects() {
        return [
            {
                source: '/about',
                destination: '/',
                permanent: true,
            },
            {
                source: '/perguntas',
                destination: '/faq',
                permanent: true,
            }
        ]
    }
}