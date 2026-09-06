import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';

export function App() {
    return (
        <div className="min-h-screen bg-gray-950">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <HowItWorks />
                <CallToAction />
            </main>
            <Footer />
        </div>
    );
}
