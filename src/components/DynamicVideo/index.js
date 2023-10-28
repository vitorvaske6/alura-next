
export default function YoutubeVideo({style, src}) {

    return (
        <iframe style={{...style}} src={src} />
    )
}