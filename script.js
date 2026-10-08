const landingData = {
    categories: [
        { name: 'Development', icon: '💻', count: 1240 },
        { name: 'Design', icon: '🎨', count: 890 },
        { name: 'Marketing', icon: '📈', count: 670 },
        { name: 'Content', icon: '✍️', count: 450 }
    ],
    services: [
        {
            title: 'Enterprise React + TypeScript Application',
            category: 'Development',
            price: '$12,500',
            rating: 4.9,
            reviewCount: 47,
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop&auto=format',
            seller: { name: 'Alex Sokolov', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format' }
        },
        {
            title: 'Premium Brand Identity & Logo System',
            category: 'Design',
            price: '$5,000',
            rating: 4.8,
            reviewCount: 63,
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop&auto=format',
            seller: { name: 'Marina Lebedeva', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format' }
        },
        {
            title: 'Full-Stack SaaS Platform Development',
            category: 'Development',
            price: '$25,000',
            rating: 5.0,
            reviewCount: 28,
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&auto=format',
            seller: { name: 'Dmitry Volkov', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&auto=format' }
        },
        {
            title: 'Social Media Strategy & Content Calendar',
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
            text: 'Found an exceptional developer within hours. Project delivered on time with outstanding quality and attention to detail.', 
            rating: 5, 
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop&auto=format' 
        },
        { 
            name: 'Svetlana Morozova', 
            role: 'Marketing Director', 
            text: 'The designer exceeded every expectation. Our brand identity looks premium and exactly captures our vision. Highly recommended!', 
            rating: 5, 
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&auto=format' 
        },
        { 
            name: 'Artem Belov', 
            role: 'E-commerce Founder', 
            text: 'Hired three specialists through the platform. Our traffic increased 40% in month one. The quality of talent here is unmatched.', 
            rating: 5, 
            avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=80&h=80&fit=crop&auto=format' 
        }
    ]
};

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -80px 0px'
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
    // Render categories with staggered animations
    const catContainer = document.getElementById('categories-grid');
    if (catContainer) {
        catContainer.innerHTML = landingData.categories.map((cat, index) => `
            <div class="category-card animate-slide-up" style="animation-delay: ${index * 0.1}s;">
                <span class="icon">${cat.icon}</span>
                <div class="name">${cat.name}</div>
                <div class="count">${cat.count} specialists</div>
            </div>
        `).join('');
    }

    // Render portfolio with enhanced animations
    const portfolioContainer = document.getElementById('portfolio-grid');
    if (portfolioContainer) {
        portfolioContainer.innerHTML = landingData.services.map((item, index) => `
            <div class="portfolio-card animate-scale-in" style="animation-delay: ${index * 0.15}s;">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="content">
                    <div>
                        <div class="flex items-center gap-3 mb-4">
                            <img src="${item.seller.avatar}" class="w-10 h-10 rounded-full object-cover ring-2 ring-accent/40" alt="${item.seller.name}">
                            <div>
                                <p class="text-sm font-medium text-gray-200">${item.seller.name}</p>
                                <p class="text-xs text-accent font-light">${item.category}</p>
                            </div>
                        </div>
                        <h3 class="font-display font-bold text-lg text-white mb-4 leading-snug">${item.title}</h3>
                    </div>
                    <div class="flex justify-between items-center pt-4 border-t border-dark-tertiary">
                        <span class="text-sm text-accent font-semibold">★ ${item.rating} <span class="text-gray-500">(${ item.reviewCount})</span></span>
                        <span class="font-display font-bold text-accent text-xl">${item.price}</span>
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
                <p class="text">${t.text}</p>
                <div class="author">
                    <img src="${t.avatar}" class="avatar" alt="${t.name}">
                    <div>
                        <div class="author-name">${t.name}</div>
                        <div class="author-role">${t.role}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Parallax effect on mouse move
    let ticking = false;
    document.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const floatElements = document.querySelectorAll('[class*="animate-float"]');
                const x = (e.clientX / window.innerWidth - 0.5) * 20;
                const y = (e.clientY / window.innerHeight - 0.5) * 20;
                
                floatElements.forEach((el, index) => {
                    const offset = (index + 1) * 0.5;
                    el.style.transform = `translate(${x * offset}px, ${y * offset}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
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
        }, { rootMargin: '50px' });

        document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
    }

    // Add scroll spy for navigation highlighting
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

    // Observe elements for animations
    document.querySelectorAll('[class*="animate-"]').forEach(el => {
        observer.observe(el);
    });

    // Add page load animation
    document.body.classList.add('loaded');
    
    // Trigger animations on elements with animation classes
    document.querySelectorAll('[class*="animate-"]').forEach((el, index) => {
        const delay = el.style.animationDelay || '0s';
        if (!delay) {
            el.style.animationDelay = `${index * 0.05}s`;
        }
    });

    // Button ripple effect
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            const ripple = document.createElement('span');
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'scale 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
});