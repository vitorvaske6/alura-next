import React from 'react';
import { Box, Text, Button } from '../../../theme/components';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import { TextField } from '@skynexui/components';


export default function LoginScreen() {
    const [senha, setSenha] = React.useState('12345');
    const router = useRouter();
    console.log('HomeScreen', router);
    return (
        <Box
            styleSheet={{
                border: '1px solid #F9703E',
                flexDirection: 'column',
                maxWidth: { xs: '100%', sm: '400px' },
                maxHeight: { xs: '100%', sm: '200px' },
                marginTop: '20%',
                marginHorizontal: { xs: '16px', sm: 'auto' },
                padding: '32px',
                borderRadius: '4px',
                boxShadow: '1px 1px 5px 0 rgba(255,69,0,0.2)',
            }}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (senha) {
                        nookies.set(null, 'SENHA_SECRETA', senha, {
                            maxAge: 30 * 24 * 60 * 60,
                            path: '/',
                        });
                        router.push('/logged');
                    } else {
                        alert('Informe uma senha!');
                    }
                }}
            >
                <Box styleSheet={{ flexDirection: 'column' }}>
                    <TextField
                        label="Qual é a senha secreta?"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                    />
                    <Button
                        type='submit'
                    >
                        Acessar
                    </Button>
                </Box>
            </form>
        </Box>
    );
}
