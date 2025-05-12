const { Pool } = require("pg"); // Para manejar el Pool
const dotenv = require("dotenv"); // Carga de variables de entorno
const { neon } = require("@neondatabase/serverless"); // Conexión a Neon

dotenv.config();

// Configuración del Pool de PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Usa DATABASE_URL directamente
    ssl: {
        require: true, // Requerir SSL
        rejectUnauthorized: false, // Permitir certificados no verificados (opcional según tu entorno)
    },
});

// Crear conexión con Neon usando el módulo @neondatabase/serverless
const sql = neon(process.env.DATABASE_URL);

// Función para verificar la conexión al iniciar
async function verifyDatabaseConnection() {
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

module.exports = { pool, sql, verifyDatabaseConnection };