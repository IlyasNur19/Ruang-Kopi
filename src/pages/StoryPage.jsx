import React from 'react';
import Story from '../components/Story';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const StoryPage = () => {
    return (
        <div className="min-h-screen flex flex-col pt-20">
            <Navbar />
            <main className="flex-grow">
                <Story />
            </main>
            <Footer />
        </div>
    );
};

export default StoryPage;
