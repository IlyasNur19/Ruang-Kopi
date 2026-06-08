import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = ({ phoneNumber = "6281234567890", message = "Halo, saya ingin bertanya tentang Ruang Kopi" }) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-10 right-10 z-50 size-16 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group"
            aria-label="Chat via WhatsApp"
        >
            <MessageCircle size={32} className="group-hover:scale-110 transition-transform" />
        </a>
    );
};

export default WhatsAppButton;
