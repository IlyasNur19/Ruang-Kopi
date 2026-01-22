import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Coffee, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ideasApi } from '../services/api';
import { useMutation } from '../hooks/useApi';

const KotakGagasanPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        topic: 'Soal Rasa',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const { mutate: createIdea, loading, error, reset } = useMutation(ideasApi.create);

    const topics = ['Soal Rasa', 'Suasana Ruang', 'Pelayanan', 'Ide Baru'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTopicSelect = (topic) => {
        setFormData(prev => ({ ...prev, topic }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createIdea({
                name: formData.name,
                contact: formData.contact || undefined,
                topic: formData.topic,
                message: formData.message,
            });
            setSubmitted(true);
        } catch (err) {
            console.error('Failed to submit idea:', err);
        }
    };

    const handleReset = () => {
        setSubmitted(false);
        reset();
        setFormData({
            name: '',
            contact: '',
            topic: 'Soal Rasa',
            message: ''
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F5F2]">
            <Navbar />
            <main className="flex-grow flex items-center justify-center py-24 px-4">
                <div className="w-full max-w-2xl">
                    {/* Success State */}
                    {submitted && !error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 bg-[#8D6E63]/10 rounded-full flex items-center justify-center">
                                <Coffee size={40} className="text-[#8D6E63]" />
                            </div>
                            <div className="flex items-center justify-center gap-2 text-[#8D6E63] mb-4">
                                <CheckCircle size={18} />
                                <span className="text-sm font-medium uppercase tracking-widest">Gagasan Terkirim</span>
                            </div>
                            <h1 className="font-['Baskervville'] text-5xl md:text-6xl text-[#3E2723] mb-6 italic">
                                Terima kasih!
                            </h1>
                            <p className="text-[#6D4C41] max-w-md mx-auto mb-10 leading-relaxed">
                                Gagasanmu sudah tersimpan di ruang kami. Mari terus berkolaborasi dan merajut cerita bersama. Kami akan meninjau setiap ide dengan penuh apresiasi.
                            </p>
                            <img
                                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400"
                                alt="Coffee cup"
                                className="w-72 h-48 object-cover rounded-2xl mx-auto mb-10 shadow-lg"
                            />
                            <div className="flex flex-col items-center gap-4">
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#8D6E63] text-white rounded-full font-bold hover:bg-[#6D4C41] transition-colors"
                                >
                                    Kembali ke Beranda
                                </Link>
                                <button
                                    onClick={handleReset}
                                    className="text-[#8D6E63] hover:underline text-sm"
                                >
                                    Kirim Gagasan Lainnya
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Error State */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-4xl">😔</span>
                            </div>
                            <h1 className="font-heading text-3xl text-[#3E2723] mb-4 font-bold">
                                Gagal Mengirim
                            </h1>
                            <p className="text-red-500 mb-6">{error}</p>
                            <button
                                onClick={handleReset}
                                className="px-8 py-3 bg-[#3E2723] text-white rounded-full font-bold hover:bg-[#5D4037] transition-colors"
                            >
                                Coba Lagi
                            </button>
                        </motion.div>
                    )}

                    {/* Form State */}
                    {!submitted && !error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="text-center mb-12">
                                <h1 className="font-['Baskervville'] text-5xl md:text-6xl text-[#3E2723] mb-4 italic">
                                    Kotak Gagasan
                                </h1>
                                <p className="text-[#6D4C41] max-w-lg mx-auto italic">
                                    Setiap tegukan punya cerita, setiap ide punya tempat. Mari berkolaborasi menciptakan ruang yang lebih hangat untuk kita semua.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 md:p-10 shadow-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-[#3E2723] mb-3">
                                            Nama Kamu
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Tulis nama lengkapmu"
                                            required
                                            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8D6E63]/20 focus:border-[#8D6E63] transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-[#3E2723] mb-3">
                                            Kontak (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            name="contact"
                                            value={formData.contact}
                                            onChange={handleChange}
                                            placeholder="Email atau Instagram"
                                            className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8D6E63]/20 focus:border-[#8D6E63] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[#3E2723] mb-3">
                                        Topik Gagasan
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {topics.map((topic) => (
                                            <button
                                                key={topic}
                                                type="button"
                                                onClick={() => handleTopicSelect(topic)}
                                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${formData.topic === topic
                                                        ? 'bg-[#3E2723] text-white'
                                                        : 'bg-white border border-gray-200 text-[#6D4C41] hover:border-[#8D6E63]'
                                                    }`}
                                            >
                                                {topic}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-[#3E2723] mb-3">
                                        Apa yang ingin kamu bagikan?
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Ceritakan ide, masukan, atau sekadar sapaan untuk kami..."
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8D6E63]/20 focus:border-[#8D6E63] transition-all resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto mx-auto flex items-center justify-center gap-3 px-10 py-4 bg-[#3E2723] text-white rounded-full font-bold hover:bg-[#5D4037] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>Mengirim...</>
                                    ) : (
                                        <>
                                            Kirim Gagasan <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default KotakGagasanPage;
