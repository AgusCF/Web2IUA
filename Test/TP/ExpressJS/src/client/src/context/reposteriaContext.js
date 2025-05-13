import React, { useState, useEffect, createContext } from 'react';
import usuarioAxios from '../config/axio.js';
import { jwtDecode } from "jwt-decode";
const reposteriaContext = createContext([{}, () => {}]);

const ReposteriaProvider = props => {

    // Definiendo State inicial
    const [auth, setAuth] = useState({
        token: '',
        auth: false,
        user: {
            departmentLetter: null,
            role: 'client',
            name: null,
            tel: null,
            email: null,
            floorNumber: null,
            //role: 'client',
            // Otros campos del usuario
        }
    });

    //! Intento de Solucion al problema de refresh 
    useEffect(() => {
        const token = localStorage.getItem('token');
    
        //console.log('token', token);
        //console.log('auth', auth);
        if (token) {
            const decodedToken = jwtDecode(token);
            //console.log('depto', decodedToken)
            const { role, departmentLetter, name, tel, email, floorNumber } = decodedToken;
            setAuth({
                token,
                auth: true,
                user: {
                    departmentLetter,
                    role,
                    name,
                    email,
                    tel,
                    floorNumber,
                }
            });
        }

    }, []);
    
    return (
        <reposteriaContext.Provider value={[auth, setAuth]}>
            {props.children}
        </reposteriaContext.Provider>
    );

};
export { reposteriaContext, ReposteriaProvider };