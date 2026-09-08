// ==========================================
// NOBODIES WEBSITE
// ==========================================


// LOADER

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    setTimeout(() => {
        loader.classList.add("hidden");
    }, 900);

});


// ==========================================
// SMOOTH NAVIGATION
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const target = document.querySelector(
            link.getAttribute("href")
        );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth"
        });

    });

});


// ==========================================
// COUNTERS
// ==========================================

const counters = document.querySelectorAll("[data-count]");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const element = entry.target;
        const target = Number(element.dataset.count);

        let current = 0;

        const duration = 1300;
        const start = performance.now();

        function animate(time) {

            const progress = Math.min(
                (time - start) / duration,
                1
            );

            current = Math.floor(
                progress * target
            );

            element.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }

        }

        requestAnimationFrame(animate);

        observer.unobserve(element);

    });

}, {
    threshold: 0.5
});

counters.forEach(counter => {
    observer.observe(counter);
});


// ==========================================
// MOUSE PARALLAX
// ==========================================

const hero = document.querySelector(".hero");
const heroContent = document.querySelector(".hero-content");

if (hero && heroContent) {

    hero.addEventListener("mousemove", event => {

        const x =
            (event.clientX / window.innerWidth - 0.5) * 2;

        const y =
            (event.clientY / window.innerHeight - 0.5) * 2;

        heroContent.style.transform =
            `translate(${x * 8}px, ${y * 8}px)`;

    });

    hero.addEventListener("mouseleave", () => {

        heroContent.style.transform =
            "translate(0,0)";

    });

}


// ==========================================
// STREAM PLAY BUTTON
// ==========================================

document.querySelectorAll(".play-button").forEach(button => {

    button.addEventListener("click", () => {

        alert(
            "Yayın sistemi bir sonraki aşamada Twitch/Kick/YouTube API ile bağlanacak."
        );

    });

});


// ==========================================
// CURRENT YEAR
// ==========================================

const copyright =
    document.querySelector(".copyright");

if (copyright) {

    copyright.textContent =
        `© ${new Date().getFullYear()} NOBODIES`;

}


// ==========================================
// SCROLL REVEAL
// ==========================================

const revealElements = document.querySelectorAll(
    ".section-heading, .member-card, .stream-card, .gallery-item, .stat"
);

revealElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition =
        "opacity .8s ease, transform .8s ease";

});


const revealObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) return;

            entry.target.style.opacity = "1";
            entry.target.style.transform =
                "translateY(0)";

            revealObserver.unobserve(entry.target);

        });

    },
    {
        threshold: 0.15
    }
);


revealElements.forEach(element => {
    revealObserver.observe(element);
});
