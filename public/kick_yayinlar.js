// =========================================
// NOBODIES - KICK YAYINCILAR
// KICK'in resmi embed adresi:
// https://player.kick.com/KULLANICI_ADI
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

const kickGrid = document.getElementById("kickStreamGrid");
const kickModal = document.getElementById("kickModal");
const kickPlayer = document.getElementById("kickPlayer");
const kickTitle = document.getElementById("kickModalTitle");
const kickClose = document.getElementById("kickModalClose");

function createKickCards() {
    if (!kickGrid) return;

    kickGrid.innerHTML = kickCreators.map((username, index) => `
        <article class="kick-stream-card">
            <div class="kick-card-number">${String(index + 1).padStart(2, "0")}</div>
            <div class="kick-card-badge">KICK</div>

            <div class="kick-card-body">
                <div class="kick-symbol">N</div>

                <div class="kick-name">
                    ${escapeKickHtml(username)}
                </div>

                <div class="kick-platform">
                    KICK / FIVEМ CREATOR
                </div>

                <button
                    class="kick-watch"
                    type="button"
                    data-kick-user="${escapeKickHtml(username)}"
                >
                    YAYINI AÇ ↗
                </button>
            </div>
        </article>
    `).join("");

    kickGrid.querySelectorAll(".kick-watch").forEach(button => {
        button.addEventListener("click", () => {
            openKickPlayer(button.dataset.kickUser);
        });
    });
}

function openKickPlayer(username) {
    if (!kickModal || !kickPlayer || !kickTitle) return;

    kickTitle.textContent = username;

    const encodedUsername = encodeURIComponent(username);

    kickPlayer.src =
        `https://player.kick.com/${encodedUsername}?autoplay=false&muted=false`;

    kickModal.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeKickPlayer() {
    if (!kickModal || !kickPlayer) return;

    kickModal.classList.remove("open");

    kickPlayer.src = "";

    document.body.style.overflow = "";
}

function escapeKickHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

if (kickClose) {
    kickClose.addEventListener(
        "click",
        closeKickPlayer
    );
}

if (kickModal) {
    kickModal.addEventListener("click", event => {
        if (event.target === kickModal) {
            closeKickPlayer();
        }
    });
}

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeKickPlayer();
    }
});

createKickCards();
