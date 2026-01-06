import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import '../styles/Reservation.css';

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
        <section id="reservation" className="reservation-section">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="reservation-wrapper"
                >
                    <div className="reservation-header">
                        <h2 className="reservation-title">Reservasi Meja</h2>
                        <p className="reservation-desc">Amankan tempat favoritmu untuk momen terbaik.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="reservation-form">
                        <div className="form-group">
                            <label>Nama Lengkap</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Masukkan namamu"
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Tanggal</label>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Jam</label>
                                <input
                                    type="time"
                                    name="time"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Jumlah Orang</label>
                            <input
                                type="number"
                                name="guests"
                                min="1"
                                placeholder="2"
                                required
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="btn-submit">
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
