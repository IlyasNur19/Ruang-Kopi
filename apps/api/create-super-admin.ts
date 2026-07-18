import * as dotenv from 'dotenv';
dotenv.config();

import { db } from './src/db/index.js';
import { users } from './src/db/schema.js';
import bcrypt from 'bcryptjs';

async function createSuperAdmin() {
    try {
        const hashedPassword = await bcrypt.hash('owner123', 10);
        
        await db.insert(users).values({
            email: 'owner@ruangkopi.com',
            password: hashedPassword,
            name: 'Owner Ruang Kopi',
            role: 'super_admin'
        });
        
        console.log('Super Admin created successfully!');
        console.log('Email: owner@ruangkopi.com');
        console.log('Password: owner123');
    } catch (error) {
        console.error('Failed to create super admin:', error);
    } finally {
        process.exit(0);
    }
}

createSuperAdmin();
