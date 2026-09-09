// =========================================
// NOBODIES - GENEL JAVASCRIPT
// =========================================

window.addEventListener("load", () => {

    const loader =
        document.getElementById("loader");

    if (!loader) return;

    setTimeout(() => {

        loader.style.opacity = "0";
        loader.style.transition =
            "opacity .5s ease";

        setTimeout(() => {
            loader.style.display = "none";
        }, 500);

    }, 900);
});


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
            ) * 5;

        const y =
            (
                event.clientY /
                window.innerHeight -
                0.5
            ) * 3;

        hero.style.transform =
            `translate(${x}px, ${y}px)`;
    }
);


const year =
    document.getElementById("year");

if (year) {
    year.textContent =
        new Date().getFullYear();
}


/* =========================================
   KICK CANLI YAYINLAR
========================================= */

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

const kickDirectLink =
    document.getElementById(
        "kickDirectLink"
    );


let kickCreators = [];


function escapeHtml(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function createKickCards(creators) {

    if (!kickGrid) return;

    const sorted =
        [...creators].sort(
            (a, b) =>
                Number(b.live) -
                Number(a.live)
        );


    if (!sorted.length) {

        kickGrid.innerHTML = `
            <div class="kick-empty">
                YAYINCILAR YÜKLENİYOR...
            </div>
        `;

        return;
    }


    kickGrid.innerHTML =
        sorted.map(
            (creator, index) => {

                const safeName =
                    escapeHtml(
                        creator.username
                    );

                const isLive =
                    Boolean(
                        creator.live
                    );

                const viewers =
                    Number(
                        creator.viewerCount || 0
                    ).toLocaleString(
                        "tr-TR"
                    );

                const cardClass =
                    isLive
                        ? "kick-stream-card is-live"
                        : "kick-stream-card";

                const badge =
                    isLive
                        ? `
                            <div class="kick-live-badge">
                                ● CANLI
                            </div>
                          `
                        : `
                            <div class="kick-card-badge">
                                KICK
                            </div>
                          `;

                const streamTitle =
                    creator.title
                        ? `
                            <div class="kick-stream-title">
                                ${escapeHtml(
                                    creator.title
                                )}
                            </div>
                          `
                        : "";

                const platform =
                    creator.category
                        ? escapeHtml(
                            creator.category
                        )
                        : "FIVEM";


                return `
                    <article
                        class="${cardClass}"
                    >

                        <div class="kick-card-number">
                            ${String(
                                index + 1
                            ).padStart(2, "0")}
                        </div>

                        ${badge}

                        <div class="kick-card-body">

                            <div class="kick-symbol">
                                N
                            </div>

                            <div class="kick-name">
                                ${safeName}
                            </div>

                            <div class="kick-platform">
                                KICK / ${platform}
                            </div>

                            ${streamTitle}

                            <div class="kick-status-row">

                                ${
                                    isLive
                                        ? `
                                            <span class="kick-viewers">
                                                ● ${viewers} İZLEYİCİ
                                            </span>
                                          `
                                        : `
                                            <span class="kick-viewers offline">
                                                ÇEVRİMDIŞI
                                            </span>
                                          `
                                }

                                <div class="kick-actions">

                                    <button
                                        type="button"
                                        class="kick-watch"
                                        data-kick-user="${safeName}"
                                    >
                                        YAYINI AÇ ↗
                                    </button>

                                    <a
                                        class="kick-go"
                                        href="https://kick.com/${encodeURIComponent(creator.username)}"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        KICK'E GİT ↗
                                    </a>

                                </div>

                            </div>

                        </div>

                    </article>
                `;
            }
        ).join("");


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


async function loadKickStatus() {

    if (!kickGrid) return;

    try {

        const response =
            await fetch(
                "/api/kick-status",
                {
                    cache: "no-store"
                }
            );

        if (!response.ok) {

            throw new Error(
                "KICK durumu alınamadı."
            );
        }


        const data =
            await response.json();


        kickCreators =
            Array.isArray(
                data.creators
            )
                ? data.creators
                : [];


        createKickCards(
            kickCreators
        );


        const liveStatus =
            document.querySelector(
                ".streams .live-status"
            );


        if (
            liveStatus &&
            typeof data.liveCount === "number"
        ) {

            if (data.liveCount > 0) {

                liveStatus.innerHTML =
                    `<span></span>
                     ${data.liveCount}
                     YAYINCI CANLI`;

            } else {

                liveStatus.innerHTML =
                    `<span></span>
                     ŞU AN CANLI YAYIN YOK`;

            }
        }


    } catch (error) {

        console.error(
            "KICK durum hatası:",
            error
        );

        kickGrid.innerHTML = `
            <div class="kick-empty">
                CANLI DURUMU ALINAMADI.
                <br>
                BİRKAÇ SANİYE SONRA TEKRAR DENE.
            </div>
        `;
    }
}


function openKickPlayer(
    username
) {

    if (
        !kickModal ||
        !kickPlayer ||
        !kickTitle
    ) {
        return;
    }

    kickTitle.textContent =
        username;

    const kickUrl =
        `https://kick.com/${encodeURIComponent(
            username
        )}`;

    if (kickDirectLink) {
        kickDirectLink.href = kickUrl;
    }

    kickPlayer.src =
        `https://player.kick.com/${encodeURIComponent(
            username
        )}?autoplay=false&muted=false`;

    kickModal.classList.add(
        "open"
    );

    document.body.style.overflow =
        "hidden";
}


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

        if (event.key === "Escape") {
            closeKickPlayer();
        }
    }
);


// İLK YÜKLEME
loadKickStatus();

// SAYFA AÇIK KALIRSA 60 SANİYEDE BİR YENİLE
setInterval(
    loadKickStatus,
    60 * 1000
);
