import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  BoltIcon,
  GlobeAltIcon,
  TrophyIcon,
  StarIcon,
  ArrowRightIcon,
  PlayIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  UsersIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  LockClosedIcon,
  CubeTransparentIcon,
  BeakerIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Loading from '../components/ui/Loading';

const Home = () => {
  const [isVisible, setIsVisible] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const observerRef = useRef(null);

  // Testimonials data - defined before useEffect
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'AI Research Lead',
      company: 'TechCorp',
      content: 'ModelChain revolutionized how we access and deploy AI models. The quality and ease of use is unmatched.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO',
      company: 'StartupAI',
      content: 'The decentralized nature gives us confidence in long-term availability. Great community support too.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      rating: 5
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Data Scientist',
      company: 'Research Institute',
      content: 'Finally, a platform that makes AI model monetization simple and transparent. Highly recommended.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      rating: 5
    }
  ];

  // Scroll animation observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Particle Network Canvas Animation
  useEffect(() => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const container = canvas.parentElement;
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        
        // Random color from expanded palette
        const colors = [
          'rgba(6, 182, 212',      // cyan
          'rgba(59, 130, 246',     // blue
          'rgba(168, 85, 247',     // purple
          'rgba(236, 72, 153',     // pink
          'rgba(16, 185, 129',     // emerald
          'rgba(245, 158, 11'      // amber
        ];
        this.baseColor = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;
        
        // Wrap around edges
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      
      draw() {
        const pulseScale = 1 + Math.sin(this.pulse) * 0.3;
        const currentRadius = this.radius * pulseScale;
        const currentOpacity = this.opacity * (0.7 + Math.sin(this.pulse) * 0.3);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = `${this.baseColor}, ${currentOpacity})`;
        
        // Add double glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = `${this.baseColor}, ${currentOpacity})`;
        ctx.fill();
        
        ctx.shadowBlur = 25;
        ctx.shadowColor = `${this.baseColor}, ${currentOpacity * 0.5})`;
        ctx.fill();
        
        ctx.shadowBlur = 0;
      }
    }
    
    // Floating Shape class for geometric elements
    class FloatingShape {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 20 + 10;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.sides = Math.floor(Math.random() * 3) + 3; // 3-5 sides
        this.opacity = Math.random() * 0.15 + 0.05;
        
        const colors = ['rgba(6, 182, 212', 'rgba(168, 85, 247', 'rgba(236, 72, 153'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;
      }
      
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        ctx.beginPath();
        for (let i = 0; i < this.sides; i++) {
          const angle = (Math.PI * 2 * i) / this.sides;
          const x = Math.cos(angle) * this.size;
          const y = Math.sin(angle) * this.size;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        
        ctx.strokeStyle = `${this.color}, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.restore();
      }
    }
    
    // Create particles - increased count for more density
    const particleCount = Math.min(300, Math.floor((canvas.width * canvas.height) / 4000));
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // Create floating shapes
    const shapeCount = Math.min(15, Math.floor(canvas.width / 100));
    const shapes = [];
    for (let i = 0; i < shapeCount; i++) {
      shapes.push(new FloatingShape());
    }
    
    // Animation loop
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw floating shapes first (background layer)
      shapes.forEach(shape => {
        shape.update();
        shape.draw();
      });
      
      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      // Draw connections between nearby particles - increased distance and variety
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            const opacity = 0.2 * (1 - distance / 150);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            // Create gradient line for more futuristic look
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, `rgba(6, 182, 212, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(168, 85, 247, ${opacity * 1.2})`);
            gradient.addColorStop(1, `rgba(236, 72, 153, ${opacity})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Register element for scroll animation
  const registerElement = (element) => {
    if (element && observerRef.current) {
      observerRef.current.observe(element);
    }
  };

  // Featured models data
  const featuredModels = [
    {
      id: 1,
      name: 'GPT-4 Vision Pro',
      category: 'Computer Vision',
      price: '2.5 ETH',
      rating: 4.9,
      downloads: '15.2K',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
      verified: true,
      trending: true
    },
    {
      id: 2,
      name: 'Audio Synthesizer X',
      category: 'Audio Processing',
      price: '1.8 ETH',
      rating: 4.7,
      downloads: '8.9K',
      image: 'https://images.unsplash.com/photo-1655393001768-d946c97d6fd1?w=400&h=300&fit=crop',
      verified: true,
      trending: false
    },
    {
      id: 3,
      name: 'NLP Sentiment Analyzer',
      category: 'Natural Language',
      price: '3.2 ETH',
      rating: 4.8,
      downloads: '12.1K',
      image: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=400&h=300&fit=crop',
      verified: true,
      trending: true
    }
  ];

  // Statistics data
  const statistics = [
    { label: 'AI Models', value: '12,450', icon: CpuChipIcon, color: 'text-blue-400' },
    { label: 'Total Transactions', value: '$45.2M', icon: CurrencyDollarIcon, color: 'text-green-400' },
    { label: 'Active Developers', value: '8,920', icon: UsersIcon, color: 'text-purple-400' },
    { label: 'Model Downloads', value: '2.1M', icon: ChartBarIcon, color: 'text-yellow-400' }
  ];

  // How it works steps
  const howItWorksSteps = [
    {
      step: 1,
      title: 'Browse Models',
      description: 'Explore our vast marketplace of AI models across categories like NLP, computer vision, and audio processing.',
      icon: GlobeAltIcon,
      color: 'text-blue-400'
    },
    {
      step: 2,
      title: 'Test & Validate',
      description: 'Use our sandbox environment to test models before purchase. See real performance metrics and results.',
      icon: BeakerIcon,
      color: 'text-green-400'
    },
    {
      step: 3,
      title: 'Secure Purchase',
      description: 'Buy models using cryptocurrency with smart contract protection. Instant access upon payment.',
      icon: LockClosedIcon,
      color: 'text-purple-400'
    },
    {
      step: 4,
      title: 'Deploy & Earn',
      description: 'Integrate models into your applications or contribute your own models to earn passive income.',
      icon: RocketLaunchIcon,
      color: 'text-yellow-400'
    }
  ];

  // Trust indicators
  const trustIndicators = [
    { name: 'Blockchain Security', icon: ShieldCheckIcon, description: 'All transactions secured by smart contracts' },
    { name: 'Model Verification', icon: CheckCircleIcon, description: 'Rigorous testing and validation process' },
    { name: 'Community Driven', icon: UsersIcon, description: 'Governed by our global developer community' },
    { name: 'Open Source', icon: CubeTransparentIcon, description: 'Transparent and auditable codebase' }
  ];

  return (
    <div className="min-h-screen bg-dark-surface-primary">
      {/* Hero Section - Premium Dark Blue Background */}
      <section 
        id="hero"
        ref={registerElement}
        className={clsx(
          'relative min-h-screen flex items-center justify-center overflow-hidden',
          'transition-all duration-1000 transform',
          isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        )}
        style={{ 
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1525 25%, #0a0e1a 50%, #0d1b2e 75%, #0a0e1a 100%)'
        }}
      >
        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridPulse 4s ease-in-out infinite'
        }} />
        
        {/* ENHANCED NEURAL NETWORK - More Visible & Connected */}
        <div className="absolute inset-0 overflow-hidden">
          
          {/* Deep Space Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/50 to-purple-950/30" />
          
          {/* Stronger Ambient Glow Orbs */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse-slow" style={{animationDuration: '8s'}} />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-slow" style={{animationDuration: '10s', animationDelay: '2s'}} />
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[100px] animate-pulse-slow" style={{animationDuration: '12s', animationDelay: '4s', transform: 'translate(-50%, -50%)'}} />
          
          {/* Neural Network - ENHANCED VERSION */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              {/* Brighter Node Gradients */}
              <radialGradient id="nodeGradCyan">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="nodeGradPurple">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="nodeGradBlue">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="nodeGradPink">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="1" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
              </radialGradient>
              
              {/* Stronger Connection Gradients */}
              <linearGradient id="connCyan">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="connPurple">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="connBlue">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
              </linearGradient>
              
              {/* Strong Glow Filter */}
              <filter id="strongGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* ========== LAYER 1 - INPUT (8 nodes) ========== */}
            <circle cx="12%" cy="12%" r="10" fill="url(#nodeGradCyan)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="12%" cy="24%" r="10" fill="url(#nodeGradBlue)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="12%" cy="36%" r="10" fill="url(#nodeGradCyan)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="12%" cy="48%" r="12" fill="url(#nodeGradPurple)" filter="url(#strongGlow)" opacity="1">
              <animate attributeName="r" values="10;16;10" dur="3.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="12%" cy="60%" r="10" fill="url(#nodeGradBlue)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.3s" repeatCount="indefinite" />
            </circle>
            <circle cx="12%" cy="72%" r="10" fill="url(#nodeGradCyan)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="12%" cy="84%" r="10" fill="url(#nodeGradPink)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.4s" repeatCount="indefinite" />
            </circle>
            
            {/* ========== LAYER 2 - HIDDEN 1 (10 nodes) ========== */}
            <circle cx="35%" cy="8%" r="10" fill="url(#nodeGradPurple)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.7s" repeatCount="indefinite" />
            </circle>
            <circle cx="35%" cy="18%" r="10" fill="url(#nodeGradCyan)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.9s" repeatCount="indefinite" />
            </circle>
            <circle cx="35%" cy="28%" r="10" fill="url(#nodeGradBlue)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="35%" cy="38%" r="10" fill="url(#nodeGradPurple)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="35%" cy="48%" r="12" fill="url(#nodeGradCyan)" filter="url(#strongGlow)" opacity="1">
              <animate attributeName="r" values="10;16;10" dur="4.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="35%" cy="58%" r="10" fill="url(#nodeGradBlue)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="35%" cy="68%" r="10" fill="url(#nodeGradPurple)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="35%" cy="78%" r="10" fill="url(#nodeGradPink)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="35%" cy="88%" r="10" fill="url(#nodeGradCyan)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.3s" repeatCount="indefinite" />
            </circle>
            
            {/* ========== LAYER 3 - HIDDEN 2 (10 nodes) ========== */}
            <circle cx="65%" cy="8%" r="10" fill="url(#nodeGradBlue)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="65%" cy="18%" r="10" fill="url(#nodeGradPurple)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="4.1s" repeatCount="indefinite" />
            </circle>
            <circle cx="65%" cy="28%" r="10" fill="url(#nodeGradCyan)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="65%" cy="38%" r="10" fill="url(#nodeGradPink)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.9s" repeatCount="indefinite" />
            </circle>
            <circle cx="65%" cy="48%" r="12" fill="url(#nodeGradPurple)" filter="url(#strongGlow)" opacity="1">
              <animate attributeName="r" values="10;16;10" dur="4.3s" repeatCount="indefinite" />
            </circle>
            <circle cx="65%" cy="58%" r="10" fill="url(#nodeGradCyan)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.7s" repeatCount="indefinite" />
            </circle>
            <circle cx="65%" cy="68%" r="10" fill="url(#nodeGradBlue)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="65%" cy="78%" r="10" fill="url(#nodeGradPurple)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.4s" repeatCount="indefinite" />
            </circle>
            <circle cx="65%" cy="88%" r="10" fill="url(#nodeGradPink)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.5s" repeatCount="indefinite" />
            </circle>
            
            {/* ========== LAYER 4 - OUTPUT (5 nodes) ========== */}
            <circle cx="88%" cy="28%" r="10" fill="url(#nodeGradCyan)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="4s" repeatCount="indefinite" />
            </circle>
            <circle cx="88%" cy="42%" r="10" fill="url(#nodeGradPurple)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.8s" repeatCount="indefinite" />
            </circle>
            <circle cx="88%" cy="56%" r="14" fill="url(#nodeGradPink)" filter="url(#strongGlow)" opacity="1">
              <animate attributeName="r" values="12;18;12" dur="4.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="88%" cy="70%" r="10" fill="url(#nodeGradBlue)" filter="url(#strongGlow)" opacity="0.9">
              <animate attributeName="r" values="8;14;8" dur="3.9s" repeatCount="indefinite" />
            </circle>
            
            {/* ========== ALL CONNECTIONS - Layer 1 to 2 (FULL MESH) ========== */}
            <line x1="12%" y1="12%" x2="35%" y2="8%" stroke="url(#connCyan)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="12%" x2="35%" y2="28%" stroke="url(#connCyan)" strokeWidth="1" opacity="0.4"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.2s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="24%" x2="35%" y2="18%" stroke="url(#connBlue)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.3s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="24%" x2="35%" y2="38%" stroke="url(#connBlue)" strokeWidth="1" opacity="0.4"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.5s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="36%" x2="35%" y2="28%" stroke="url(#connCyan)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.4s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="36%" x2="35%" y2="48%" stroke="url(#connCyan)" strokeWidth="1" opacity="0.4"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.6s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="48%" x2="35%" y2="38%" stroke="url(#connPurple)" strokeWidth="2" opacity="0.8"><animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="48%" x2="35%" y2="48%" stroke="url(#connPurple)" strokeWidth="2" opacity="0.8"><animate attributeName="opacity" values="0.5;1;0.5" dur="2.7s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="48%" x2="35%" y2="58%" stroke="url(#connPurple)" strokeWidth="2" opacity="0.8"><animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="60%" x2="35%" y2="48%" stroke="url(#connBlue)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.6s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="60%" x2="35%" y2="68%" stroke="url(#connBlue)" strokeWidth="1" opacity="0.4"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="2.9s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="72%" x2="35%" y2="58%" stroke="url(#connCyan)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.7s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="72%" x2="35%" y2="78%" stroke="url(#connCyan)" strokeWidth="1" opacity="0.4"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="84%" x2="35%" y2="78%" stroke="url(#connPurple)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.8s" repeatCount="indefinite" /></line>
            <line x1="12%" y1="84%" x2="35%" y2="88%" stroke="url(#connPurple)" strokeWidth="1" opacity="0.4"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="3.1s" repeatCount="indefinite" /></line>
            
            {/* ========== Layer 2 to 3 (FULL MESH) ========== */}
            <line x1="35%" y1="18%" x2="65%" y2="8%" stroke="url(#connCyan)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" /></line>
            <line x1="35%" y1="28%" x2="65%" y2="18%" stroke="url(#connBlue)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.6s" repeatCount="indefinite" /></line>
            <line x1="35%" y1="38%" x2="65%" y2="28%" stroke="url(#connPurple)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.7s" repeatCount="indefinite" /></line>
            <line x1="35%" y1="48%" x2="65%" y2="38%" stroke="url(#connCyan)" strokeWidth="2" opacity="0.8"><animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite" /></line>
            <line x1="35%" y1="48%" x2="65%" y2="48%" stroke="url(#connCyan)" strokeWidth="2.5" opacity="0.9"><animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" /></line>
            <line x1="35%" y1="48%" x2="65%" y2="58%" stroke="url(#connCyan)" strokeWidth="2" opacity="0.8"><animate attributeName="opacity" values="0.5;1;0.5" dur="2.9s" repeatCount="indefinite" /></line>
            <line x1="35%" y1="58%" x2="65%" y2="48%" stroke="url(#connBlue)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.7s" repeatCount="indefinite" /></line>
            <line x1="35%" y1="68%" x2="65%" y2="68%" stroke="url(#connPurple)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.8s" repeatCount="indefinite" /></line>
            <line x1="35%" y1="78%" x2="65%" y2="78%" stroke="url(#connPurple)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.9s" repeatCount="indefinite" /></line>
            <line x1="35%" y1="88%" x2="65%" y2="88%" stroke="url(#connCyan)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" /></line>
            
            {/* ========== Layer 3 to 4 (FULL MESH) ========== */}
            <line x1="65%" y1="18%" x2="88%" y2="28%" stroke="url(#connPurple)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.6s" repeatCount="indefinite" /></line>
            <line x1="65%" y1="28%" x2="88%" y2="28%" stroke="url(#connCyan)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.7s" repeatCount="indefinite" /></line>
            <line x1="65%" y1="38%" x2="88%" y2="42%" stroke="url(#connPurple)" strokeWidth="2" opacity="0.7"><animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.8s" repeatCount="indefinite" /></line>
            <line x1="65%" y1="48%" x2="88%" y2="56%" stroke="url(#connPurple)" strokeWidth="2.5" opacity="0.9"><animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" /></line>
            <line x1="65%" y1="58%" x2="88%" y2="56%" stroke="url(#connCyan)" strokeWidth="2" opacity="0.7"><animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.9s" repeatCount="indefinite" /></line>
            <line x1="65%" y1="68%" x2="88%" y2="70%" stroke="url(#connBlue)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" /></line>
            <line x1="65%" y1="78%" x2="88%" y2="70%" stroke="url(#connPurple)" strokeWidth="1.5" opacity="0.6"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.1s" repeatCount="indefinite" /></line>
            
            {/* ========== DATA PARTICLES (20+) ========== */}
            <circle r="3" fill="#06b6d4" filter="url(#strongGlow)"><animateMotion path="M 12,12 L 35,8" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" /></circle>
            <circle r="3" fill="#a855f7" filter="url(#strongGlow)"><animateMotion path="M 12,48 L 35,48" dur="2.2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0;1;0" dur="2.2s" repeatCount="indefinite" /></circle>
            <circle r="3" fill="#3b82f6" filter="url(#strongGlow)"><animateMotion path="M 35,48 L 65,48" dur="2.5s" repeatCount="indefinite" /><animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" /></circle>
            <circle r="3" fill="#ec4899" filter="url(#strongGlow)"><animateMotion path="M 65,48 L 88,56" dur="2s" repeatCount="indefinite" /><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" /></circle>
            <circle r="3" fill="#06b6d4" filter="url(#strongGlow)"><animateMotion path="M 12,24 L 35,18 L 65,18 L 88,28" dur="4s" repeatCount="indefinite" /><animate attributeName="opacity" values="0;1;1;0" dur="4s" repeatCount="indefinite" /></circle>
            <circle r="3" fill="#a855f7" filter="url(#strongGlow)"><animateMotion path="M 12,72 L 35,68 L 65,68 L 88,70" dur="4.5s" repeatCount="indefinite" /><animate attributeName="opacity" values="0;1;1;0" dur="4.5s" repeatCount="indefinite" /></circle>
            <circle r="2" fill="#3b82f6" filter="url(#strongGlow)"><animateMotion path="M 12,36 L 35,28" dur="1.8s" repeatCount="indefinite" /><animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" /></circle>
            <circle r="2" fill="#06b6d4" filter="url(#strongGlow)"><animateMotion path="M 35,38 L 65,38" dur="2.3s" repeatCount="indefinite" /><animate attributeName="opacity" values="0;1;0" dur="2.3s" repeatCount="indefinite" /></circle>
            <circle r="2" fill="#ec4899" filter="url(#strongGlow)"><animateMotion path="M 65,58 L 88,56" dur="1.9s" repeatCount="indefinite" /><animate attributeName="opacity" values="0;1;0" dur="1.9s" repeatCount="indefinite" /></circle>
            <circle r="2" fill="#a855f7" filter="url(#strongGlow)"><animateMotion path="M 12,60 L 35,58" dur="2.1s" repeatCount="indefinite" /><animate attributeName="opacity" values="0;1;0" dur="2.1s" repeatCount="indefinite" /></circle>
          </svg>
          
          {/* Enhanced Floating Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
            <div className="absolute text-cyan-400 text-sm font-mono font-bold animate-float-1" style={{top: '8%', left: '3%'}}>AI</div>
            <div className="absolute text-purple-400 text-sm font-mono font-bold animate-float-2" style={{top: '15%', right: '5%'}}>ML</div>
            <div className="absolute text-blue-400 text-xs font-mono animate-float-3" style={{bottom: '10%', left: '5%'}}>Neural Net</div>
            <div className="absolute text-pink-400 text-xs font-mono animate-float-4" style={{bottom: '20%', right: '3%'}}>Deep Learning</div>
            <div className="absolute text-cyan-400/70 text-xs font-mono animate-float-1" style={{top: '45%', left: '2%', animationDelay: '1s'}}>10110101</div>
            <div className="absolute text-purple-400/70 text-xs font-mono animate-float-2" style={{top: '55%', right: '4%', animationDelay: '1.5s'}}>01110011</div>
            <div className="absolute text-blue-400/70 text-xs font-mono animate-float-3" style={{top: '70%', left: '6%', animationDelay: '0.5s'}}>11010110</div>
            <div className="absolute text-pink-400/70 text-xs font-mono animate-float-4" style={{top: '30%', right: '7%', animationDelay: '2s'}}>01001000</div>
          </div>
          
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Enlarged Logo as Hero Element - Crystal Clear */}
            <div className="mb-6 relative">
              {/* Shooting Star Effects */}
              <div className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500 animate-shooting-star-1" />
              <div className="absolute w-1 h-1 bg-purple-400 rounded-full shadow-lg shadow-purple-500 animate-shooting-star-2" />
              <div className="absolute w-2 h-2 bg-pink-400 rounded-full shadow-lg shadow-pink-500 animate-shooting-star-3" />
              
              {/* Expanding Ring Pulses */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="absolute rounded-full border-2 border-cyan-400/40 animate-expand-ring" />
                <div className="absolute rounded-full border-2 border-purple-400/40 animate-expand-ring" style={{animationDelay: '2s'}} />
                <div className="absolute rounded-full border border-blue-400/30 animate-expand-ring" style={{animationDelay: '4s'}} />
              </div>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                  {/* Gradients for Data Streams */}
                  <linearGradient id="streamGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                    <stop offset="30%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="70%" stopColor="#00f0ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="streamGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
                    <stop offset="30%" stopColor="#a855f7" stopOpacity="0.8" />
                    <stop offset="70%" stopColor="#ec4899" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="streamGradient3" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0" />
                    <stop offset="50%" stopColor="#00f0ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                  </linearGradient>
                  
                  {/* Glow Filters - Subtle, Not Blurry */}
                  <filter id="streamGlow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Flowing Stream Path 1 */}
                <path d="M -100 30 Q 20 50, 50 30 T 200 30" 
                      stroke="url(#streamGradient1)" 
                      strokeWidth="2" 
                      fill="none" 
                      opacity="0.6"
                      filter="url(#streamGlow)"
                      strokeLinecap="round">
                  <animate attributeName="d" 
                           values="M -100 30 Q 20 50, 50 30 T 200 30;
                                   M -100 35 Q 20 45, 50 35 T 200 35;
                                   M -100 30 Q 20 50, 50 30 T 200 30"
                           dur="4s" 
                           repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
                </path>
                
                {/* Flowing Stream Path 2 */}
                <path d="M 200 70 Q 80 60, 50 70 T -100 70" 
                      stroke="url(#streamGradient2)" 
                      strokeWidth="2" 
                      fill="none" 
                      opacity="0.6"
                      filter="url(#streamGlow)"
                      strokeLinecap="round">
                  <animate attributeName="d" 
                           values="M 200 70 Q 80 60, 50 70 T -100 70;
                                   M 200 65 Q 80 75, 50 65 T -100 65;
                                   M 200 70 Q 80 60, 50 70 T -100 70"
                           dur="5s" 
                           repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0.7;0.4" dur="4s" repeatCount="indefinite" />
                </path>
                
                {/* Vertical Stream */}
                <path d="M 20 -50 Q 25 20, 20 50 T 20 150" 
                      stroke="url(#streamGradient3)" 
                      strokeWidth="1.5" 
                      fill="none" 
                      opacity="0.5"
                      filter="url(#streamGlow)"
                      strokeLinecap="round">
                  <animate attributeName="d" 
                           values="M 20 -50 Q 25 20, 20 50 T 20 150;
                                   M 20 -50 Q 15 20, 20 50 T 20 150;
                                   M 20 -50 Q 25 20, 20 50 T 20 150"
                           dur="6s" 
                           repeatCount="indefinite" />
                </path>
                
                <path d="M 80 -50 Q 75 20, 80 50 T 80 150" 
                      stroke="url(#streamGradient1)" 
                      strokeWidth="1.5" 
                      fill="none" 
                      opacity="0.5"
                      filter="url(#streamGlow)"
                      strokeLinecap="round">
                  <animate attributeName="d" 
                           values="M 80 -50 Q 75 20, 80 50 T 80 150;
                                   M 80 -50 Q 85 20, 80 50 T 80 150;
                                   M 80 -50 Q 75 20, 80 50 T 80 150"
                           dur="5s" 
                           repeatCount="indefinite" />
                </path>
              </svg>
              
              {/* SHOOTING STARS - Fast Accent Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
                <div className="absolute w-1 h-1 rounded-full bg-cyan-400" 
                     style={{ 
                       boxShadow: '0 0 10px #00f0ff, 0 0 20px #00f0ff',
                       animation: 'shootingStar1 3s ease-in-out infinite'
                     }} />
                <div className="absolute w-1 h-1 rounded-full bg-purple-400" 
                     style={{ 
                       boxShadow: '0 0 10px #a855f7, 0 0 20px #a855f7',
                       animation: 'shootingStar2 4s ease-in-out infinite 1s'
                     }} />
                <div className="absolute w-1 h-1 rounded-full bg-pink-400" 
                     style={{ 
                       boxShadow: '0 0 10px #ec4899, 0 0 20px #ec4899',
                       animation: 'shootingStar3 3.5s ease-in-out infinite 2s'
                     }} />
              </div>
              
              {/* FLOATING GEOMETRIC ACCENTS - Hexagons */}
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
                <div className="absolute" style={{ top: '15%', left: '10%', animation: 'floatSlow 8s ease-in-out infinite' }}>
                  <svg width="30" height="30" viewBox="0 0 30 30">
                    <polygon points="15,2 27,9 27,21 15,28 3,21 3,9" 
                             fill="none" 
                             stroke="#3b82f6" 
                             strokeWidth="1" 
                             opacity="0.4">
                      <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
                    </polygon>
                  </svg>
                </div>
                
                <div className="absolute" style={{ top: '70%', right: '15%', animation: 'floatSlow 10s ease-in-out infinite 2s' }}>
                  <svg width="25" height="25" viewBox="0 0 30 30">
                    <polygon points="15,2 27,9 27,21 15,28 3,21 3,9" 
                             fill="none" 
                             stroke="#a855f7" 
                             strokeWidth="1" 
                             opacity="0.4">
                      <animate attributeName="opacity" values="0.2;0.5;0.2" dur="5s" repeatCount="indefinite" />
                    </polygon>
                  </svg>
                </div>
                
                <div className="absolute" style={{ top: '40%', right: '8%', animation: 'floatSlow 9s ease-in-out infinite 1s' }}>
                  <svg width="20" height="20" viewBox="0 0 30 30">
                    <polygon points="15,2 27,9 27,21 15,28 3,21 3,9" 
                             fill="none" 
                             stroke="#00f0ff" 
                             strokeWidth="1" 
                             opacity="0.4">
                      <animate attributeName="opacity" values="0.2;0.5;0.2" dur="6s" repeatCount="indefinite" />
                    </polygon>
                  </svg>
                </div>
              </div>
              
              {/* EXPANDING RINGS - Occasional Accents */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
                <div className="absolute rounded-full border border-cyan-400/30"
                     style={{ 
                       animation: 'expandRing 4s ease-out infinite',
                       width: '0', 
                       height: '0'
                     }} />
                <div className="absolute rounded-full border border-purple-400/30"
                     style={{ 
                       animation: 'expandRing 4s ease-out infinite 1.5s',
                       width: '0', 
                       height: '0'
                     }} />
                <div className="absolute rounded-full border border-blue-400/30"
                     style={{ 
                       animation: 'expandRing 4s ease-out infinite 3s',
                       width: '0', 
                       height: '0'
                     }} />
              </div>
              
              {/* CRYSTAL CLEAR LOGO - Never Animated, Always Sharp */}
              <div className="inline-flex items-center justify-center relative z-10">
                <img 
                  src="/modelchainlogo-removebg-preview.png" 
                  alt="ModelChain Logo" 
                  className="h-64 md:h-80 lg:h-96 w-auto relative"
                  style={{
                    filter: 'drop-shadow(0 0 40px rgba(59, 130, 246, 0.4)) drop-shadow(0 0 80px rgba(168, 85, 247, 0.2))',
                    imageRendering: 'crisp-edges',
                  }}
                />
              </div>
            </div>

            {/* Tagline - Positioned below enlarged logo */}
            <p className="text-xl md:text-2xl text-dark-text-secondary mb-4 max-w-3xl mx-auto leading-relaxed">
              The world's first <span className="text-primary-400 font-semibold">decentralized AI marketplace</span>. 
              Buy, sell, and validate AI models with <span className="text-secondary-400 font-semibold">blockchain security</span>.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Badge variant="primary" size="lg" className="flex items-center">
                <ShieldCheckIcon className="h-4 w-4 mr-2" />
                Blockchain Secured
              </Badge>
              <Badge variant="secondary" size="lg" className="flex items-center">
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                12K+ Verified Models
              </Badge>
              <Badge variant="accent" size="lg" className="flex items-center">
                <TrophyIcon className="h-4 w-4 mr-2" />
                Industry Leading
              </Badge>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/marketplace/models">
                <Button size="xl" className="group relative overflow-hidden">
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-6 w-6 mr-2" />
                    Explore Marketplace
                    <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
                </Button>
              </Link>
              
              <Link to="/sandbox">
                <Button variant="outline" size="xl" className="group">
                  <div className="flex items-center">
                    <PlayIcon className="h-6 w-6 mr-2" />
                    Try Demo
                  </div>
                </Button>
              </Link>
            </div>

            {/* Stats Preview */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={clsx('text-3xl font-bold mb-2', stat.color)}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-dark-text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Models Section */}
      <section 
        id="featured"
        ref={registerElement}
        className={clsx(
          'py-20 container mx-auto px-6',
          'transition-all duration-1000 transform delay-200',
          isVisible.featured ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        )}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Models</span>
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
            Discover top-rated AI models from our community of developers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredModels.map((model, index) => (
            <Card 
              key={model.id}
              variant="elevated" 
              className={clsx(
                'overflow-hidden group hover:scale-105 transition-all duration-300',
                'transform',
                isVisible.featured ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <img 
                  src={model.image} 
                  alt={model.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  }}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {model.verified && (
                    <Badge variant="success" size="sm">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {model.trending && (
                    <Badge variant="warning" size="sm">
                      <BoltIcon className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center bg-dark-surface-elevated/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-dark-text-primary">{model.rating}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" size="sm">{model.category}</Badge>
                  <span className="text-lg font-bold text-primary-400">{model.price}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-dark-text-primary mb-2">{model.name}</h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-text-muted">{model.downloads} downloads</span>
                  <Link to={`/marketplace/models/${model.id}`}>
                    <Button size="sm" variant="primary">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/marketplace/models">
            <Button size="lg" variant="outline">
              <div className="flex items-center">
                View All Models
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </div>
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        id="how-it-works"
        ref={registerElement}
        className={clsx(
          'py-20 bg-dark-surface-elevated/30',
          'transition-all duration-1000 transform delay-300',
          isVisible['how-it-works'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        )}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
              How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Works</span>
            </h2>
            <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
              Get started with ModelChain in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {howItWorksSteps.map((step, index) => (
              <React.Fragment key={step.step}>
                <div 
                  className={clsx(
                    'text-center relative',
                    'transition-all duration-1000 transform',
                    isVisible['how-it-works'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  )}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="relative z-10">
                    <div className={clsx(
                      'w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center',
                      'bg-gradient-to-br from-primary-500/20 to-secondary-500/20 border border-primary-500/30'
                    )}>
                      <step.icon className={clsx('h-10 w-10', step.color)} />
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-primary-400 mb-2">Step {step.step}</div>
                      <h3 className="text-xl font-bold text-dark-text-primary mb-3">{step.title}</h3>
                      <p className="text-dark-text-secondary">{step.description}</p>
                    </div>
                  </div>
                </div>

                {/* Animated Arrow Between Steps */}
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden lg:flex absolute top-20 items-center justify-center z-20 pointer-events-none"
                    style={{ 
                      left: `${(index + 1) * 25 - 2.5}%`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <ArrowRightIcon 
                      className="h-8 w-8 text-cyan-400 animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 8px rgba(34, 211, 238, 0.8))',
                        animationDuration: '2s'
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section 
        id="tokenomics"
        ref={registerElement}
        className={clsx(
          'py-20 container mx-auto px-6',
          'transition-all duration-1000 transform delay-400',
          isVisible.tokenomics ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        )}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Tokenomics</span>
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
            Built on a sustainable and transparent economic model
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Tokenomics Info */}
          <div className="space-y-8">
            <Card variant="elevated" className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mr-4">
                  <CurrencyDollarIcon className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-text-primary">Model Sales</h3>
                  <p className="text-dark-text-secondary">70% to creators, 20% to validators, 10% to platform</p>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4">
                  <TrophyIcon className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-text-primary">Validation Rewards</h3>
                  <p className="text-dark-text-secondary">Earn tokens for validating model quality and performance</p>
                </div>
              </div>
            </Card>

            <Card variant="elevated" className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                  <LightBulbIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-text-primary">Governance Rights</h3>
                  <p className="text-dark-text-secondary">Token holders vote on platform improvements and policies</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Token Distribution Chart */}
          <div className="relative">
            <div className="w-80 h-80 mx-auto relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                
                {/* Segments */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#3B82F6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="125.6 251.2"
                  strokeDashoffset="0"
                  className="filter drop-shadow-[0_0_10px_#3B82F6]"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10B981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="75.36 251.2"
                  strokeDashoffset="-125.6"
                  className="filter drop-shadow-[0_0_10px_#10B981]"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#F59E0B"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="50.24 251.2"
                  strokeDashoffset="-200.96"
                  className="filter drop-shadow-[0_0_10px_#F59E0B]"
                />
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-400">MCT</div>
                  <div className="text-sm text-dark-text-muted">Token</div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                <span className="text-dark-text-secondary">Community & Ecosystem (50%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-dark-text-secondary">Team & Advisors (30%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-dark-text-secondary">Treasury & Operations (20%)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section 
        id="trust"
        ref={registerElement}
        className={clsx(
          'py-20 bg-dark-surface-elevated/30',
          'transition-all duration-1000 transform delay-500',
          isVisible.trust ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        )}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
              Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Trust</span> ModelChain?
            </h2>
            <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
              Built with security, transparency, and community at its core
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustIndicators.map((indicator, index) => (
              <div
                key={index}
                className={clsx(
                  'group relative overflow-hidden',
                  'bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90',
                  'backdrop-blur-xl',
                  'border border-gray-700/50',
                  'rounded-2xl p-8',
                  'transition-all duration-500',
                  'hover:scale-105 hover:border-cyan-500/50',
                  'hover:shadow-[0_0_30px_rgba(6,182,212,0.3),0_0_60px_rgba(6,182,212,0.1)]',
                  'transform',
                  isVisible.trust ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Animated gradient border glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl" />
                
                {/* Animated corner accents */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-500/30 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-24 group-hover:h-24" />
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-purple-500/30 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-24 group-hover:h-24" />
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon container with dual-layer glow */}
                  <div className="relative inline-block mb-6">
                    {/* Outer glow ring */}
                    <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 animate-pulse" />
                    
                    {/* Icon background */}
                    <div className="relative w-20 h-20 mx-auto bg-gradient-to-br from-cyan-600/20 via-blue-600/20 to-purple-600/20 rounded-2xl flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                      {/* Inner glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <indicator.icon className="relative h-10 w-10 text-cyan-400 group-hover:text-cyan-300 transition-all duration-500 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    </div>
                  </div>
                  
                  {/* Title with gradient on hover */}
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:via-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                    {indicator.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {indicator.description}
                  </p>
                </div>
                
                {/* Subtle scanning line effect */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section 
        id="testimonials"
        ref={registerElement}
        className={clsx(
          'py-20 container mx-auto px-6',
          'transition-all duration-1000 transform delay-600',
          isVisible.testimonials ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        )}
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Community</span> Says
          </h2>
          <p className="text-xl text-dark-text-secondary max-w-3xl mx-auto">
            Trusted by developers and organizations worldwide
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card variant="elevated" className="p-8 text-center">
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl text-dark-text-primary mb-6 italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
            </div>
            
            <div className="flex items-center justify-center">
              <img 
                src={testimonials[currentTestimonial].avatar} 
                alt={testimonials[currentTestimonial].name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div className="text-left">
                <div className="font-semibold text-dark-text-primary">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-sm text-dark-text-secondary">
                  {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                </div>
              </div>
            </div>
          </Card>

          {/* Testimonial indicators */}
          <div className="flex justify-center mt-6 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={clsx(
                  'w-3 h-3 rounded-full transition-all duration-300',
                  currentTestimonial === index 
                    ? 'bg-primary-400 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.8)]' 
                    : 'bg-gray-600 hover:bg-primary-400/60 hover:scale-110'
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section 
        id="cta"
        ref={registerElement}
        className={clsx(
          'py-20 bg-gradient-to-r from-primary-500/10 to-secondary-500/10',
          'transition-all duration-1000 transform delay-700',
          isVisible.cta ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        )}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-dark-text-primary mb-6">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Get Started?</span>
          </h2>
          <p className="text-xl text-dark-text-secondary mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already building the future of AI
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg h-14 min-w-[280px] font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg border border-cyan-400/30 shadow-lg hover:shadow-cyan-500/50 hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <RocketLaunchIcon className="h-6 w-6 mr-2" />
              <span>Start Building Today</span>
              <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/marketplace/browse" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg h-14 min-w-[280px] font-bold text-white border-2 border-cyan-500/50 hover:bg-cyan-500/20 hover:border-cyan-400 rounded-lg bg-transparent backdrop-blur-sm hover:shadow-cyan-500/30 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <LightBulbIcon className="h-6 w-6 mr-2" />
              <span>Browse Models</span>
              <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;