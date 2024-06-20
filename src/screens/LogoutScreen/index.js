import { tokenService } from "../../services/auth/tokenService"
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { HttpClient } from "../../infra/HttpClient/HttpClient"

export default function LoggedScreen() {
    const router = useRouter()

    useEffect(async () => {
        try {
            await HttpClient('/api/refresh', {
                method: 'DELETE'
            })
            
            tokenService.delete()
            router.push('/')
        } catch(err) {
            console.log(err)
            alert(err)
        }
    }, [])

    return (
        <div>
            Você será redirecionado em instantes...
        </div>
    );
}
