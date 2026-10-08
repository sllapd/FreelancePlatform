const landingData = {
    services: [
        {
            title: 'Luxury React + TypeScript launch page',
            price: '$8,500',
            rating: 4.9,
            reviewCount: 47,
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
            seller: {
                name: 'Alex Sokolov',
                role: 'Development',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
            }
        },
        {
            title: 'Brand identity & visual system',
            price: '$5,200',
            rating: 4.8,
            reviewCount: 63,
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
            seller: {
                name: 'Marina Lebedeva',
                role: 'Design',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80'
            }
        },
        {
            title: 'Performance-focused growth strategy',
            price: '$6,900',
            rating: 4.7,
            reviewCount: 39,
            image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80',
            seller: {
                name: 'Elena Popova',
                role: 'Marketing',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
            }
        },
        {
            title: 'Conversion-first landing experience',
            price: '$4,800',
            rating: 4.9,
            reviewCount: 29,
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
            seller: {
                name: 'Dmitry Volkov',
                role: 'Strategy',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
            }
        }
    ],
    testimonials: [
        {
            name: 'Nikolai Fedorov',
            role: 'CEO, TechStart',
            text: 'The quality of talent here is exceptional. We found a partner who understood our brand, timeline, and ambition from day one.',
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
        },
        {
            name: 'Svetlana Morozova',
            role: 'Marketing Director',
            text: 'It felt premium from start to finish. The collaboration was clear, thoughtful, and the final result exceeded our expectations.',
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
        },
        {
            name: 'Artem Belov',
            role: 'E-commerce Founder',
            text: 'We hired specialists across design and growth. The process was smooth, transparent, and the outcome was genuinely impressive.',
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80'
        }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (portfolioGrid) {
        portfolioGrid.innerHTML = landingData.services.map(item => `
            <article class="portfolio-card">
                <img src="${item.image}" alt="${item.title}">
                <div class="card-body">
                    <div class="card-meta">
                        <img src="${item.seller.avatar}" alt="${item.seller.name}" class="card-avatar">
                        <div>
                            <div class="card-author">${item.seller.name}</div>
                            <div class="card-role">${item.seller.role}</div>
                        </div>
                    </div>
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-footer">
                        <span>★ ${item.rating} (${item.reviewCount})</span>
                        <span class="card-price">${item.price}</span>
                    </div>
                </div>
            </article>
        `).join('');
    }

    const testimonialsGrid = document.getElementById('testimonials-grid');
    if (testimonialsGrid) {
        testimonialsGrid.innerHTML = landingData.testimonials.map(item => `
            <article class="testimonial-card">
                <div class="testimonial-stars">★★★★★</div>
                <p>“${item.text}”</p>
                <div class="testimonial-author">
                    <img src="${item.avatar}" alt="${item.name}">
                    <div>
                        <div class="testimonial-name">${item.name}</div>
                        <div class="testimonial-role">${item.role}</div>
                    </div>
                </div>
            </article>
        `).join('');
    }

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
