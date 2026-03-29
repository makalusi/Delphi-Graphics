tailwind.config = {
    theme: {
        extend: {
            colors: {
                'delphi-pink': '#ec008c',
                'delphi-yellow': '#fdb913',
                'delphi-blue': '#00aeef',
                'delphi-cyan': '#27aae1',
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Hero Slideshow Logic
    const heroSlideshow = document.getElementById('hero-slideshow');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    const heroNext = document.getElementById('hero-next');
    const heroPrev = document.getElementById('hero-prev');

    if (heroSlideshow && heroSlides.length > 0) {
        let currentHeroSlide = 0;
        let heroInterval;
        const intervalTime = 4000;

        function showHeroSlide(index) {
            heroSlides.forEach(slide => slide.classList.remove('active'));
            heroDots.forEach(dot => dot.classList.remove('active'));

            heroSlides[index].classList.add('active');
            heroDots[index].classList.add('active');
            currentHeroSlide = index;
        }

        function nextHeroSlide() {
            let nextIndex = (currentHeroSlide + 1) % heroSlides.length;
            showHeroSlide(nextIndex);
        }

        function startHeroInterval() {
            heroInterval = setInterval(nextHeroSlide, intervalTime);
        }

        function resetHeroInterval() {
            clearInterval(heroInterval);
            startHeroInterval();
        }

        // Auto-play
        startHeroInterval();

        // Pause on Hover
        heroSlideshow.addEventListener('mouseenter', () => clearInterval(heroInterval));
        heroSlideshow.addEventListener('mouseleave', startHeroInterval);

        // Arrows
        if (heroNext) {
            heroNext.addEventListener('click', () => {
                nextHeroSlide();
                resetHeroInterval();
            });
        }
        if (heroPrev) {
            heroPrev.addEventListener('click', () => {
                let prevIndex = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
                showHeroSlide(prevIndex);
                resetHeroInterval();
            });
        }

        // Dots
        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showHeroSlide(index);
                resetHeroInterval();
            });
        });
    }

    // Carousel Navigation Logic
    const navButtons = document.querySelectorAll('.nav-button');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const container = document.getElementById(targetId);

            if (container) {
                const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of view width

                if (button.classList.contains('next')) {
                    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                } else {
                    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
            }
        });
    });

    // Auto-scroll for Shop by Collection
    const collectionCarousel = document.getElementById('collection-carousel');
    if (collectionCarousel) {
        // Clone items for infinite effect
        const items = Array.from(collectionCarousel.children);
        // We clone enough items to fill the view plus some buffer. 
        // For simplicity, let's clone the entire set once.
        items.forEach(item => {
            const clone = item.cloneNode(true);
            collectionCarousel.appendChild(clone);
        });

        let scrollSpeed = 1; // Pixels per frame
        let isPaused = false;
        let animationId;

        // Calculate the width of the original set of items logic
        // We can check the offsetLeft of the first cloned item to find the loop point
        // But since we appended clones after, the loop point is the width of the original content.
        // Let's assume the first clone starts immediately after the last original item.

        function autoScroll() {
            if (!isPaused) {
                collectionCarousel.scrollLeft += scrollSpeed;

                // If we've scrolled past the first set of items, reset to 0
                // Since we duplicated exactly once, the scrollWidth is approximately 2x the original content width.
                // We want to loop when scrollLeft hits the start of the cloned items.
                // The start of the cloned items is roughly scrollWidth / 2.

                if (collectionCarousel.scrollLeft >= (collectionCarousel.scrollWidth / 2)) {
                    collectionCarousel.scrollLeft = 0;
                    // For smoother loop if pixels don't match exactly:
                    // collectionCarousel.scrollLeft = collectionCarousel.scrollLeft - (collectionCarousel.scrollWidth / 2);
                }
            }
            animationId = requestAnimationFrame(autoScroll);
        }

        // Start animation
        animationId = requestAnimationFrame(autoScroll);

        // Pause on hover
        collectionCarousel.addEventListener('mouseenter', () => {
            isPaused = true;
        });

        collectionCarousel.addEventListener('mouseleave', () => {
            isPaused = false;
        });

        // Also pause if touching (for mobile)
        collectionCarousel.addEventListener('touchstart', () => {
            isPaused = true;
        });
        collectionCarousel.addEventListener('touchend', () => {
            isPaused = false;
        });

        // Navigation Buttons Logic integration
        // Buttons are already handled by the generic logic above, but we might want to ensure they handle the loop or pause.
        // currently the generic logic just scrolls by `scrollAmount`. 
        // If user clicks generic next/prev, `scrollLeft` updates.
        // If it goes out of bounds of the loop, our `autoScroll` check needs to handle it.

        const prevBtn = document.querySelector('.nav-button.prev[data-target="collection-carousel"]');
        const nextBtn = document.querySelector('.nav-button.next[data-target="collection-carousel"]');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                // Check underflow
                // If we go below 0, we should jump to the end of the first set (which is same visual point as end of cloned set)
                if (collectionCarousel.scrollLeft <= 0) {
                    collectionCarousel.scrollLeft = collectionCarousel.scrollWidth / 2;
                }
            });
        }
        // Next button logic is naturally handled by the autoScroll loop check usually, 
        // but if the click pushes it way past, we might want to check immediately.
    }

    // Mobile Menu Toggle Logic
    const mobileToggle = document.getElementById('mobile-toggle');
    const leftSidebar = document.getElementById('left-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (mobileToggle && leftSidebar) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            leftSidebar.classList.toggle('active-mobile');
            if (sidebarOverlay) {
                sidebarOverlay.classList.toggle('active-mobile');
            }
        });

        // Close sidebar when clicking overlay
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                leftSidebar.classList.remove('active-mobile');
                sidebarOverlay.classList.remove('active-mobile');
            });
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth < 768 &&
                !leftSidebar.contains(e.target) &&
                !mobileToggle.contains(e.target)) {
                leftSidebar.classList.remove('active-mobile');
                if (sidebarOverlay) sidebarOverlay.classList.remove('active-mobile');
            }
        });
    }

    // Toggle fly-out on mobile click
    const categoryFolders = document.querySelectorAll('.group\\/cat');
    categoryFolders.forEach(folder => {
        folder.addEventListener('click', (e) => {
            if (window.innerWidth < 768) {
                // Prevent closing the whole sidebar if it's a mobile click
                e.stopPropagation();
                // Toggle this one, close others
                categoryFolders.forEach(other => {
                    if (other !== folder) other.classList.remove('active-panel');
                });
                folder.classList.toggle('active-panel');
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Back to top functionality
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-4');
            } else {
                backToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-4');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Predictive Search Logic
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchResultsList = document.getElementById('search-results-list');
    
    // Mobile Search Elements
    const mobileSearchBtn = document.getElementById('mobile-search-btn');
    const mobileSearchOverlay = document.getElementById('mobile-search-overlay');
    const closeMobileSearch = document.getElementById('close-mobile-search');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchResults = document.getElementById('mobile-search-results');
    
    let servicesData = null;
    let searchTimeout = null;

    async function fetchServices() {
        if (servicesData) return servicesData;
        try {
            const response = await fetch('./data/services.json');
            servicesData = await response.json();
            return servicesData;
        } catch (error) {
            console.error('Failed to fetch services:', error);
            return null;
        }
    }

    function showResults(results, container, isMobile = false) {
        if (!container) return;
        container.innerHTML = '';
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="p-8 text-center text-gray-400">
                    <p class="text-sm">No services found matching your search.</p>
                </div>
            `;
        } else {
            results.forEach(result => {
                const item = document.createElement('div');
                if (isMobile) {
                    item.className = 'p-4 bg-gray-50 rounded-2xl flex items-center gap-4 active:bg-gray-100 transition-colors';
                } else {
                    item.className = 'p-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-4 border-b border-gray-50 last:border-none';
                }
                
                item.innerHTML = `
                    <div class="w-12 h-12 rounded-xl bg-white border border-gray-100 flex-shrink-0 overflow-hidden">
                        <img src="${result.data.image}" alt="${result.data.title}" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-grow">
                        <div class="text-sm font-bold text-gray-900">${result.data.title}</div>
                        <div class="text-[10px] text-delphi-cyan uppercase font-bold tracking-wider">${result.data.category}</div>
                    </div>
                `;
                item.onclick = () => {
                    window.location.href = `service-detail.html?item=${result.id}`;
                };
                container.appendChild(item);
            });
        }
        
        if (!isMobile) searchResults.classList.remove('hidden');
    }

    // Desktop Search Input
    if (searchInput) {
        searchInput.addEventListener('input', async (e) => {
            const query = e.target.value.toLowerCase().trim();
            clearTimeout(searchTimeout);
            if (query.length < 2) {
                searchResults.classList.add('hidden');
                return;
            }
            searchTimeout = setTimeout(async () => {
                const data = await fetchServices();
                if (!data) return;
                const results = Object.entries(data)
                    .filter(([id, service]) => 
                        service.title.toLowerCase().includes(query) ||
                        service.category.toLowerCase().includes(query) ||
                        (service.tagline && service.tagline.toLowerCase().includes(query))
                    )
                    .map(([id, service]) => ({ id, data: service }))
                    .slice(0, 6);
                showResults(results, searchResultsList);
            }, 300);
        });

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });

        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length >= 2 && searchResultsList.children.length > 0) {
                searchResults.classList.remove('hidden');
            }
        });
    }

    // Mobile Search Overlay Logic
    if (mobileSearchBtn && mobileSearchOverlay) {
        mobileSearchBtn.addEventListener('click', () => {
            mobileSearchOverlay.classList.remove('translate-y-full', 'invisible', 'pointer-events-none');
            mobileSearchOverlay.classList.add('translate-y-0');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            setTimeout(() => mobileSearchInput?.focus(), 300);
        });

        const closeOverlay = () => {
            mobileSearchOverlay.classList.remove('translate-y-0');
            mobileSearchOverlay.classList.add('translate-y-full', 'invisible', 'pointer-events-none');
            document.body.style.overflow = ''; // Restore scroll
        };

        closeMobileSearch?.addEventListener('click', closeOverlay);
    }

    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', async (e) => {
            const query = e.target.value.toLowerCase().trim();
            clearTimeout(searchTimeout);
            
            if (query.length < 2) {
                if (mobileSearchResults) mobileSearchResults.innerHTML = '';
                return;
            }

            searchTimeout = setTimeout(async () => {
                const data = await fetchServices();
                if (!data) return;
                const results = Object.entries(data)
                    .filter(([id, service]) => 
                        service.title.toLowerCase().includes(query) ||
                        service.category.toLowerCase().includes(query) ||
                        (service.tagline && service.tagline.toLowerCase().includes(query))
                    )
                    .map(([id, service]) => ({ id, data: service }))
                    .slice(0, 10); // Show more on mobile scrollable list
                showResults(results, mobileSearchResults, true);
            }, 300);
        });
    }
});
