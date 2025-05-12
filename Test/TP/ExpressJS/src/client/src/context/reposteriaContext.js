import React, { useState, useEffect, createContext } from 'react';
import { jwtDecode } from "jwt-decode";
const reposteriaContext = createContext([{} , () => {}]);


const ReposteriaProvider = props => {

    // Definiendo State inicial
    const [auth, setAuth] = useState({
        token: '',
        auth: false,
        user: {
            role: 'client',
            name: null,
            phoneNumber: null,
        }
    });
    //! Intento de Solucion al problema de refresh 
    useEffect(() => {
        const token = localStorage.getItem('token');
    
        if (token) {
            const decodedToken = jwtDecode(token);
            const { role, name, phoneNumber } = decodedToken;
            setAuth({
                token,
                auth: true,
                user: {
                    role,
                    name,
                    phoneNumber,
                }
            });
        }

    }, []);
};
export { reposteriaContext, ReposteriaProvider};