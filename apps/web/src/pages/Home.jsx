import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Lightbulb, ClockFading } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { settingsApi } from '../services/api';


const Home = () => {
    const [shopStatus, setShopStatus] = useState('available');

    const statusConfig = {
        available: { text: 'Tersedia • Masih ada kursi', color: 'bg-green-500', border: 'border-green-500/30' },
        busy: { text: 'Hampir Penuh • Sisa sedikit', color: 'bg-orange-500', border: 'border-orange-500/30' },
        full: { text: 'Penuh • Waiting List', color: 'bg-red-500', border: 'border-red-500/30' }
    };
    const status = statusConfig[shopStatus] || statusConfig.available;

    const features = [
        { icon: <ClockFading size={28} />, title: 'Proses & Perjalanan', description: 'Layaknya ide besar, kopi kami melewati perjalanan panjang dari petani lokal hingga ke cangkirmu untuk hasil yang jujur.' },
        { icon: <Users size={28} />, title: 'Ruang Kolaborasi', description: 'Sebuah wadah untuk berbagi cerita, merancang mimpi, dan membangun koneksi bermakna di setiap sudut kedai.' },
        { icon: <Lightbulb size={28} />, title: 'Inspirasi Murni', description: 'Melalui kurasi biji pilihan dan seduhan yang presisi, kami hadirkan pemantik untuk setiap langkah produktifmu.' }
    ];

    // Fetch space images from API
    const [galleryImages, setGalleryImages] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch status and space images in parallel
                const [statusData, spaceData] = await Promise.all([
                    settingsApi.getStatus().catch(() => ({ status: 'available' })),
                    settingsApi.getSpaceImages().catch(() => ({ images: [] })),
                ]);

                if (statusData && statusData.status) {
                    setShopStatus(statusData.status);
                }
                if (spaceData.images && spaceData.images.length > 0) {
                    setGalleryImages(spaceData.images);
                }
            } catch (err) {
                console.error('Failed to fetch data:', err);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80"
                            alt="Ruang Kopi Interior"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50" />
                    </div>
                    <div className="relative z-10 text-center text-white px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md border rounded-full mb-8 ${status.border}`}>
                                <span className={`w-2 h-2 rounded-full animate-pulse ${status.color}`} />
                                <span className="text-xs font-medium uppercase tracking-wider text-white">{status.text}</span>
                            </div>
                            <h1 className="flex flex-col gap-0 md:gap-6 md:flex-row font-['Baskervville'] font-normal text-8xl md:text-8xl lg:text-9xl mb-6 leading-tight tracking-tight">
                                <span>ruang </span>
                                <span>kopi</span>
                            </h1>
                            <p className="text-xl md:text-xl italic font-light text-white/90 mb-12 tracking-widest">
                                ruang singgah komunitas
                            </p>
                            <Link
                                to="/menu"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-full font-bold text-lg transition-all hover:bg-background hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                Lihat Menu
                                <ArrowRight size={20} />
                            </Link>
                        </motion.div>
                    </div>

                </section>

                {/* Story Section */}
                <section className="py-24 md:py-32 bg-[#F8F5F2]">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto px-20">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8D6E63] mb-2 block">Filosofi Kopi</span>
                                <h2 className="font-heading text-7xl md:text-8xl text-primary mb-6 leading-tight font-bold">
                                    ruang<br /><span className="italic text-[#5d4037]">kopi</span>
                                </h2>
                                <div className="w-12 h-0.5 bg-[#8D6E63] mb-8"></div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Setiap biji kopi memiliki perjalanan panjang sebelum sampai ke cangkirmu. Begitu pula dengan sebuah ide besar. Di Ruang Kopi, kami menghargai setiap proses.
                                </p>
                                <p className="text-muted-foreground/80 leading-relaxed text-sm">
                                    Kami mendesain tempat ini sebagai 'ruang' kolaborasi. Kami percaya bahwa kopi terbaik adalah kopi yang diminum sambil berbagi cerita, merancang mimpi, atau sekadar menikmati kesendirian yang produktif. Dari biji pilihan yang kami kurasi dengan hati, kami menciptakan ruang di mana setiap tegukan adalah inspirasi baru.
                                </p>
                            </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.15 }}
                                    className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all group text-center"
                                >
                                    <div className="w-14 h-14 bg-[#F5F0EB] rounded-xl flex items-center justify-center mx-auto mb-5 text-[#8D6E63] group-hover:bg-[#8D6E63] group-hover:text-white transition-colors">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-heading text-xl mb-3 text-primary font-bold">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Gallery Preview Section */}
                <section className="py-20 md:py-0 mb-10 bg-[#F8F5F2]">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-end mb-8 max-w-6xl mx-auto">
                            <div>
                                <h2 className="font-heading text-4xl md:text-5xl text-[#5d4037] font-bold">Our Space</h2>
                                <p className="text-[#D7CCC8] mt-2">A glimpse into our sanctuary.</p>
                            </div>
                            <Link to="/gallery" className="text-white flex items-center gap-2 hover:text-[#D7CCC8] transition-colors font-medium">
                                View Gallery <ArrowRight size={18} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {galleryImages.map((img, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative rounded-2xl overflow-hidden group cursor-pointer ${index === 0 ? 'md:row-span-2' : ''}`}
                                >
                                    <img src={img.src} alt={img.title} className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${index === 0 ? 'h-full min-h-[400px]' : 'h-64'}`} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-6">
                                        <span className="text-xs uppercase tracking-widest text-white/70 mb-1">{img.caption}</span>
                                        <h3 className="font-heading text-2xl text-white font-bold">{img.title}</h3>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
