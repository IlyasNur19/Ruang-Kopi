import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';
import { settingsApi, menuApi } from '../services/api';
import { Socket } from 'socket.io';


const Home = () => {
    const [shopStatus, setShopStatus] = useState('available');
    const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80');
    const [menuItems, setMenuItems] = useState([]);
    const [spaceImages, setSpaceImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const statusConfig = {
        available: { text: 'Buka · Meja Tersedia', color: 'bg-green-500' },
        busy: { text: 'Ramai · Meja Terbatas', color: 'bg-orange-500' },
        full: { text: 'Penuh · Tidak Ada Meja', color: 'bg-red-500' }
    };
    const status = statusConfig[shopStatus] || statusConfig.available;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [statusData, menuData, heroData, spaceData] = await Promise.all([
                    settingsApi.getStatus().catch(() => ({ status: 'available' })),
                    menuApi.getAll().catch(() => []),
                    settingsApi.getHeroImage().catch(() => ({ heroImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80' })),
                    settingsApi.getSpaceImages().catch(() => ({ images: [] })),
                ]);

                if (statusData?.status) setShopStatus(statusData.status);
                if (heroData?.heroImage) setHeroImage(heroData.heroImage);
                if (spaceData?.images) setSpaceImages(spaceData.images);

                const favoriteItems = (menuData || [])
                    .filter(item => item.available !== false)
                    .slice(0, 5);
                setMenuItems(favoriteItems);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price).replace('IDR', 'Rp');
    };

    const getCategoryLabel = (category, index) => {
        const labels = ['SIGNATURE', 'POPULER', 'MANUAL BREW', 'FAVORIT', 'ESPRESSO'];
        if (category) return category.toUpperCase();
        return labels[index % labels.length];
    };

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (i = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
        })
    };

    const staggerContainer = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-[#F5F0EB] text-[#3E2723] font-body antialiased selection:bg-primary-fixed selection:text-on-primary-fixed overflow-x-hidden">
            <Navbar />
            <main>
                {/* ========================================== */}
                {/* HERO SECTION */}
                {/* ========================================== */}
                <section className="relative min-h-[600px] md:min-h-[700px] flex items-center max-w-[1400px] mx-auto overflow-hidden">
                    {/* Background Container with curved edges */}
                    <div className="absolute inset-4 md:inset-8 rounded-[2rem] md:rounded-[3rem] overflow-hidden">
                        <img
                            className="absolute inset-0 w-full h-full object-cover"
                            src={heroImage}
                            alt="RuangKopi suasana cafe"
                        />
                        {/* Dark gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
                    </div>

                    {/* Content Container */}
                    <div className="relative z-10 max-w-[1200px] mx-auto w-full px-8 md:px-16 flex flex-col justify-end pb-16 md:pb-20 h-full min-h-[600px] md:min-h-[700px]">
                        {/* Hero Content - directly on image */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="max-w-2xl"
                        >
                            {/* Badge */}
                            <motion.div variants={fadeInUp} custom={0} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/30 backdrop-blur-sm bg-white/10 text-xs font-medium text-white/90 mb-10">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D7CCC8] animate-pulse"></span>
                                Specialty Coffee
                            </motion.div>

                            {/* Headline */}
                            <motion.div variants={fadeInUp} custom={0}>
                                <img src='/icon-ruang-kopi-putih.png' className=' w-52 md:w-80' alt='RuangKopi Icon' />
                            </motion.div>

                            <motion.h1 variants={fadeInUp} custom={1} className="font-serif text-[50px] md:text-[64px] leading-[1.1]  text-white mb-3 tracking-tight">
                                ruang kopi
                            </motion.h1>

                            {/* Subheading */}
                            <motion.p variants={fadeInUp} custom={2} className="text-white/70 text-xs max-w-md mb-8 leading-relaxed pr-20">
                                Kopi artisanal yang diseduh dengan presisi. Temukan ritme lambat di tengah hiruk-pikuk kota.
                            </motion.p>

                            {/* CTA Button */}
                            <motion.div variants={fadeInUp} custom={3} className="flex gap-4">
                                <Link
                                    to="/reservation"
                                    className="inline-flex items-center gap-2 px-3 py-2 md:px-8 md:py3.5 border-2 border-white text-white rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-white hover:text-[#3E2723] transition-all duration-300 active:scale-95"
                                >
                                    Visit Us
                                </Link>
                                <Link
                                    to="/menu"
                                    className="inline-flex items-center gap-2 px-3 py-2 md:px-8 md:py-3.5  bg-white/15 backdrop-blur-sm border border-white/30 text-white rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-white/25 transition-all duration-300 active:scale-95"
                                >
                                    Lihat Menu
                                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                            </motion.div>

                            {/* Status Widget */}
                            <motion.div variants={fadeInUp} custom={4} className="mt-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 md:pr-5">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                                    <span className="material-symbols-outlined text-[20px]">table_restaurant</span>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-white/70 mb-0.5">Live Status</p>
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2 w-2">
                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.color} opacity-75`}></span>
                                            <span className={`relative inline-flex rounded-full h-2 w-2 ${status.color}`}></span>
                                        </span>
                                        <p className="text-sm font-semibold text-white">{status.text}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* ========================================== */}
                {/* KOLEKSI PILIHAN SECTION */}
                {/* ========================================== */}
                <section className="py-5 md:py-10 px-4 md:px-8 max-w-[1200px] mx-auto bg-[#F5F0EB]">
                    {/* Header & Filters */}
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-serif text-[32px] md:text-[40px] font-bold text-[#3E2723] mb-4 tracking-tight"
                        >
                            Koleksi Pilihan
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="font-body text-[#6D4C41] text-sm md:text-base max-w-2xl mx-auto mb-10"
                        >
                            Jelajahi biji kopi terbaik dan peralatan seduh pilihan kami untuk menyempurnakan ritual kopi Anda di rumah.
                        </motion.p>

                        {/* Filter Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center justify-center gap-3 md:gap-4"
                        >
                            <button className="px-6 py-2.5 rounded-full bg-[#3E2723] text-white text-sm font-semibold tracking-wide border border-[#3E2723] transition-all">
                                What's New
                            </button>
                            <button className="px-6 py-2.5 rounded-full bg-white text-[#6D4C41] text-sm font-semibold tracking-wide border border-[#3E2723]/20 hover:border-[#3E2723] hover:text-[#3E2723] transition-all">
                                Best Sellers
                            </button>
                            <button className="px-6 py-2.5 rounded-full bg-white text-[#6D4C41] text-sm font-semibold tracking-wide border border-[#3E2723]/20 hover:border-[#3E2723] hover:text-[#3E2723] transition-all">
                                Customer Favorites
                            </button>
                        </motion.div>
                    </div>

                    {/* Bento Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 rounded-2xl bg-[#E0D8D0] animate-pulse h-[500px]"></div>
                            <div className="lg:col-span-2 grid grid-cols-2 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="rounded-2xl bg-[#E0D8D0] animate-pulse h-[240px]"></div>
                                ))}
                            </div>
                        </div>
                    ) : menuItems.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                            {/* Left Large Card */}
                            {menuItems[0] && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="lg:col-span-1 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#3E2723]/5 flex flex-col h-full group"
                                >
                                    <div className="relative h-[250px] lg:h-[350px] w-full bg-[#F9F7F5] p-6 flex items-center justify-center overflow-hidden">
                                        {menuItems[0].image ? (
                                            <img src={menuItems[0].image} alt={menuItems[0].name} className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" />
                                        ) : (
                                            <span className="material-symbols-outlined text-[80px] text-[#3E2723]/10">coffee_maker</span>
                                        )}
                                        <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#8D6E63] hover:text-[#3E2723] transition-colors border border-[#3E2723]/10">
                                            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                        </button>
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-4 mb-3">
                                                <h3 className="font-serif text-xl font-semibold text-[#3E2723]">{menuItems[0].name}</h3>
                                                <span className="font-body text-base font-semibold text-[#3E2723] shrink-0">{formatPrice(menuItems[0].price)}</span>
                                            </div>
                                            <p className="text-[#6D4C41] text-sm leading-relaxed mb-6">
                                                {menuItems[0].description || 'Spesial dari RuangKopi untuk pengalaman seduh terbaik.'}
                                            </p>
                                        </div>
                                        <Link to="/menu" className="self-start text-[#3E2723] text-sm font-semibold border-b border-[#3E2723] pb-0.5 hover:text-[#8D6E63] hover:border-[#8D6E63] transition-colors">
                                            Tambah ke Keranjang
                                        </Link>
                                    </div>
                                </motion.div>
                            )}

                            {/* Right 2x2 Grid */}
                            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {menuItems.slice(1, 5).map((item, index) => (
                                    <motion.div
                                        key={item._id || index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.1 * (index + 1) }}
                                        className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#3E2723]/5 flex flex-col group"
                                    >
                                        <div className="relative h-48 w-full bg-[#F9F7F5] p-4 flex items-center justify-center overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" />
                                            ) : (
                                                <span className="material-symbols-outlined text-[60px] text-[#3E2723]/10">local_cafe</span>
                                            )}
                                            <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#8D6E63] hover:text-[#3E2723] transition-colors border border-[#3E2723]/10">
                                                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                                            </button>
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="font-body text-[15px] font-semibold text-[#3E2723] mb-1 line-clamp-1">{item.name}</h3>
                                            <span className="font-body text-sm font-medium text-[#6D4C41] mb-4">{formatPrice(item.price)}</span>
                                            <div className="mt-auto">
                                                <Link to="/menu" className="block w-full py-2.5 px-4 text-center text-[13px] font-bold text-[#3E2723] rounded-xl border border-[#3E2723]/20 hover:bg-[#F5F0EB] transition-colors">
                                                    Beli
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-16 text-[#6D4C41]">Belum ada item koleksi.</div>
                    )}
                </section>

                {/* ========================================== */}
                {/* STORY SECTION — "Kisah Kami" */}
                {/* ========================================== */}
                <section className="py-section-gap px-margin-mobile md:px-margin-desktop bg-[#EDE8E3] relative overflow-hidden">
                    {/* Decorative blur blob */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary-container/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="w-full md:w-1/2 space-y-6"
                        >
                            <h2 className="font-serif text-[28px] md:text-[42px] font-bold text-[#3E2723] tracking-tight">Kisah Kami</h2>
                            <div className="space-y-4 text-[#5D4037] font-body text-body-md">
                                <p>Berawal dari sebuah garasi kecil di tahun 2024, RuangKopi lahir dari kecintaan mendalam terhadap ritual menyeduh kopi. Kami percaya bahwa secangkir kopi lebih dari sekadar minuman; ia adalah jeda sejenak, sebuah ruang untuk bernapas.</p>
                                <p>Kami bekerja sama langsung dengan petani lokal untuk memastikan setiap biji yang kami sangrai membawa cerita dari tanah tempatnya tumbuh, disajikan dengan kesederhanaan dan presisi.</p>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-4 pt-4">
                                <div className="flex text-[#3E2723]">
                                    {[...Array(4)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    ))}
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star_half</span>
                                </div>
                                <span className="font-body text-label-sm text-[#6D4C41]">4.9/5 dari 500+ Ulasan</span>
                            </div>

                            {/* CTA */}
                            <div className="pt-4">
                                <Link
                                    to="/gallery"
                                    className="bg-[#3E2723] text-white px-8 py-3 rounded-full text-sm font-semibold tracking-wide uppercase hover:bg-[#4E342E] transition-all active:scale-95 shadow-md inline-flex items-center gap-2"
                                >
                                    Baca Selengkapnya
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Image Composition */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="w-full md:w-1/2 relative min-h-[400px] md:min-h-[500px]"
                        >
                            {/* Image 1 (Front, slightly smaller) */}
                            <div className="absolute bottom-0 left-0 w-3/5 md:w-2/3 rounded-2xl overflow-hidden shadow-2xl z-20 border-4 border-[#EDE8E3] transition-transform hover:scale-105 duration-500">
                                <img
                                    className="w-full h-full object-cover aspect-square"
                                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600"
                                    alt="Barista menyeduh espresso"
                                />
                            </div>
                            {/* Image 2 (Back, larger) */}
                            <div className="absolute top-0 right-0 w-3/4 rounded-2xl overflow-hidden shadow-xl z-10 transition-transform hover:scale-[1.02] duration-500">
                                <img
                                    className="w-full h-full object-cover aspect-[4/3] opacity-90"
                                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800"
                                    alt="Interior cafe RuangKopi"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ========================================== */}
                {/* OUR SPACE SECTION */}
                {/* ========================================== */}
                <section className="py-20 md:py-28 px-4 md:px-8 max-w-[1400px] mx-auto bg-[#F5F0EB]">
                    <div className="text-center mb-12">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-serif text-[32px] md:text-[40px] font-bold text-[#3E2723] tracking-tight mb-4"
                        >
                            Our Space
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-[#6D4C41] text-base md:text-lg max-w-2xl mx-auto"
                        >
                            Ruang nyaman untuk bersantai, bekerja, atau sekadar menikmati waktu.
                            Setiap sudut dirancang untuk memberikan ketenangan.
                        </motion.p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {spaceImages && spaceImages.length > 0 ? (
                            spaceImages.slice(0, 3).map((img, index) => {
                                const imgSrc = typeof img === 'string' ? img : img.src;
                                const imgAlt = typeof img === 'string' ? `RuangKopi Space ${index + 1}` : (img.title || `RuangKopi Space ${index + 1}`);
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`rounded-[2rem] overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 h-[300px] md:h-[400px] ${index === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}
                                    >
                                        <img src={imgSrc} alt={imgAlt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                    </motion.div>
                                );
                            })
                        ) : (
                            /* Fallback images if API is empty */
                            <>
                                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[2rem] overflow-hidden shadow-sm h-[300px] md:h-[400px]">
                                    <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80" alt="Space 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="rounded-[2rem] overflow-hidden shadow-sm h-[300px] md:h-[400px]">
                                    <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80" alt="Space 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </motion.div>
                                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="rounded-[2rem] overflow-hidden shadow-sm h-[300px] md:h-[400px] md:col-span-2 lg:col-span-1">
                                    <img src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80" alt="Space 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                                </motion.div>
                            </>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
            <WhatsAppButton />
        </div>
    );
};

export default Home;
