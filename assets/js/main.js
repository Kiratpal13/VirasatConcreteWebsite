document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MOBILE MENU ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-list a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- 2. DROPDOWN (MOBILE) ---
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle') || dropdown.querySelector('.dropbtn') || dropdown.querySelector('a');
        if (!toggle) return;
        
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) { 
                e.preventDefault(); 
                // Close other dropdowns
                dropdowns.forEach(d => { if(d !== dropdown) d.querySelector('.dropdown-content').style.display = 'none'; });
                
                // Toggle current
                const content = dropdown.querySelector('.dropdown-content');
                if(content.style.display === 'block') {
                    content.style.display = 'none';
                } else {
                    content.style.display = 'block';
                }
            }
        });
    });

    // --- 3. FAQ ACCORDION ---
    const accordions = document.querySelectorAll('.accordion-btn');
    accordions.forEach(acc => {
        acc.addEventListener('click', function() {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            const icon = this.querySelector('.icon');
            
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                this.setAttribute('aria-expanded', 'false');
                if(icon) icon.textContent = '+';
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                this.setAttribute('aria-expanded', 'true');
                if(icon) icon.textContent = '-';
            }
        });
    });

    // --- 4. SCROLL ANIMATION ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // --- 5. LIGHTBOX (GALLERY POPUP) ---
    const lightbox = document.getElementById('myLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const caption = document.getElementById('caption');
    const closeBtn = document.querySelector('.close-lightbox');
    const clickableItems = document.querySelectorAll(
        '.gallery-trigger, .gallery-grid img, .project-grid img, .gallery-item img, .project-tile img, .masonry-grid img'
    );
    const images = Array.from(clickableItems)
        .map((el) => (el.tagName === 'IMG' ? el : el.querySelector('img')))
        .filter(Boolean);
    let currentIndex = 0;

    if (lightbox && images.length > 0) {
        // Open lightbox when image is clicked
        clickableItems.forEach((el, index) => {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                const img = el.tagName === 'IMG' ? el : el.querySelector('img');
                if (!img) return;
                lightbox.classList.add('show');
                lightboxImg.src = img.src;
                if (caption) caption.innerHTML = img.alt || "Project Image";
                currentIndex = images.indexOf(img);
                document.body.style.overflow = "hidden";
            });
        });

        // Close lightbox
        const closeLightbox = () => {
            lightbox.classList.remove('show');
            document.body.style.overflow = "auto";
        };
        
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Navigate images
        const changeImage = (direction) => {
            currentIndex += direction;
            if (currentIndex >= images.length) currentIndex = 0;
            else if (currentIndex < 0) currentIndex = images.length - 1;
            
            lightboxImg.src = images[currentIndex].src;
            if (caption) caption.innerHTML = images[currentIndex].alt || "Project Image";
        };

        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        if (prevBtn) prevBtn.addEventListener('click', () => changeImage(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => changeImage(1));

        // Backwards compatibility (in case older markup still calls changeImage)
        window.changeImage = changeImage;

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('show')) {
                if (e.key === "ArrowRight") changeImage(1);
                if (e.key === "ArrowLeft") changeImage(-1);
                if (e.key === "Escape") closeLightbox();
            }
        });
    }
});