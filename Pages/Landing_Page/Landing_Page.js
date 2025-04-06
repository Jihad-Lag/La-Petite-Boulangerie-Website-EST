// ---- Animation_Avis_Clients_Par_Jihad_laglil ----
document.addEventListener("DOMContentLoaded", function() {
    const container = document.querySelector('.testimonials-container');
    let isMouseOver = false;
    container.addEventListener('mouseenter', function() {
        isMouseOver = true;
        moveTestimonials();
    });

    container.addEventListener('mouseleave', function() {
        isMouseOver = false;
        resetPosition();
    });

    function moveTestimonials() {
        if (isMouseOver) {
            const totalWidth = container.scrollWidth;
            const visibleWidth = container.clientWidth;
            const scrollPosition = container.scrollLeft;
            container.scrollLeft = scrollPosition + 20;

        
            if (scrollPosition >= totalWidth - visibleWidth) {
                container.scrollLeft = 0;
            }
        }

        if (isMouseOver) {
            requestAnimationFrame(moveTestimonials);
        }
    }


    function resetPosition() {
        container.scrollLeft = 0;
    }
});


