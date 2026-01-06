import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import useLocalStorage from '../../hooks/useLocalStorage';

const MenuManagement = () => {
    // Initial dummy data
    const initialMenu = [
        { id: 1, name: 'Signature Latte', category: 'Coffee', price: '35000', available: true },
        { id: 2, name: 'Arabica Beans', category: 'Retail', price: '120000', available: true },
        { id: 3, name: 'Croissant', category: 'Pastry', price: '25000', available: true },
        { id: 4, name: 'V60 Manual Brew', category: 'Manual Brew', price: '45000', available: true },
    ];

    const [menuItems, setMenuItems] = useLocalStorage('menuItems', initialMenu);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setMenuItems(menuItems.filter(item => item.id !== id));
        }
    };

    return (
        <div className="menu-management">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="content-header"
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Menu Management</h1>
                        <p>Manage your food and beverages.</p>
                    </div>
                    <button className="btn-add" style={{ padding: '0.75rem 1.5rem', backgroundColor: '#3E2723', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} /> Add New Item
                    </button>
                </div>
            </motion.div>

            <div className="dashboard-card" style={{ overflow: 'hidden' }}>
                <table className="menu-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>CATEGORY</th>
                            <th>PRICE</th>
                            <th>STATUS</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map(item => (
                            <tr key={item.id}>
                                <td>#{item.id}</td>
                                <td>
                                    <span style={{ fontWeight: 600, color: '#3E2723' }}>{item.name}</span>
                                </td>
                                <td>
                                    <span className="badge" style={{ backgroundColor: '#EFEBE9', color: '#5D4037' }}>{item.category}</span>
                                </td>
                                <td>Rp {parseInt(item.price).toLocaleString('id-ID')}</td>
                                <td>
                                    <span style={{ color: item.available ? '#4CAF50' : '#EF5350', fontSize: '0.8rem', fontWeight: 600 }}>
                                        {item.available ? 'Active' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td>
                                    <div className="actions">
                                        <button className="btn-icon text-blue"><Edit size={16} /></button>
                                        <button className="btn-icon text-red" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {menuItems.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                        No menu items found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuManagement;
