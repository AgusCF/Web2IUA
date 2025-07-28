import bcrypt from 'bcrypt';

// Script para generar contraseñas hasheadas
const passwords = [
    { user: 'Admin', password: 'admin123456' },
    { user: 'Juan Pérez', password: 'password123' },
    { user: 'María García', password: 'password456' },
    { user: 'Carlos López', password: 'password789' },
    { user: 'Ana Martínez', password: 'password012' },
    { user: 'Luis González', password: 'password345' }
];

const saltRounds = 10;

console.log('-- Contraseñas hasheadas para actualizar en la base de datos\n');

for (const item of passwords) {
    const hashedPassword = await bcrypt.hash(item.password, saltRounds);
    console.log(`-- ${item.user} (${item.password})`);
    console.log(`UPDATE Users SET password = '${hashedPassword}' WHERE username = '${item.user}';`);
    console.log('');
}

console.log('-- Verificar actualización');
console.log(`SELECT id, username, email, LEFT(password, 30) as password_preview, role FROM Users ORDER BY id;`);

// También mostrar para el archivo insert_users.sql
console.log('\n-- Para insert_users.sql:');
console.log('INSERT INTO Users (username, email, password, role, tel) VALUES');

for (let i = 0; i < passwords.length; i++) {
    const item = passwords[i];
    const hashedPassword = await bcrypt.hash(item.password, saltRounds);
    const emails = [
        'admin@tecno.com',
        'juan.perez@email.com', 
        'maria.garcia@email.com',
        'carlos.lopez@email.com',
        'ana.martinez@email.com',
        'luis.gonzalez@email.com'
    ];
    const phones = ['1234567890', '1111111111', '2222222222', '3333333333', '4444444444', '5555555555'];
    const roles = ['admin', 'client', 'client', 'client', 'client', 'client'];
    
    const comma = i === passwords.length - 1 ? ';' : ',';
    console.log(`('${item.user}', '${emails[i]}', '${hashedPassword}', '${roles[i]}', '${phones[i]}')${comma}`);
}
