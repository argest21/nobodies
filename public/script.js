// ================================
// NOBODIES - JAVASCRIPT
// ================================


// SAYFA YÜKLENİNCE LOADER'I KAPAT
window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    setTimeout(() => {

        loader.style.opacity = "0";
        loader.style.transition = "opacity .5s ease";

        setTimeout(() => {
            loader.style.display = "none";
        }, 500);

    }, 900);

});


// MENÜ LİNKLERİ - YUMUŞAK KAYDIRMA
document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

        const target = document.querySelector(
            link.getAttribute("href")
        );

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

});


// ================================
// İSTATİSTİK SAYACI
// ================================

const counters = document.querySelectorAll(
    ".stat strong"
);

const counterObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const element = entry.target;

                const target =
                    Number(element.dataset.target);

                const start =
                    performance.now();

                const duration = 1200;


                function update(time) {

                    const progress =
                        Math.min(
                            (time - start) / duration,
                            1
                        );

                    const eased =
                        1 -
                        Math.pow(
                            1 - progress,
                            3
                        );


                    element.textContent =
                        Math.floor(
                            target * eased
                        );


                    if (progress < 1) {

                        requestAnimationFrame(
                            update
                        );

                    }

                }


                requestAnimationFrame(update);

                counterObserver.unobserve(
                    element
                );

            });

        },
        {
            threshold: 0.5
        }
    );


counters.forEach(counter => {

    counterObserver.observe(counter);

});


// ================================
// HERO MOUSE PARALLAX
// ================================

const hero =
    document.querySelector(".hero-content");


window.addEventListener(
    "mousemove",
    event => {

        if (!hero) return;


        const x =
            (
                event.clientX /
                window.innerWidth -
                0.5
            ) * 8;


        const y =
            (
                event.clientY /
                window.innerHeight -
                0.5
            ) * 5;


        hero.style.transform =
            `translate(${x}px, ${y}px)`;

    }
);


// ================================
// YAYIN BUTONLARI
// ================================

document.querySelectorAll(
    ".play"
).forEach(button => {

    button.addEventListener(
        "click",
        () => {

            alert(
                "Yayın bağlantısı yakında eklenecek."
            );

        }
    );

});


// ================================
// OTOMATİK YIL
// ================================

const year =
    document.getElementById("year");


if (year) {

    year.textContent =
        new Date().getFullYear();

}


// ================================
// SCROLL ANİMASYONLARI
// ================================

const revealElements =
    document.querySelectorAll(
        ".member-card, .stream-card, .gallery-item, .stat"
    );


revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(25px)";

    element.style.transition =
        "opacity .7s ease, transform .7s ease";

});


const revealObserver =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting)
                    return;


                entry.target.style.opacity =
                    "1";


                entry.target.style.transform =
                    "translateY(0)";


                revealObserver.unobserve(
                    entry.target
                );

            });

        },
        {
            threshold: 0.12
        }
    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});
