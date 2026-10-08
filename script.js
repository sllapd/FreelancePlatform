const landingData = {
    categories: [
        { name: 'Development', icon: '💻', count: 1240 },
        { name: 'Design', icon: '🎨', count: 890 },
        { name: 'Marketing', icon: '📈', count: 670 },
        { name: 'Content', icon: '✍️', count: 450 }
    ],
    portfolio: [
        {
            title: 'Enterprise React Dashboard',
            category: 'Development',
            price: '$12,500',
            rating: 4.9,
            reviewCount: 47,
            image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=600&h=400&fit=crop&auto=format',
            seller: { name: 'Alex Sokolov', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format' }
        },
        {
            title: 'Brand Identity & Logo Design',
            category: 'Design',
            price: '$5,000',
            rating: 4.8,
            reviewCount: 63,
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop&auto=format',
            seller: { name: 'Marina Lebedeva', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format' }
        },
        {
            title: 'Full-Stack SaaS Application',
            category: 'Development',
            price: '$25,000',
            rating: 5.0,
            reviewCount: 28,
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format',
            seller: { name: 'Dmitry Volkov', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format' }
        },
        {
            title: 'Social Media Strategy & Content',
            category: 'Marketing',
            price: '$8,000',
            rating: 4.7,
            reviewCount: 39,
            image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop&auto=format',
            seller: { name: 'Elena Popova', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format' }
        }
    ],
    testimonials: [
        { 
            name: 'Nikolai Fedorov', 
            role: 'CEO, TechStart', 
            text: 'Found the perfect developer within hours. Project delivered on time with exceptional quality. Highly recommend.', 
            rating: 5, 
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&auto=format' 
        },
        { 
            name: 'Svetlana Morozova', 
            role: 'Marketing Director', 
            text: 'The designer exceeded all expectations. Logo and branding package were exactly what we needed. Amazing platform!', 
            rating: 5, 
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&auto=format' 
        },
        { 
            name: 'Artem Belov', 
            role: 'E-commerce Owner', 
            text: 'Hired multiple specialists through the platform. Traffic increased by 40% in the first month. Outstanding results!', 
            rating: 5, 
            avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&auto=format' 
        }
    ]
};

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Render categories with animations
    const catContainer = document.getElementById('categories-grid');
    if (catContainer) {
        catContainer.innerHTML = landingData.categories.map((cat, index) => `
            <div class="category-card animate-slide-up" style="animation-delay: ${index * 0.1}s;">
                <div class="icon">${cat.icon}</div>
                <div class="font-display font-semibold text-slate-900 text-slate-900 text-sm" style="color: #ffffff;">
                    ${cat.name}
                </div>
                <div class="text-xs text-gray-400 mt-1">${cat.count} specialists</div>
            </div>
        `).join('');
    }

    // Render portfolio with enhanced animations
    const portfolioContainer = document.getElementById('portfolio-grid');
    if (portfolioContainer) {
        portfolioContainer.innerHTML = landingData.portfolio.map((item, index) => `
            <div class="portfolio-card animate-scale-in" style="animation-delay: ${index * 0.15}s;">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="p-6">
                    <div class="flex items-center gap-3 mb-3">
                        <img src="${item.seller.avatar}" class="w-8 h-8 rounded-full object-cover ring-2 ring-accent/50" alt="${item.seller.name}">
                        <div>
                            <p class="text-sm font-medium text-gray-300">${item.seller.name}</p>
                            <p class="text-xs text-accent">${item.category}</p>
                        </div>
                    </div>
                    <h3 class="font-display font-semibold text-white text-base mb-4 leading-tight">${item.title}</h3>
                    <div class="flex justify-between items-center pt-4 border-t border-dark-tertiary">
                        <span class="text-sm text-accent font-semibold">★ ${item.rating} <span class="text-gray-500">(${item.reviewCount})</span></span>
                        <span class="font-display font-bold text-accent text-lg">${item.price}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render testimonials with stagger effect
    const testimonialContainer = document.getElementById('testimonials-grid');
    if (testimonialContainer) {
        testimonialContainer.innerHTML = landingData.testimonials.map((t, index) => `
            <div class="testimonial-card animate-slide-up" style="animation-delay: ${index * 0.1}s;">
                <div class="stars">★★★★★</div>
                <p class="text-gray-300 text-sm leading-relaxed mb-5 font-light italic">"${t.text}"</p>
                <div class="flex items-center gap-3 pt-4 border-t border-dark-tertiary">
                    <img src="${t.avatar}" class="w-10 h-10 rounded-full object-cover ring-2 ring-accent/50" alt="${t.name}">
                    <div>
                        <div class="font-semibold text-sm text-white">${t.name}</div>
                        <div class="text-xs text-gray-500">${t.role}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Add observer to animate elements on scroll
    const animateElements = document.querySelectorAll('[class*="animate-"]');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Counter animation for stats
    const animateCounter = (element, target, duration = 2000) => {
        let current = 0;
        const increment = target / (duration / 16);
        
        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    };

    // Observe stats section for counter animation
    const statsElements = document.querySelectorAll('.font-display.text-6xl');
    statsElements.forEach(el => {
        observer.observe(el);
        el.addEventListener('animationstart', () => {
            const text = el.textContent.replace(/[^0-9]/g, '');
            if (text) {
                animateCounter(el, parseInt(text));
            }
        });
    });

    // Add parallax effect to background elements
    window.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        document.querySelectorAll('.float-element').forEach((el, index) => {
            const offset = (index + 1) * 10;
            el.style.transform = `translate(${x * offset}px, ${y * offset}px)`;
        });
    });

    // Lazy loading images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    // Add ripple effect to buttons
    document.querySelectorAll('button').forEach(button => {
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
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Scroll spy for navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-accent');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('text-accent');
            }
        });
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.remove('loading');
    });

    // Trigger animations on page load
    document.querySelectorAll('[class*="animate-"]').forEach((el, index) => {
        el.style.animationDelay = `${index * 0.05}s`;
    });
});