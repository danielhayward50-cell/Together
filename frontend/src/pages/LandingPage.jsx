// ATC Platform - Ultra-Impressive Landing Page
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, Users, Home, MapPin, Phone, Mail, Clock, ChevronRight,
  Star, Shield, Award, CheckCircle, ArrowRight, Menu, X,
  Play, MessageCircle, Calendar, Briefcase, HeartHandshake
} from 'lucide-react';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

// Images
const HERO_IMAGE = 'https://images.unsplash.com/photo-1764006145420-df3006edf060?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxkaXNhYmlsaXR5JTIwY2FyZSUyMHN1cHBvcnQlMjB3b3JrZXIlMjBoZWxwaW5nJTIwcGVyc29uJTIwd2hlZWxjaGFpciUyMGNvbW11bml0eXxlbnwwfHx8fDE3NzUxOTQ2NjN8MA&ixlib=rb-4.1.0&q=85&w=1200';
const CARE_IMAGE_1 = 'https://images.unsplash.com/photo-1758691031787-90867cb6fb2c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MTN8MHwxfHNlYXJjaHwyfHxoYXBweSUyMGVsZGVybHklMjBjYXJlJTIwaG9tZSUyMHN1cHBvcnQlMjBzbWlsaW5nfGVufDB8fHx8MTc3NTE5NDY2M3ww&ixlib=rb-4.1.0&q=85&w=800';
const CARE_IMAGE_2 = 'https://images.pexels.com/photos/7551635/pexels-photo-7551635.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';
const CARE_IMAGE_3 = 'https://images.pexels.com/photos/6284845/pexels-photo-6284845.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940';

export function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [activeFaq, setActiveFaq] = useState(null);
  const mapRef = useRef(null);

  // Load Google Maps
  useEffect(() => {
    if (GOOGLE_MAPS_API_KEY && mapRef.current && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = () => {
        if (mapRef.current) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat: -33.8688, lng: 151.2093 }, // Sydney
            zoom: 11,
            styles: [
              { featureType: 'all', elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
              { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d6e0' }] },
              { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#c5e8c5' }] }
            ]
          });
          new window.google.maps.Marker({
            position: { lat: -33.8688, lng: 151.2093 },
            map,
            title: 'Achieve Together Care'
          });
        }
      };
      document.head.appendChild(script);
    } else if (window.google && mapRef.current) {
      window.initMap();
    }
  }, []);

  const services = [
    {
      icon: Users,
      title: 'Community Participation',
      description: 'Supporting participants to engage in community activities, social events, and recreational programs.',
      color: 'bg-teal-500',
      code: '04_104_0125_6_1'
    },
    {
      icon: Home,
      title: 'Assistance with Daily Life',
      description: 'Help with everyday tasks including personal care, household activities, and life skills.',
      color: 'bg-blue-500',
      code: '01_011_0107_1_1'
    },
    {
      icon: HeartHandshake,
      title: 'High Intensity Support',
      description: 'Specialized support for participants with complex needs and high-care requirements.',
      color: 'bg-violet-500',
      code: '01_015_0120_1_1'
    },
    {
      icon: Calendar,
      title: 'Group Activities',
      description: 'Small group programs designed to develop social skills and build friendships.',
      color: 'bg-pink-500',
      code: '04_102_0125_6_1'
    },
    {
      icon: MapPin,
      title: 'Transport Assistance',
      description: 'Safe and reliable transport to appointments, activities, and community events.',
      color: 'bg-amber-500',
      code: '02_051_0108_1_1'
    },
    {
      icon: Briefcase,
      title: 'Support Coordination',
      description: 'Expert guidance to navigate NDIS plans and connect with the right services.',
      color: 'bg-emerald-500',
      code: '07_001_0106_8_3'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Parent of NDIS Participant',
      quote: 'ATC has been amazing for our son. The support workers are caring, professional, and truly understand his needs. We\'ve seen incredible progress.',
      rating: 5
    },
    {
      name: 'James T.',
      role: 'Support Coordinator',
      quote: 'I refer all my clients to Achieve Together Care. Their communication is excellent, their reporting is thorough, and they genuinely care about outcomes.',
      rating: 5
    },
    {
      name: 'Michelle R.',
      role: 'NDIS Participant',
      quote: 'The team at ATC has helped me gain so much independence. I can now go shopping, catch public transport, and attend events on my own!',
      rating: 5
    }
  ];

  const faqs = [
    {
      q: 'What areas do you service?',
      a: 'We provide services across Greater Sydney and New South Wales. Contact us to check availability in your area.'
    },
    {
      q: 'How do I get started with ATC?',
      a: 'Simply contact us via phone or email. We\'ll arrange a free consultation to understand your needs and explain how we can help.'
    },
    {
      q: 'What NDIS funding types do you accept?',
      a: 'We accept all NDIS funding types: Plan Managed, Self Managed, and NDIA Managed participants.'
    },
    {
      q: 'Are your support workers qualified?',
      a: 'Yes! All our workers have current NDIS Worker Screening, First Aid, CPR, and relevant qualifications. Many have specialized training.'
    },
    {
      q: 'Can I meet my support worker before starting?',
      a: 'Absolutely! We always arrange a meet-and-greet so you can ensure you\'re comfortable with your matched support worker.'
    }
  ];

  const stats = [
    { value: 'NSW', label: 'Service Area', icon: MapPin },
    { value: 'NDIS', label: 'Registered', icon: Shield },
    { value: '24/7', label: 'On-Call Support', icon: Clock },
    { value: '5★', label: 'Rated Service', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                <Heart className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-900">Achieve Together</h1>
                <p className="text-[10px] text-teal-600 font-semibold uppercase tracking-wider">NDIS Provider</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-slate-600 hover:text-teal-600 font-medium">Services</a>
              <a href="#about" className="text-slate-600 hover:text-teal-600 font-medium">About</a>
              <a href="#testimonials" className="text-slate-600 hover:text-teal-600 font-medium">Testimonials</a>
              <a href="#contact" className="text-slate-600 hover:text-teal-600 font-medium">Contact</a>
              <button
                onClick={() => navigate('/login')}
                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all"
                data-testid="nav-login-btn"
              >
                Portal Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-3">
            <a href="#services" className="block py-2 text-slate-600">Services</a>
            <a href="#about" className="block py-2 text-slate-600">About</a>
            <a href="#testimonials" className="block py-2 text-slate-600">Testimonials</a>
            <a href="#contact" className="block py-2 text-slate-600">Contact</a>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-teal-500 text-white py-3 rounded-xl font-semibold"
            >
              Portal Login
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-blue-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Shield size={16} />
                NDIS Registered Provider
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Empowering <span className="text-teal-500">Independence</span>, 
                One Goal at a Time
              </h1>
              
              <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                Delivering person-centred NDIS support services across New South Wales. 
                We believe everyone deserves to live the life they choose.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-teal-500/30 transition-all"
                  data-testid="hero-cta"
                >
                  Get Started
                  <ArrowRight size={20} />
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg border border-slate-200 transition-all"
                >
                  Our Services
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-teal-400 border-2 border-white"></div>
                    <div className="w-10 h-10 rounded-full bg-blue-400 border-2 border-white"></div>
                    <div className="w-10 h-10 rounded-full bg-violet-400 border-2 border-white"></div>
                  </div>
                  <span className="text-slate-600 text-sm">100+ Happy Families</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                  <span className="text-slate-600 text-sm ml-1">5.0 Rating</span>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={HERO_IMAGE}
                  alt="Caring support worker helping participant"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 md:p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Award className="text-teal-600" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">10+ Years</p>
                    <p className="text-slate-500 text-sm">Experience in Care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="text-center">
                  <Icon className="text-teal-400 mx-auto mb-2" size={24} />
                  <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-teal-600 font-semibold uppercase tracking-wider text-sm">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">Our NDIS Services</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Comprehensive support services tailored to help you achieve your goals and live independently.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const Icon = service.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-100"
                  data-testid={`service-card-${idx}`}
                >
                  <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                  <p className="text-slate-600 mb-4">{service.description}</p>
                  <p className="text-xs text-slate-400 font-mono">NDIS: {service.code}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section with Images */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Images Grid */}
            <div className="grid grid-cols-2 gap-4">
              <img
                src={CARE_IMAGE_1}
                alt="Happy elderly couple"
                className="rounded-2xl h-48 w-full object-cover"
              />
              <img
                src={CARE_IMAGE_2}
                alt="Caregiver with participant"
                className="rounded-2xl h-48 w-full object-cover mt-8"
              />
              <img
                src={CARE_IMAGE_3}
                alt="Outdoor support"
                className="rounded-2xl h-48 w-full object-cover col-span-2"
              />
            </div>

            {/* Content */}
            <div>
              <span className="text-teal-600 font-semibold uppercase tracking-wider text-sm">About Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-6">
                Why Choose Achieve Together Care?
              </h2>
              
              <div className="space-y-4">
                {[
                  'Experienced, qualified support workers with specialized training',
                  'Goal-focused support aligned with your NDIS plan',
                  'Strong focus on clinical safety and positive behavior support',
                  'Flexible scheduling available 7 days a week',
                  'Detailed reporting for plan reviews and progress tracking',
                  'Deep connections with Sydney community resources'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-teal-500 flex-shrink-0 mt-1" size={20} />
                    <span className="text-slate-600">{item}</span>
                  </div>
                ))}
              </div>

              {/* Leadership Card */}
              <div className="mt-8 bg-slate-50 rounded-2xl p-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  DH
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Daniel Hayward</h4>
                  <p className="text-slate-500 text-sm">Founder & Director</p>
                  <p className="text-teal-600 text-sm">0422 492 736</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-teal-500 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-teal-100 font-semibold uppercase tracking-wider text-sm">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">What People Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl" data-testid={`testimonial-${idx}`}>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{t.name}</p>
                    <p className="text-sm text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Access */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-teal-600 font-semibold uppercase tracking-wider text-sm">Portal Access</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">Access Your Portal</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: 'Client Portal', desc: 'View schedules, reports, and communicate with your team', icon: Users, color: 'bg-blue-500' },
              { title: 'Staff Portal', desc: 'Access rosters, submit reports, and manage your shifts', icon: Briefcase, color: 'bg-teal-500' },
              { title: 'Owner Portal', desc: 'Full business management and analytics dashboard', icon: Shield, color: 'bg-violet-500' }
            ].map((portal, idx) => {
              const Icon = portal.icon;
              return (
                <button
                  key={idx}
                  onClick={() => navigate('/login')}
                  className="bg-white rounded-2xl p-6 text-left hover:shadow-xl transition-all border border-slate-100 group"
                  data-testid={`portal-${idx}`}
                >
                  <div className={`w-12 h-12 ${portal.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{portal.title}</h3>
                  <p className="text-slate-500 text-sm">{portal.desc}</p>
                  <div className="flex items-center gap-1 text-teal-600 font-semibold mt-4 text-sm">
                    Access Portal <ChevronRight size={16} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-teal-600 font-semibold uppercase tracking-wider text-sm">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">Common Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl overflow-hidden"
                data-testid={`faq-${idx}`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-slate-50"
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  <ChevronRight
                    size={20}
                    className={`text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-90' : ''}`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                    <p className="text-slate-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section with Map */}
      <section id="contact" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <span className="text-teal-400 font-semibold uppercase tracking-wider text-sm">Contact Us</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-6">Get in Touch</h2>
              
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                />
                <textarea
                  rows={4}
                  placeholder="How can we help you?"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-xl font-bold transition-all"
                  data-testid="contact-submit"
                >
                  Send Message
                </button>
              </form>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex items-center gap-3">
                  <Phone className="text-teal-400" size={20} />
                  <span className="text-white">0422 492 736</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-teal-400" size={20} />
                  <span className="text-white text-sm">daniel@achievetogethercare.com.au</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-teal-400" size={20} />
                  <span className="text-white">Sydney, NSW</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-teal-400" size={20} />
                  <span className="text-white">24/7 On-Call</span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="relative">
              <div
                ref={mapRef}
                className="w-full h-[400px] rounded-2xl bg-slate-800"
                id="google-map"
              >
                {!GOOGLE_MAPS_API_KEY && (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 rounded-2xl">
                    <div className="text-center">
                      <MapPin className="text-teal-400 mx-auto mb-2" size={48} />
                      <p className="text-white font-semibold">Sydney, NSW</p>
                      <p className="text-slate-400 text-sm">Greater Sydney Area</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                <Heart className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold">Achieve Together Care</h3>
                <p className="text-slate-400 text-xs">NDIS Registered Provider</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 text-sm">
              <span>NDIS Provider: 4050061959</span>
              <span>ABN: 91 673 357 602</span>
            </div>
            
            <p className="text-slate-500 text-sm">
              © 2026 Achieve Together Care. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
