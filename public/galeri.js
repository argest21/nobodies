// =========================================
// NBDS-GALERİ JAVASCRIPT
// =========================================


// ELEMENTLER

const uploadButton =
    document.getElementById("uploadButton");

const uploadModal =
    document.getElementById("uploadModal");

const closeButton =
    document.getElementById("closeButton");

const uploadForm =
    document.getElementById("uploadForm");

const submitButton =
    document.getElementById("submitButton");

const uploadMessage =
    document.getElementById("uploadMessage");

const fileInput =
    document.getElementById("dosya");

const fileInfo =
    document.getElementById("fileInfo");

const galeriGrid =
    document.getElementById("galeriGrid");

const galeriCount =
    document.getElementById("galeriCount");

const year =
    document.getElementById("year");


// =========================================
// YIL
// =========================================

if (year) {
    year.textContent =
        new Date().getFullYear();
}


// =========================================
// YÜKLEME PENCERESİNİ AÇ
// =========================================

uploadButton.addEventListener(
    "click",
    () => {

        uploadModal.classList.add("open");

        document.body.style.overflow =
            "hidden";

    }
);


// =========================================
// YÜKLEME PENCERESİNİ KAPAT
// =========================================

function closeModal() {

    uploadModal.classList.remove("open");

    document.body.style.overflow =
        "";

}


closeButton.addEventListener(
    "click",
    closeModal
);


// Pencerenin dışına tıklayınca kapat

uploadModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            uploadModal
        ) {

            closeModal();

        }

    }
);


// ESC TUŞU

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeModal();

        }

    }
);


// =========================================
// DOSYA SEÇİLİNCE BOYUTU GÖSTER
// =========================================

fileInput.addEventListener(
    "change",
    () => {

        const file =
            fileInput.files[0];

        if (!file) {

            fileInfo.textContent =
                "Maksimum dosya boyutu: 100 MB";

            return;

        }


        const sizeMB =
            file.size /
            1024 /
            1024;


        fileInfo.textContent =
            `${file.name} • ${sizeMB.toFixed(2)} MB`;


        if (sizeMB > 100) {

            fileInfo.textContent =
                "HATA: Dosya 100 MB'dan büyük.";

            fileInfo.style.color =
                "#ff4444";

        } else {

            fileInfo.style.color =
                "#858585";

        }

    }
);


// =========================================
// MESAJ GÖSTER
// =========================================

function showMessage(
    message,
    type = "normal"
) {

    uploadMessage.textContent =
        message;

    uploadMessage.classList.add(
        "show"
    );


    if (type === "error") {

        uploadMessage.style.color =
            "#ff5555";

        uploadMessage.style.borderColor =
            "#ff5555";

    } else {

        uploadMessage.style.color =
            "#d8ff00";

        uploadMessage.style.borderColor =
            "#d8ff00";

    }

}


// =========================================
// FORM GÖNDER
// =========================================

uploadForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const file =
            fileInput.files[0];

        const isim =
            document.getElementById(
                "isim"
            ).value.trim();


        // İSİM KONTROL

        if (!isim) {

            showMessage(
                "Lütfen ismini yaz.",
                "error"
            );

            return;

        }


        // DOSYA KONTROL

        if (!file) {

            showMessage(
                "Lütfen fotoğraf veya video seç.",
                "error"
            );

            return;

        }


        // BOYUT KONTROL

        if (
            file.size >
            100 * 1024 * 1024
        ) {

            showMessage(
                "Dosya çok büyük. Maksimum 100 MB.",
                "error"
            );

            return;

        }


        // TİP KONTROL

        const allowedTypes = [

            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",

            "video/mp4",
            "video/webm",
            "video/quicktime"

        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            showMessage(
                "Sadece fotoğraf veya video yükleyebilirsin.",
                "error"
            );

            return;

        }


        // FORM VERİSİ

        const formData =
            new FormData();

        formData.append(
            "isim",
            isim
        );

        formData.append(
            "dosya",
            file
        );


        // BUTONU KİLİTLE

        submitButton.disabled =
            true;

        submitButton.textContent =
            "YÜKLENİYOR...";


        showMessage(
            "İçeriğin yükleniyor..."
        );


        try {

            const response =
                await fetch(
                    "/api/galeri/yukle",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Yükleme başarısız."
                );

            }


            showMessage(
                "✓ İçeriğin NBDS-GALERİ'ye eklendi."
            );


            uploadForm.reset();


            fileInfo.textContent =
                "Maksimum dosya boyutu: 100 MB";


            // GALERİYİ YENİLE

            await loadGallery();


            // KISA BEKLE

            setTimeout(() => {

                closeModal();

                uploadMessage.classList.remove(
                    "show"
                );

            }, 1200);


        } catch (error) {

            console.error(error);

            showMessage(
                error.message ||
                "Yükleme sırasında hata oluştu.",
                "error"
            );

        } finally {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "GALERİYE YÜKLE ↗";

        }

    }
);


// =========================================
// GALERİYİ YÜKLE
// =========================================

async function loadGallery() {

    try {

        const response =
            await fetch(
                "/api/galeri"
            );


        if (!response.ok) {

            throw new Error(
                "Galeri alınamadı."
            );

        }


        const items =
            await response.json();


        renderGallery(items);


    } catch (error) {

        console.error(
            "Galeri hatası:",
            error
        );


        galeriGrid.innerHTML = `

            <div class="empty-gallery">

                <div class="empty-icon">
                    !
                </div>

                <h3>
                    GALERİ YÜKLENEMEDİ
                </h3>

                <p>
                    Sayfayı yenileyip tekrar deneyin.
                </p>

            </div>

        `;

    }

}


// =========================================
// GALERİYİ EKRANA BAS
// =========================================

function renderGallery(items) {

    galeriCount.textContent =
        `${items.length} İÇERİK`;


    if (!items.length) {

        galeriGrid.innerHTML = `

            <div class="empty-gallery">

                <div class="empty-icon">
                    +
                </div>

                <h3>
                    HENÜZ İÇERİK YOK
                </h3>

                <p>
                    İlk fotoğraf veya videoyu sen paylaş.
                </p>

            </div>

        `;

        return;

    }


    galeriGrid.innerHTML =
        items.map(item => {

            const safeName =
                escapeHtml(
                    item.isim
                );


            const tarih =
                formatDate(
                    item.tarih
                );


            if (
                item.tip === "video"
            ) {

                return `

                    <article class="galeri-card">

                        <video
                            class="galeri-media"
                            src="${item.dosya}"
                            controls
                            preload="metadata"
                        ></video>

                        <div class="media-type">
                            VİDEO
                        </div>

                        <div class="galeri-info">

                            <strong>
                                ${safeName}
                            </strong>

                            <span>
                                ${tarih}
                            </span>

                        </div>

                    </article>

                `;

            }


            return `

                <article class="galeri-card">

                    <img
                        class="galeri-media"
                        src="${item.dosya}"
                        alt="${safeName}"
                        loading="lazy"
                    >

                    <div class="media-type">
                        FOTOĞRAF
                    </div>

                    <div class="galeri-info">

                        <strong>
                            ${safeName}
                        </strong>

                        <span>
                            ${tarih}
                        </span>

                    </div>

                </article>

            `;

        }).join("");

}


// =========================================
// HTML GÜVENLİĞİ
// =========================================

function escapeHtml(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


// =========================================
// TARİH
// =========================================

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "tr-TR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


// =========================================
// SAYFA AÇILINCA GALERİYİ GETİR
// =========================================

loadGallery();
