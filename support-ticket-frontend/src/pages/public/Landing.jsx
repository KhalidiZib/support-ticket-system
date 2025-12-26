import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Lottie from "lottie-react";
import heroAnimation from "../../assets/hero-animation.json";
import { Ticket, Shield, Clock, Globe } from "lucide-react";
import { Helmet } from "react-helmet-async";
import ThemeToggle from "../../components/ui/ThemeToggle";

export default function Landing() {
    const [scrolled, setScrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const lottieRef = useRef();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        // Lazy load Lottie animation
        const timer = setTimeout(() => {
            if (lottieRef.current) {
                lottieRef.current.play();
            }
        }, 300);

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(timer);
        };
    }, []);

    const handleFreeTrialClick = () => {
        setIsLoading(true);
        // Navigation will happen via Link, this is just for loading state
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <>
            <Helmet>
                <title>SupportHub - Modern Help Desk & Ticket Management System</title>
                <meta name="description" content="Streamline your help desk with SupportHub's intelligent ticket management system. Designed for teams that care about speed, clarity, and customer happiness." />
            </Helmet>

            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-300">
                {/* NAVBAR */}
                <nav
                    aria-label="Main navigation"
                    className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 py-0' : 'bg-transparent py-4'}`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2" aria-label="SupportHub Home">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                                <Ticket size={18} aria-hidden="true" />
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                                SupportHub
                            </h1>
                        </Link>

                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <Link
                                to="/login"
                                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                aria-label="Sign in to your account"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-full transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                                aria-label="Get started with SupportHub"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* HERO SECTION */}
                <section className="pt-32 md:pt-40 pb-16 md:pb-20 px-4 md:px-6 relative overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-950 transition-colors duration-300">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[800px] -z-10 opacity-40 mix-blend-multiply dark:mix-blend-screen pointer-events-none">
                        <Lottie
                            lottieRef={lottieRef}
                            animationData={heroAnimation}
                            loop={true}
                            className="w-full h-full opacity-60 dark:opacity-30"
                        />
                    </div>

                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[600px] bg-primary-400/10 dark:bg-primary-500/5 rounded-full blur-[100px] -z-20"></div>

                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-primary-700 dark:text-primary-300 text-xs font-semibold uppercase tracking-wide mb-6 animate-fade-in-up">
                            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" aria-hidden="true"></span>
                            v2.0 Now Live
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 md:mb-8 text-slate-900 dark:text-white leading-[1.1] animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards">
                            Support Made <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">Simpler</span>.
                        </h1>

                        <p className="max-w-2xl mx-auto text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-8 md:mb-10 leading-relaxed animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards">
                            Streamline your help desk with our intelligent ticket management system.
                            Designed for teams that care about speed, clarity, and customer happiness.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards">
                            <Link
                                to="/register"
                                onClick={handleFreeTrialClick}
                                className={`w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl font-semibold transition-all shadow-xl shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                                aria-label="Start free trial of SupportHub"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Loading...
                                    </>
                                ) : (
                                    'Start Free Trial'
                                )}
                            </Link>

                            <Link
                                to="/login"
                                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 rounded-2xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                                aria-label="View demo of SupportHub"
                            >
                                View Demo
                            </Link>
                        </div>
                    </div>

                    {/* STATS BAR */}
                    <div className="max-w-5xl mx-auto mt-12 md:mt-20 pt-8 md:pt-10 border-t border-slate-200/60 dark:border-slate-800/60 animate-fade-in-up [animation-delay:500ms] opacity-0 fill-mode-forwards">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-center">
                            {[
                                { value: "10k+", label: "Tickets Solved" },
                                { value: "99.9%", label: "Server Uptime" },
                                { value: "24/7", label: "Global Support" },
                                { value: "4.9/5", label: "User Rating" }
                            ].map((stat, idx) => (
                                <div key={idx} className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl md:bg-transparent md:p-0">
                                    <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                                    <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FEATURES */}
                <section className="py-16 md:py-24 bg-slate-900 border-t border-slate-800" aria-labelledby="features-heading">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                            <h2 id="features-heading" className="text-2xl md:text-3xl font-bold text-white mb-4">Why SupportHub?</h2>
                            <p className="text-slate-400">Everything you need to manage support requests without the clutter.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                            {[
                                { icon: <Shield className="text-primary-400" aria-hidden="true" />, title: "Enterprise Security", desc: "Bank-grade encryption, JWT auth, and role-based access control built-in." },
                                { icon: <Clock className="text-primary-400" aria-hidden="true" />, title: "Real-time Updates", desc: "Never miss a beat with instant notifications and live status tracking." },
                                { icon: <Globe className="text-primary-400" aria-hidden="true" />, title: "Global Access", desc: "Manage detailed support tickets from anywhere, anytime." }
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="group p-6 md:p-8 rounded-2xl md:rounded-3xl bg-slate-800/50 hover:bg-slate-800 hover:shadow-2xl hover:shadow-primary-900/20 hover:-translate-y-2 border border-slate-700 hover:border-primary-500/50 transition-all duration-300 cursor-default"
                                >
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-900 rounded-xl md:rounded-2xl shadow-inner border border-slate-700 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{feature.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="py-8 md:py-12 bg-slate-900 text-slate-400 text-sm border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <Ticket size={16} className="text-primary-500" aria-hidden="true" />
                            <span className="font-semibold text-slate-200">SupportHub</span>
                        </div>
                        <nav className="flex gap-4 md:gap-6 mb-4 md:mb-0" aria-label="Footer navigation">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </nav>
                    </div>
                    <div className="text-center mt-6 md:mt-8 text-slate-600 text-xs md:text-sm">
                        © {new Date().getFullYear()} AUCA WebTech Final Project.
                    </div>
                </footer>
            </div>
        </>
    );
}
