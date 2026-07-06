import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import useCartStore from '../../stores/cartStore';
import useUIStore from '../../stores/uiStore';
import POSTopBar from './POSTopBar';
import MenuPanel from './MenuPanel';
import CartPanel from './CartPanel';
import ReservationManagement from '../admin/ReservationManagement';
import POSDashboard from './POSDashboard';

const POSLayout = () => {
    const [mobileCartOpen, setMobileCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const itemCount = useCartStore((s) => s.getItemCount);
    const activeView = useUIStore((s) => s.posActiveView);

    if (activeView === 'reservation') {
        return (
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-[#F5F0EB] p-6">
                    <ReservationManagement />
                </div>
            </div>
        );
    }

    if (activeView === 'dashboard') {
        return (
            <div className="flex-1 flex flex-col overflow-hidden">
                <POSDashboard />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            {}
            <POSTopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            {}
            <div className="flex-1 flex overflow-hidden">
                {}
                <div className="flex-1 h-full overflow-hidden">
                    <MenuPanel searchQuery={searchQuery} />
                </div>

                {}
                <div className="hidden lg:flex w-[340px] xl:w-[380px] h-full overflow-hidden border-l border-[#3E2723]/5 shrink-0">
                    <CartPanel />
                </div>

                {}
                <div className="lg:hidden">
                    <Sheet open={mobileCartOpen} onOpenChange={setMobileCartOpen}>
                        <SheetTrigger asChild>
                            <button className="fixed bottom-6 right-6 z-30 w-16 h-16 rounded-full bg-[#3E2723] text-white shadow-xl flex items-center justify-center hover:bg-[#4E342E] transition-all active:scale-95">
                                <ShoppingCart size={24} />
                                {itemCount() > 0 && (
                                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                                        {itemCount()}
                                    </span>
                                )}
                            </button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl p-0">
                            <SheetHeader className="px-4 pt-4 pb-0">
                                <SheetTitle>Keranjang Pesanan</SheetTitle>
                            </SheetHeader>
                            <div className="h-full overflow-hidden">
                                <CartPanel />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    );
};

export default POSLayout;
