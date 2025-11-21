document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted', {
            name: form.name.value,
            email: form.email.value,
            message: form.message.value
        });
        alert('Message logged to console. Connect your backend later!');
        form.reset();
    });

    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.animate-slide-left, .animate-slide-right, .animate-slide-up, .animate-fade-zoom').forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
