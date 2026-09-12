/* =========================================================================
   ANIMATIONS
   -------------------------------------------------------------------------
   Two libraries, two clear jobs:
   - GSAP + ScrollTrigger  -> choreographed entrance & scroll-reveal timelines
   - Motion (motion.dev)   -> pointer-driven micro-interactions (spring physics)

   Accessibility: everything below is skipped (and content shown instantly)
   when the user has "prefers-reduced-motion: reduce" enabled.
   ========================================================================= */
(function () {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    /* =====================================================================
       GSAP — entrance timeline + scroll reveals
       ===================================================================== */
    if (window.gsap) {
        const gsap = window.gsap;

        if (prefersReducedMotion) {
            // Make sure nothing is left invisible if motion is disabled.
            gsap.set('.hero-badge, .hero-content h1, .hero-content > p, .hero-cta .btn, .hero-visual-inner, .hero-availability, .navbar', { clearProps: 'all' });
        } else {
            gsap.registerPlugin(ScrollTrigger);
            gsap.defaults({ ease: 'power3.out' });

            /* ---- Navbar drop-in ---- */
            gsap.from('.navbar', {
                y: -60,
                opacity: 0,
                duration: 0.7,
                ease: 'power2.out'
            });

            /* ---- Hero entrance timeline ---- */
            gsap.timeline({ defaults: { ease: 'power3.out' } })
                .from('.hero-badge', { opacity: 0, y: 16, duration: 0.6 }, 0.15)
                .from('.hero-content h1', { opacity: 0, y: 28, duration: 0.85 }, 0.28)
                .from('.hero-content > p', { opacity: 0, y: 20, duration: 0.75 }, 0.44)
                .from('.hero-cta .btn', { opacity: 0, y: 14, duration: 0.55, stagger: 0.1 }, 0.58)
                .from('.hero-visual-inner', { opacity: 0, scale: 0.94, duration: 1 }, 0.22)
                .from('.hero-availability', { opacity: 0, y: 10, duration: 0.5 }, 0.95);

            /* ---- Section headers: fade + rise as they enter the viewport ---- */
            document.querySelectorAll('.section-header').forEach((header) => {
                gsap.from(header.children, {
                    opacity: 0,
                    y: 22,
                    duration: 0.7,
                    stagger: 0.08,
                    scrollTrigger: { trigger: header, start: 'top 85%' }
                });
            });

            /* ---- About paragraphs ---- */
            const aboutContent = document.querySelector('.about-content');
            if (aboutContent) {
                gsap.from(aboutContent.children, {
                    opacity: 0,
                    y: 18,
                    duration: 0.6,
                    stagger: 0.08,
                    scrollTrigger: { trigger: aboutContent, start: 'top 82%' }
                });
            }

            /* ---- Skill category cards + their list items ---- */
            gsap.utils.toArray('.skill-category').forEach((card) => {
                gsap.from(card, {
                    opacity: 0,
                    y: 28,
                    duration: 0.65,
                    scrollTrigger: { trigger: card, start: 'top 88%' }
                });
                gsap.from(card.querySelectorAll('.skill-list li'), {
                    opacity: 0,
                    x: -12,
                    duration: 0.5,
                    stagger: 0.05,
                    scrollTrigger: { trigger: card, start: 'top 85%' }
                });
            });

            /* ---- Methodology pills ---- */
            const methodologies = document.querySelector('.methodologies-grid');
            if (methodologies) {
                gsap.from(methodologies.children, {
                    opacity: 0,
                    y: 18,
                    scale: 0.94,
                    duration: 0.55,
                    stagger: 0.06,
                    scrollTrigger: { trigger: methodologies, start: 'top 88%' }
                });
            }

            /* ---- Experience cards ---- */
            gsap.utils.toArray('.experience-card').forEach((card) => {
                gsap.from(card, {
                    opacity: 0,
                    y: 44,
                    duration: 0.8,
                    scrollTrigger: { trigger: card, start: 'top 85%' }
                });
                const badge = card.querySelector('.step-badge');
                if (badge) {
                    gsap.from(badge, {
                        opacity: 0,
                        scale: 0.5,
                        duration: 0.6,
                        ease: 'back.out(2)',
                        scrollTrigger: { trigger: card, start: 'top 85%' }
                    });
                }
            });

            /* ---- Project cards: rise in + image zoom-settle + tag stagger ---- */
            gsap.utils.toArray('.project-card').forEach((card) => {
                gsap.from(card, {
                    opacity: 0,
                    y: 46,
                    duration: 0.75,
                    scrollTrigger: { trigger: card, start: 'top 88%' }
                });

                const img = card.querySelector('.project-header img');
                if (img) {
                    gsap.from(img, {
                        scale: 1.15,
                        duration: 1.2,
                        ease: 'power2.out',
                        scrollTrigger: { trigger: card, start: 'top 88%' }
                    });
                }

                const tags = card.querySelectorAll('.tech-tag');
                if (tags.length) {
                    gsap.from(tags, {
                        opacity: 0,
                        y: 8,
                        duration: 0.4,
                        stagger: 0.04,
                        scrollTrigger: { trigger: card, start: 'top 80%' }
                    });
                }
            });

            /* ---- Contact banner ---- */
            const contactLeft = document.querySelector('.contact-banner-left');
            const contactInfoItems = document.querySelectorAll('.contact-info-item');
            if (contactLeft) {
                gsap.from(contactLeft.children, {
                    opacity: 0,
                    y: 22,
                    duration: 0.65,
                    stagger: 0.1,
                    scrollTrigger: { trigger: '.contact-banner', start: 'top 85%' }
                });
            }
            if (contactInfoItems.length) {
                gsap.from(contactInfoItems, {
                    opacity: 0,
                    x: 18,
                    duration: 0.55,
                    stagger: 0.08,
                    scrollTrigger: { trigger: '.contact-banner', start: 'top 85%' }
                });
            }

            /* ---- Footer ---- */
            const footerContent = document.querySelector('.footer-content');
            if (footerContent) {
                gsap.from(footerContent.children, {
                    opacity: 0,
                    y: 14,
                    duration: 0.55,
                    stagger: 0.1,
                    scrollTrigger: { trigger: '.footer', start: 'top 94%' }
                });
            }
        }
    }

    /* =====================================================================
       Motion (motion.dev) — pointer-driven micro-interactions
       ===================================================================== */
    if (window.Motion && !prefersReducedMotion) {
        const { animate, hover, press } = window.Motion;
        const softSpring = { type: 'spring', stiffness: 320, damping: 22, mass: 0.6 };

        /* ---- Buttons: gentle lift on hover, tactile press feedback ---- */
        document.querySelectorAll('.btn').forEach((btn) => {
            hover(btn, () => {
                animate(btn, { scale: 1.035 }, softSpring);
                return () => animate(btn, { scale: 1 }, softSpring);
            });
            press(btn, () => {
                animate(btn, { scale: 0.96 }, { duration: 0.12 });
                return () => animate(btn, { scale: 1 }, softSpring);
            });
        });

        /* ---- Tech tags: playful pop on hover ---- */
        document.querySelectorAll('.tech-tag').forEach((tag) => {
            hover(tag, () => {
                animate(tag, { scale: 1.08, y: -2 }, softSpring);
                return () => animate(tag, { scale: 1, y: 0 }, softSpring);
            });
        });

        /* ---- Social / contact icons: spring rotate + lift ---- */
        document.querySelectorAll('.footer-social a, .contact-info-item svg').forEach((el) => {
            hover(el, () => {
                animate(el, { scale: 1.15, rotate: -8 }, softSpring);
                return () => animate(el, { scale: 1, rotate: 0 }, softSpring);
            });
        });

        /* ---- Logo: subtle wink on hover ---- */
        const logo = document.querySelector('.logo');
        if (logo) {
            hover(logo, () => {
                animate(logo, { scale: 1.06 }, softSpring);
                return () => animate(logo, { scale: 1 }, softSpring);
            });
        }

        /* ---- Hero portrait: soft parallax tilt following the cursor ---- */
        const heroVisual = document.querySelector('.hero-visual-inner');
        if (heroVisual && !isCoarsePointer) {
            const strength = 10; // max px / deg of travel — kept subtle on purpose
            let frame = null;

            heroVisual.addEventListener('mousemove', (e) => {
                const rect = heroVisual.getBoundingClientRect();
                const px = (e.clientX - rect.left) / rect.width - 0.5;
                const py = (e.clientY - rect.top) / rect.height - 0.5;

                if (frame) cancelAnimationFrame(frame);
                frame = requestAnimationFrame(() => {
                    animate(heroVisual, {
                        transform: [
                            `perspective(900px) rotateX(${(-py * strength * 0.6).toFixed(2)}deg) rotateY(${(px * strength * 0.6).toFixed(2)}deg) translate3d(${(px * strength * 0.4).toFixed(2)}px, ${(py * strength * 0.4).toFixed(2)}px, 0)`
                        ]
                    }, softSpring);
                });
            });

            heroVisual.addEventListener('mouseleave', () => {
                animate(heroVisual, { transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) translate3d(0px, 0px, 0)' }, softSpring);
            });
        }
    }
})();
