// =========================================
// NOBODIES - GENEL JAVASCRIPT
// =========================================


// YÜKLEME EKRANI

window.addEventListener("load", () => {

    const loader =
        document.getElementById("loader");

    if (!loader) return;

    setTimeout(() => {

        loader.style.opacity = "0";
        loader.style.transition =
            "opacity .5s ease";

        setTimeout(() => {

            loader.style.display =
                "none";

        }, 500);

    }, 900);

});


// YUMUŞAK KAYDIRMA

document.querySelectorAll(
    'a[href^="#"]'
).forEach(link => {

    link.addEventListener(
        "click",
        event => {

            const target =
                document.querySelector(
                    link.getAttribute("href")
                );

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

});


// İSTATİSTİK SAYACI

const counters =
    document.querySelectorAll(
        ".stat strong"
    );

if (counters.length) {

    const counterObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;

                    const element =
                        entry.target;

                    const target =
                        Number(
                            element.dataset.target
                        );

                    const start =
                        performance.now();

                    const duration =
                        1200;


                    function update(time) {

                        const progress =
                            Math.min(
                                (time - start) /
                                duration,
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


                    requestAnimationFrame(
                        update
                    );

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

}


// HERO PARALLAX

const hero =
    document.querySelector(
        ".hero-content"
    );


window.addEventListener(
    "mousemove",
    event => {

        if (!hero) return;

        const x =
            (
                event.clientX /
                window.innerWidth -
                0.5
            ) * 6;


        const y =
            (
                event.clientY /
                window.innerHeight -
                0.5
            ) * 4;


        hero.style.transform =
            `translate(${x}px, ${y}px)`;

    }
);


// OTOMATİK YIL

const year =
    document.getElementById("year");


if (year) {

    year.textContent =
        new Date().getFullYear();

}


// SCROLL ANİMASYONLARI

const revealElements =
    document.querySelectorAll(
        ".member-card, .stream-card, .gallery-item, .stat"
    );


if (revealElements.length) {

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

}


// =========================================
// KICK YAYINCILARI
// =========================================

const kickCreators = [
    "Minik",
    "NoyrGod",
    "glentiss",
    "Cengizhan",
    "yyido",
    "vactrass",
    "aleyra",
    "sercantall",
    "dantefps",
    "verdaxo",
    "mezofps",
    "why_not3",
    "ssxrb",
    "atapela",
    "vidarinyo",
    "lynn0133",
    "qqhako",
    "diona123",
    "runzeus",
    "tunw12",
    "phonyag"
];


const kickGrid =
    document.getElementById(
        "kickStreamGrid"
    );

const kickModal =
    document.getElementById(
        "kickModal"
    );

const kickPlayer =
    document.getElementById(
        "kickPlayer"
    );

const kickTitle =
    document.getElementById(
        "kickModalTitle"
    );

const kickClose =
    document.getElementById(
        "kickModalClose"
    );


// KARTLARI OLUŞTUR

function createKickCards() {

    if (!kickGrid) return;


    kickGrid.innerHTML =
        kickCreators
            .map((username, index) => {

                return `

                    <article
                        class="kick-stream-card"
                    >

                        <div
                            class="kick-card-number"
                        >
                            ${String(
                                index + 1
                            ).padStart(2, "0")}
                        </div>


                        <div
                            class="kick-card-badge"
                        >
                            KICK
                        </div>


                        <div
                            class="kick-card-body"
                        >

                            <div
                                class="kick-symbol"
                            >
                                N
                            </div>


                            <div
                                class="kick-name"
                            >
                                ${escapeHtml(
                                    username
                                )}
                            </div>


                            <div
                                class="kick-platform"
                            >
                                KICK / FIVEM YAYINCISI
                            </div>


                            <button
                                type="button"
                                class="kick-watch"
                                data-kick-user="${escapeHtml(
                                    username
                                )}"
                            >
                                YAYINI AÇ ↗
                            </button>

                        </div>

                    </article>

                `;

            })
            .join("");


    kickGrid
        .querySelectorAll(
            ".kick-watch"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openKickPlayer(
                        button.dataset.kickUser
                    );

                }
            );

        });

}


// KICK PLAYER AÇ

function openKickPlayer(username) {

    if (
        !kickModal ||
        !kickPlayer ||
        !kickTitle
    ) {
        return;
    }


    kickTitle.textContent =
        username;


    kickPlayer.src =
        `https://player.kick.com/${encodeURIComponent(
            username
        )}`;


    kickModal.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";

}


// KICK PLAYER KAPAT

function closeKickPlayer() {

    if (
        !kickModal ||
        !kickPlayer
    ) {
        return;
    }


    kickModal.classList.remove(
        "open"
    );


    kickPlayer.src = "";


    document.body.style.overflow =
        "";

}


if (kickClose) {

    kickClose.addEventListener(
        "click",
        closeKickPlayer
    );

}


if (kickModal) {

    kickModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                kickModal
            ) {

                closeKickPlayer();

            }

        }
    );

}


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeKickPlayer();

        }

    }
);


// HTML GÜVENLİĞİ

function escapeHtml(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// KICK KARTLARINI BAŞLAT

createKickCards();
