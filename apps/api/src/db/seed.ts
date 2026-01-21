import 'dotenv/config';
import { db } from './index.js';
import { categories, menuItems, galleryImages, users, shopSettings } from './schema.js';
import bcrypt from 'bcryptjs';

async function seed() {
    console.log('🌱 Seeding database...');

    // Seed categories
    console.log('📁 Seeding categories...');
    const categoryData = [
        { name: 'Kopi', slug: 'kopi' },
        { name: 'Non-Kopi', slug: 'non-kopi' },
        { name: 'Manual Brew', slug: 'manual-brew' },
        { name: 'Makanan', slug: 'makanan' },
    ];

    for (const category of categoryData) {
        await db.insert(categories).values(category).onConflictDoNothing();
    }

    // Seed menu items
    console.log('☕ Seeding menu items...');
    const menuData = [
        { name: 'Espresso', price: 25000, categoryId: 1, description: 'Rich, full-bodied shot of pure Arabica goodness.', image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80', available: true },
        { name: 'Cappuccino', price: 30000, categoryId: 1, description: 'Perfect balance of espresso, steamed milk and foam.', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80', available: true },
        { name: 'Cold Brew', price: 30000, categoryId: 1, description: 'Slow-steeped for 12 hours for a smooth, less acidic taste.', image: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7dd9b?auto=format&fit=crop&q=80', available: true },
        { name: 'V60 Manual Brew', price: 35000, categoryId: 3, description: 'Clean, bright, and floral notes from our single origin selection.', image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80', available: true },
        { name: 'Matcha Latte', price: 32000, categoryId: 2, description: 'Premium Japanese matcha whisked with steamed milk.', image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3114?auto=format&fit=crop&q=80', available: true },
        { name: 'Lychee Tea', price: 28000, categoryId: 2, description: 'Refreshing black tea with sweet lychee fruit essence.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80', available: true },
        { name: 'Butter Croissant', price: 28000, categoryId: 4, description: 'Flaky, buttery, and freshly baked every morning.', image: 'https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&q=80', available: true },
        { name: 'Pain au Chocolat', price: 30000, categoryId: 4, description: 'Classic French pastry filled with rich dark chocolate.', image: 'https://images.unsplash.com/photo-1509365390695-33aee754301f?auto=format&fit=crop&q=80', available: true },
    ];

    for (const item of menuData) {
        await db.insert(menuItems).values(item).onConflictDoNothing();
    }

    // Seed gallery images
    console.log('🖼️ Seeding gallery images...');
    const galleryData = [
        { src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80', category: 'Coffee', span: 'row-span-2', order: 1 },
        { src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80', category: 'Latte Art', span: null, order: 2 },
        { src: 'https://images.unsplash.com/photo-1442512595367-4273250913a9?auto=format&fit=crop&q=80', category: 'Interior', span: null, order: 3 },
        { src: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80', category: 'Atmosphere', span: 'col-span-2', order: 4 },
        { src: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80', category: 'Interior', span: null, order: 5 },
        { src: 'https://images.unsplash.com/photo-1517701604599-bb29b5c7dd9b?auto=format&fit=crop&q=80', category: 'Cold Brew', span: null, order: 6 },
        { src: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&q=80', category: 'Manual Brew', span: 'row-span-2', order: 7 },
        { src: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80', category: 'Cappuccino', span: null, order: 8 },
        { src: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3114?auto=format&fit=crop&q=80', category: 'Matcha', span: null, order: 9 },
    ];

    for (const image of galleryData) {
        await db.insert(galleryImages).values(image).onConflictDoNothing();
    }

    // Seed admin user
    console.log('👤 Seeding admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({
        email: 'admin@ruangkopi.com',
        password: hashedPassword,
        name: 'Admin Barista',
        role: 'admin',
    }).onConflictDoNothing();

    // Seed shop settings
    console.log('⚙️ Seeding shop settings...');
    await db.insert(shopSettings).values({
        key: 'status',
        value: 'available',
    }).onConflictDoNothing();

    console.log('✅ Database seeded successfully!');
    console.log('\n📧 Admin credentials:');
    console.log('   Email: admin@ruangkopi.com');
    console.log('   Password: admin123');
}

seed().catch(console.error);
