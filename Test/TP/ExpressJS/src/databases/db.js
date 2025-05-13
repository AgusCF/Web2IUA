/*import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Configuración de la conexión a la base de datos
export const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306, // Usa 3306 como predeterminado si no está definido
    database: process.env.DB_NAME,
});

// Función para verificar la conexión
export async function verifyDatabaseConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('✔️ Conexión a la base de datos establecida exitosamente.');
        connection.release(); // Libera la conexión
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error.message);
    }
}

// Llama a la función de verificación al iniciar
verifyDatabaseConnection();

/*
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

// Configuración de la conexión a la base de datos
export const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432, // Usa 5432 como predeterminado si no está definido
    database: process.env.DB_NAME,
    ssl: {
        require: true, // Requerir SSL
    },
});


// Función para verificar la conexión
export async function verifyDatabaseConnection() {
    console.log('user: ', process.env.DB_USER);
    console.log('pass: ', process.env.DB_PASSWORD);
    try {
        const client = await pool.connect();
        console.log('✔️ Conexión a la base de datos establecida exitosamente.');
        client.release(); // Libera la conexión
    } catch (error) {
        console.error('❌ Error al conectar a la base de datos:', error.message);
    }
}

// Llama a la función de verificación al iniciar
verifyDatabaseConnection();
//*/
import pkg from "pg"; // Para manejar el Pool
import dotenv from "dotenv"; // Carga de variables de entorno
import { neon } from "@neondatabase/serverless"; // Conexión a Neon

dotenv.config();

const { Pool } = pkg;

// Configuración del Pool de PostgreSQL
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Usa DATABASE_URL directamente
    ssl: {
        require: true, // Requerir SSL
        rejectUnauthorized: false, // Permitir certificados no verificados (opcional según tu entorno)
    },
});

// Crear conexión con Neon usando el módulo @neondatabase/serverless
export const sql = neon(process.env.DATABASE_URL);

// Función para verificar la conexión al iniciar
export async function verifyDatabaseConnection() {
    try {
        console.log("Verificando conexión con el Pool...");
        const client = await pool.connect(); // Intenta conectar usando el Pool
        console.log("✔️ Conexión al Pool establecida correctamente.");
        client.release(); // Libera el cliente después de la verificación

        console.log("Verificando conexión con Neon (directo)...");
        const result = await sql`SELECT 1 AS test`; // Intenta una consulta básica con Neon
        console.log("✔️ Conexión a Neon establecida correctamente:", result);
    } catch (error) {
        console.error("❌ Error al conectar a la base de datos:", error.message);
        throw error; // Propaga el error para manejo en otros lugares si es necesario
    }
}

// Llama a la función de verificación al iniciar
verifyDatabaseConnection();
