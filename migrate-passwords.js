// migrate-passwords.js
import { pool } from './src/databases/dbTecno.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function migratePasswords() {
  let client;
  try {
    console.log('🔐 Iniciando migración de contraseñas...');
    
    // Obtener conexión del pool
    client = await pool.connect();
    
    // Obtener todos los usuarios
    const result = await client.query('SELECT id, password, email FROM users');
    const users = result.rows;
    
    console.log(`📊 Encontrados ${users.length} usuarios`);
    
    let migratedCount = 0;
    let alreadyHashedCount = 0;
    
    for (const user of users) {
      // Verificar si la contraseña ya está encriptada (formato bcrypt)
      if (user.password.startsWith('$2a$') || 
          user.password.startsWith('$2b$') || 
          user.password.startsWith('$2y$')) {
        console.log(`✅ Usuario ${user.email} (ID: ${user.id}) ya tiene contraseña encriptada`);
        alreadyHashedCount++;
        continue;
      }
      
      // Encriptar contraseña en texto plano
      console.log(`🔄 Encriptando contraseña para usuario: ${user.email} (ID: ${user.id})`);
      
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Actualizar en la base de datos
      await client.query(
        'UPDATE users SET password = $1, updatedat = NOW() WHERE id = $2',
        [hashedPassword, user.id]
      );
      
      console.log(`✅ Contraseña migrada para: ${user.email}`);
      migratedCount++;
    }
    
    console.log('\n📋 Resumen de migración:');
    console.log(`✅ Contraseñas migradas: ${migratedCount}`);
    console.log(`🔒 Ya estaban encriptadas: ${alreadyHashedCount}`);
    console.log(`📊 Total usuarios procesados: ${users.length}`);
    
  } catch (error) {
    console.error('❌ Error en la migración:', error);
  } finally {
    // Liberar la conexión
    if (client) {
      client.release();
    }
    // Cerrar el pool de conexiones
    await pool.end();
    console.log('🚪 Conexión cerrada');
  }
}

// Ejecutar la migración
migratePasswords();