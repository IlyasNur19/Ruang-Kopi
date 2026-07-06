import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SocketProvider } from '../context/SocketContext';
import POSSidebar from '../components/pos/POSSidebar';
import POSLayout from '../components/pos/POSLayout';
import TableMapModal from '../components/pos/TableMapModal';
import CheckoutModal from '../components/pos/CheckoutModal';
import ReceiptTemplate from '../components/pos/ReceiptTemplate';
import useUIStore from '../stores/uiStore';

const POSPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user, loading: authLoading } = useAuth();
    const tableMapOpen = useUIStore((s) => s.posTableMapOpen);
    const checkoutOpen = useUIStore((s) => s.posCheckoutOpen);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#3E2723] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[#6D4C41] text-sm">Memuat POS...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <SocketProvider>
            <div className="h-screen flex bg-[#F5F0EB] overflow-hidden">
                {}
                <POSSidebar />

                {}
                <POSLayout />
            </div>

            {}
            {tableMapOpen && <TableMapModal />}
            {checkoutOpen && <CheckoutModal />}

            {}
            <div className="hidden print:block">
                <ReceiptTemplate />
            </div>
        </SocketProvider>
    );
};

export default POSPage;
