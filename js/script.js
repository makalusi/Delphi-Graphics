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
    const slides = [
        {
            image: './assets/banner images-01.png',
            title: 'Turn Prospects into Partners',
            subtitle: 'with Premium Brochures.'
        },
        {
            image: './assets/banner images-02.png',
            title: 'Make a Lasting Impression',
            subtitle: 'with Custom Business Cards.'
        },
        {
            image: './assets/banner images-03.png',
            title: 'Showcase Your Brand',
            subtitle: 'with Vibrant Banners.'
        },
        {
            image: './assets/banner images-04.png',
            title: 'Promote Your Business',
            subtitle: 'with Unique Gifts.'
        },
        {
            image: './assets/banner images-05.png',
            title: 'Professional Packaging',
            subtitle: 'that Tells Your Story.'
        }
    ];

    let currentSlide = 0;
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroImage = document.getElementById('hero-image');
    const heroTextContainer = document.getElementById('hero-text-container');

    if (heroTitle && heroSubtitle && heroImage && heroTextContainer) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            const slide = slides[currentSlide];

            // Animate Out
            // Text slides down and fades out
            heroTextContainer.style.opacity = '0';
            heroTextContainer.style.transform = 'translateY(20px)';

            // Image slides right and fades out
            heroImage.style.opacity = '0';
            heroImage.style.transform = 'translateX(100px) scale(0.9)';

            setTimeout(() => {
                // Update content while invisible
                heroTitle.innerText = slide.title;
                heroSubtitle.innerText = slide.subtitle;
                heroImage.src = slide.image;

                // Reset position for entry animation (jump to starting position for "slide in")
                // We want text to come from UP (-20px) and image from LEFT/RIGHT
                // But to make it smooth, let's just reverse the exit.
                // Reset to "start" state for entering

                // For a cool effect:
                // 1. Exit: Text goes Down, Image goes Right
                // 2. Wait
                // 3. Setup Entry: Text starts Up, Image starts Right

                heroTextContainer.style.transition = 'none'; // Disable transition for instant snap
                heroImage.style.transition = 'none';

                heroTextContainer.style.transform = 'translateY(-20px)';
                heroImage.style.transform = 'translateX(50px) scale(1.05)';

                // Force reflow
                void heroTextContainer.offsetWidth;

                // Animate In
                heroTextContainer.style.transition = 'all 700ms ease-out';
                heroImage.style.transition = 'all 700ms ease-out';

                heroTextContainer.style.opacity = '1';
                heroTextContainer.style.transform = 'translateY(0)';

                heroImage.style.opacity = '1';
                heroImage.style.transform = 'translateX(40px) scale(1)'; // matching original translate-x-10 (40px)

            }, 700); // Wait for exit animation to finish

        }, 6000); // 6 seconds
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
});

