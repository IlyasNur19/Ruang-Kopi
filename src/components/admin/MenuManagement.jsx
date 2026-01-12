import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

const MenuManagement = () => {
    // Initial dummy data
    const initialMenu = [
        { id: 1, name: 'Signature Latte', category: 'Coffee', price: '35000', available: true },
        { id: 2, name: 'Arabica Beans', category: 'Retail', price: '120000', available: true },
        { id: 3, name: 'Croissant', category: 'Pastry', price: '25000', available: true },
        { id: 4, name: 'V60 Manual Brew', category: 'Manual Brew', price: '45000', available: true },
    ];

    const [menuItems, setMenuItems] = useLocalStorage('menuItems', initialMenu);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            setMenuItems(menuItems.filter(item => item.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="font-heading text-3xl font-bold text-[#3E2723] mb-2">Menu Management</h1>
                    <p className="text-muted-foreground">Manage your food and beverages.</p>
                </div>
                <Button className="bg-[#3E2723] hover:bg-[#2D2420]">
                    <Plus size={18} className="mr-2" /> Add New Item
                </Button>
            </motion.div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>NAME</TableHead>
                                <TableHead>CATEGORY</TableHead>
                                <TableHead>PRICE</TableHead>
                                <TableHead>STATUS</TableHead>
                                <TableHead className="text-right">ACTIONS</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {menuItems.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">#{item.id}</TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-[#3E2723]">{item.name}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-[#EFEBE9] text-[#5D4037] hover:bg-[#D7CCC8]">
                                            {item.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>Rp {parseInt(item.price).toLocaleString('id-ID')}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.available ? "default" : "destructive"} className={item.available ? "bg-green-100 text-green-700 hover:bg-green-200" : ""}>
                                            {item.available ? 'Active' : 'Out of Stock'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                                                <Edit size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(item.id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {menuItems.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            No menu items found.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MenuManagement;
