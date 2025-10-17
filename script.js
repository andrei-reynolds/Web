// Modern Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.skill-category, .work-item, .social-link');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Parallax effect for floating shapes
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
        });
    });

    // Typing effect for hero title
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Animate skill items on hover
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
            this.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.boxShadow = 'none';
        });
    });

    // Work item hover effects
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach(item => {
        const overlay = item.querySelector('.work-overlay');
        const image = item.querySelector('.work-image img');
        
        item.addEventListener('mouseenter', function() {
            overlay.style.opacity = '1';
            image.style.transform = 'scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            overlay.style.opacity = '0';
            image.style.transform = 'scale(1)';
        });
    });

    // Button ripple effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple effect CSS
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Scroll progress indicator
    function updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // Create progress bar if it doesn't exist
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                z-index: 9999;
                transition: width 0.1s ease;
            `;
            document.body.appendChild(progressBar);
        }
        
        progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', updateScrollProgress);

    // Add floating particles effect
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            animation: float-particle 6s linear infinite;
        `;
        
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = window.innerHeight + 'px';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 6000);
    }

    // Add particle animation CSS
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float-particle {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(-100vh) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(particleStyle);

    // Create particles periodically
    setInterval(createParticle, 3000);

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Animate hero elements
        const heroElements = document.querySelectorAll('.hero-text > *');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    });

    // Add loading styles
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        body:not(.loaded) .hero-text > * {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
    `;
    document.head.appendChild(loadingStyle);

    // Contact form validation (if you add a form later)
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Add smooth reveal animation for sections
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });

    // Add section reveal styles
    const sectionStyle = document.createElement('style');
    sectionStyle.textContent = `
        .section-hidden {
            opacity: 0;
            transform: translateY(50px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .section-hidden.revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(sectionStyle);

    // Add cursor trail effect
    let mouseX = 0, mouseY = 0;
    let trail = [];

    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        trail.push({ x: mouseX, y: mouseY, time: Date.now() });
        
        if (trail.length > 20) {
            trail.shift();
        }
        
        updateTrail();
    });

    function updateTrail() {
        const trailElement = document.querySelector('.cursor-trail') || createTrailElement();
        
        trailElement.innerHTML = trail.map((point, index) => {
            const opacity = (index + 1) / trail.length;
            const size = (index + 1) / trail.length * 10;
            return `
                <div style="
                    position: fixed;
                    left: ${point.x - size/2}px;
                    top: ${point.y - size/2}px;
                    width: ${size}px;
                    height: ${size}px;
                    background: radial-gradient(circle, rgba(102, 126, 234, ${opacity}) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9998;
                    transition: all 0.1s ease;
                "></div>
            `;
        }).join('');
    }

    function createTrailElement() {
        const trailElement = document.createElement('div');
        trailElement.className = 'cursor-trail';
        trailElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9998;
        `;
        document.body.appendChild(trailElement);
        return trailElement;
    }

    // Clean up old trail points
    setInterval(() => {
        const now = Date.now();
        trail = trail.filter(point => now - point.time < 1000);
    }, 100);

    console.log('🎵 Andrew Reynolds Portfolio - Interactive effects loaded! 🎵');
});
