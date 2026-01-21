import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const Reservation = () => {
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        time: '',
        guests: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, date, time, guests } = formData;
        const phone = '6281234567890'; // Replace with actual number
        const message = `Halo RuangKopi, saya ingin reservasi.%0A%0ANama: ${name}%0ATanggal: ${date}%0AJam: ${time}%0AJumlah: ${guests} orang%0A%0AMohon konfirmasinya. Terima kasih.`;

        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    };

    return (
        <section id="reservation" className="py-32 bg-primary text-white bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto bg-white p-6 md:p-12 rounded-3xl text-foreground shadow-2xl"
                >
                    <div className="text-center mb-8">
                        <h2 className="font-heading text-4xl text-primary mb-2 font-bold">Reservasi Meja</h2>
                        <p className="text-muted-foreground">Amankan tempat favoritmu untuk momen terbaik.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-primary">Nama Lengkap</label>
                            <input
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                type="text"
                                name="name"
                                placeholder="Masukkan namamu"
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-primary">Tanggal</label>
                                <input
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                    type="date"
                                    name="date"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-primary">Jam</label>
                                <input
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                    type="time"
                                    name="time"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-primary">Jumlah Orang</label>
                            <input
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                                type="number"
                                name="guests"
                                min="1"
                                placeholder="2"
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="mt-4 w-full py-4 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all hover:bg-accent hover:-translate-y-0.5 hover:shadow-lg">
                            <span>Pesan via WhatsApp</span>
                            <Send size={18} />
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Reservation;
