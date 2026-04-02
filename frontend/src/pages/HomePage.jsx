// ATC Platform - Public Landing Page
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Phone, Mail, MapPin, ArrowRight, Menu, X, 
  Star, Shield, Users, Clock, Target, Sparkles,
  ChevronRight, CheckCircle2, Calendar, FileText
} from 'lucide-react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

// Google Maps configuration
const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '24px'
};

const center = {
  lat: -33.8688, // Sydney coordinates - adjust to actual business location
  lng: 151.2093
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#263c3f" }] },
    { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#6b9a76" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
    { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
    { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
    { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
    { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2f3948" }] },
    { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
    { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
  ]
};

// Services data
const services = [
  {
    icon: Target,
    title: "Capacity Building",
    description: "Skills for independence & long-term goals",
    color: "from-teal-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Daily Living Support",
    description: "Personal care & household assistance",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Heart,
    title: "Community Access",
    description: "Social participation & engagement",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Shield,
    title: "Plan Management",
    description: "Financial oversight & NDIS compliance",
    color: "from-blue-500 to-indigo-500"
  }
];

// Testimonials data
const testimonials = [
  {
    name: "Carol Galloway",
    role: "Parent / Carer",
    quote: "Achieve Together Care has transformed our family's life. The support has been consistent, professional, and genuinely person-centred. We couldn't be happier with the care provided.",
    rating: 5
  },
  {
    name: "James Chen",
    role: "Support Coordinator",
    quote: "Working with ATC has been a pleasure. Their documentation is thorough, communication is excellent, and the participants always speak highly of them.",
    rating: 5
  },
  {
    name: "Maria Santos",
    role: "NDIS Participant",
    quote: "The support team understands my needs and helps me achieve my goals every day. I feel respected and valued as a person, not just a client.",
    rating: 5
  }
];

// How It Works steps
const steps = [
  {
    number: "01",
    title: "Get in Touch",
    description: "Call us or fill in our contact form. We'll respond within 24 hours."
  },
  {
    number: "02",
    title: "Initial Consultation",
    description: "We'll discuss your needs, goals, and how we can best support you."
  },
  {
    number: "03",
    title: "Personalized Plan",
    description: "Together, we create a support plan tailored to your unique situation."
  },
  {
    number: "04",
    title: "Begin Your Journey",
    description: "Start receiving quality care from our dedicated support team."
  }
];

export function HomePage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Demo - would connect to backend in production
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3" data-testid="nav-logo">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <span className="text-lg font-black text-white tracking-tight">Achieve Together Care</span>
                <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">NDIS Registered Provider</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => scrollToSection('services')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors" data-testid="nav-services">Services</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors" data-testid="nav-how-it-works">How It Works</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors" data-testid="nav-testimonials">Testimonials</button>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-bold text-slate-400 hover:text-white transition-colors" data-testid="nav-contact">Contact</button>
              <button 
                onClick={() => navigate('/login')}
                className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-black text-sm uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg shadow-teal-500/30 transition-all"
                data-testid="nav-owner-login"
              >
                Owner Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center"
              data-testid="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-xl border-t border-white/5">
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => scrollToSection('services')} className="block w-full text-left text-base font-bold text-white py-3 px-4 rounded-xl hover:bg-white/5">Services</button>
              <button onClick={() => scrollToSection('how-it-works')} className="block w-full text-left text-base font-bold text-white py-3 px-4 rounded-xl hover:bg-white/5">How It Works</button>
              <button onClick={() => scrollToSection('testimonials')} className="block w-full text-left text-base font-bold text-white py-3 px-4 rounded-xl hover:bg-white/5">Testimonials</button>
              <button onClick={() => scrollToSection('contact')} className="block w-full text-left text-base font-bold text-white py-3 px-4 rounded-xl hover:bg-white/5">Contact</button>
              <button 
                onClick={() => navigate('/login')}
                className="block w-full bg-teal-500 text-slate-900 font-black text-center uppercase tracking-wider py-4 rounded-xl"
              >
                Owner Login
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden" data-testid="hero-section">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-sm font-bold text-teal-400">NDIS Registered Provider</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6" data-testid="hero-headline">
              <span className="text-white">More</span>
              <br />
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Than Just Care
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Person-centred support that empowers you to achieve your goals. Professional business management with relationship-centred care and unwavering integrity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => scrollToSection('contact')}
                className="group w-full sm:w-auto bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-900 font-black uppercase tracking-wider px-8 py-4 rounded-2xl shadow-xl shadow-teal-500/30 transition-all flex items-center justify-center gap-3"
                data-testid="hero-cta-primary"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-wider px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-3"
                data-testid="hero-cta-secondary"
              >
                Explore Services
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
                <span className="text-sm font-bold">NDIS Registered</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-400" />
                <span className="text-sm font-bold">Fully Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                <span className="text-sm font-bold">Experienced Team</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-400" />
                <span className="text-sm font-bold">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 relative" data-testid="services-section">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-xs font-black text-teal-400 uppercase tracking-[0.3em] mb-4 block">Our Services</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Comprehensive NDIS Support
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Tailored services designed to help you live independently and achieve your goals.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                data-testid={`service-card-${index}`}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">{service.title}</h3>
                <p className="text-slate-400 mb-4">{service.description}</p>
                <button className="flex items-center gap-2 text-teal-400 font-bold text-sm group-hover:gap-3 transition-all">
                  Learn More <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-800/50" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-xs font-black text-teal-400 uppercase tracking-[0.3em] mb-4 block">How It Works</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Getting Started is Simple
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From your first call to your first support session — we make the process clear, personal, and stress-free.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative" data-testid={`step-${index}`}>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 h-full">
                  <span className="text-6xl font-black text-teal-500/20 mb-4 block">{step.number}</span>
                  <h3 className="text-xl font-black text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-teal-500/30">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8" data-testid="testimonials-section">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-xs font-black text-teal-400 uppercase tracking-[0.3em] mb-4 block">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              What People Say
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Real stories from participants, carers, and support coordinators who trust Achieve Together Care.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className={`rounded-3xl p-8 ${
                  index === 0 ? 'bg-gradient-to-br from-teal-600 to-cyan-600' :
                  index === 1 ? 'bg-slate-800 border border-white/10' :
                  'bg-gradient-to-br from-purple-600 to-pink-600'
                }`}
                data-testid={`testimonial-${index}`}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400" fill="#facc15" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className={`text-lg mb-6 leading-relaxed ${index === 1 ? 'text-slate-300' : 'text-white/90'}`}>
                  "{testimonial.quote}"
                </p>
                
                {/* Author */}
                <div className="border-t border-white/20 pt-6">
                  <p className="font-black text-white">{testimonial.name}</p>
                  <p className={`text-sm ${index === 1 ? 'text-slate-400' : 'text-white/70'}`}>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map & Contact Section */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-800/50" data-testid="contact-section">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="text-xs font-black text-teal-400 uppercase tracking-[0.3em] mb-4 block">Contact Us</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Ready to start your journey? Contact us today and let's discuss how we can support you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <h3 className="text-2xl font-black text-white mb-6">Send a Message</h3>
              
              {formSubmitted ? (
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto mb-4" />
                  <p className="text-teal-400 font-bold">Message sent successfully!</p>
                  <p className="text-slate-400 text-sm mt-2">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Your Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      placeholder="John Smith"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                      required
                      data-testid="contact-name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="you@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                        required
                        data-testid="contact-email"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Phone</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        placeholder="0400 000 000"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all"
                        data-testid="contact-phone"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Tell us about your needs..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none"
                      required
                      data-testid="contact-message"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-900 font-black uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-3"
                    data-testid="contact-submit"
                  >
                    Send Message
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>

            {/* Map & Contact Info */}
            <div className="space-y-8">
              {/* Google Map */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-3 overflow-hidden" data-testid="google-map-container">
                <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={14}
                    options={mapOptions}
                  >
                    <Marker position={center} />
                  </GoogleMap>
                </LoadScript>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="tel:+61400000000" 
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all flex items-center gap-4"
                  data-testid="contact-phone-link"
                >
                  <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Call Us</p>
                    <p className="text-white font-bold">1300 ATC CARE</p>
                  </div>
                </a>
                <a 
                  href="mailto:hello@achievetogethercare.com.au"
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all flex items-center gap-4"
                  data-testid="contact-email-link"
                >
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Email</p>
                    <p className="text-white font-bold text-sm">hello@atc.com.au</p>
                  </div>
                </a>
              </div>

              {/* Address */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex items-center gap-4" data-testid="contact-address">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Visit Us</p>
                  <p className="text-white font-bold">Sydney, NSW, Australia</p>
                  <p className="text-slate-400 text-sm">Serving Greater Sydney & Beyond</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5" data-testid="footer">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <div>
                <span className="text-base font-black text-white">Achieve Together Care</span>
                <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">NDIS Registered</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-8 text-sm text-slate-400">
              <a href="https://achievetogethercare.com.au" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Website</a>
              <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">Services</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button>
              <button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Portal Login</button>
            </div>

            {/* Copyright */}
            <p className="text-sm text-slate-500">
              © 2026 Achieve Together Care. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
