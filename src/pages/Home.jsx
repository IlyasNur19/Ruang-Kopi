import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Story from '../components/Story';
import PromoSection from '../components/PromoSection';
import Menu from '../components/Menu';
import Gallery from '../components/Gallery';
import Reservation from '../components/Reservation';
import Location from '../components/Location';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="min-h-screen bg-background text-text">
            <Navbar />
            <main>
                <Hero />
                <Story />
                <PromoSection />
                <Menu />
                <Gallery />
                <Reservation />
                <Location />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
