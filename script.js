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
            text: 'The designer exceeded every expectation. Our brand identity looks premium and exactly captures our vision. Highly recommended.', 
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

document.addEventListener('DOMContentLoaded', () => {
    // Render categories
    const catContainer = document.getElementById('categories-grid');
    if (catContainer) {
        catContainer.innerHTML = landingData.categories.map(cat => `
            <div class="category-card">
                <span class="icon">${cat.icon}</span>
                <div class="name">${cat.name}</div>
                <div class="count">${cat.count} specialists</div>
            </div>
        `).join('');
    }

    // Render portfolio
    const portfolioContainer = document.getElementById('portfolio-grid');
    if (portfolioContainer) {
        portfolioContainer.innerHTML = landingData.services.map(item => `
            <div class="portfolio-card">
                <img src="${item.image}" alt="${item.title}" loading="lazy">
                <div class="content">
                    <div>
                        <div class="seller">
                            <img src="${item.seller.avatar}" alt="${item.seller.name}" class="seller-img">
                            <div class="seller-info">
                                <div class="seller-name">${item.seller.name}</div>
                                <div class="seller-role">${item.category}</div>
                            </div>
                        </div>
                        <h3>${item.title}</h3>
                    </div>
                    <div class="footer">
                        <span class="rating">★ ${item.rating} (${item.reviewCount})</span>
                        <span class="price">${item.price}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render testimonials
    const testimonialContainer = document.getElementById('testimonials-grid');
    if (testimonialContainer) {
        testimonialContainer.innerHTML = landingData.testimonials.map(t => `
            <div class="testimonial-card">
                <div class="stars">★★★★★</div>
                <p class="text">"${t.text}"</p>
                <div class="author">
                    <img src="${t.avatar}" alt="${t.name}" class="avatar">
                    <div class="author-info">
                        <div class="author-name">${t.name}</div>
                        <div class="author-role">${t.role}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Smooth scroll for links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});