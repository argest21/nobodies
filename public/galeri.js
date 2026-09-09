// =========================================
// NBDS-GALERİ
// Maksimum dosya boyutu: 500 MB
// =========================================

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


const MAX_FILE_SIZE =
    500 * 1024 * 1024;


if (year) {
    year.textContent =
        new Date().getFullYear();
}


// MODAL AÇ

function openModal() {

    if (!uploadModal) return;

    uploadModal.classList.add(
        "open"
    );

    uploadModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";
}


// MODAL KAPAT

function closeModal() {

    if (!uploadModal) return;

    uploadModal.classList.remove(
        "open"
    );

    uploadModal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";
}


if (uploadButton) {
    uploadButton.addEventListener(
        "click",
        openModal
    );
}


if (closeButton) {
    closeButton.addEventListener(
        "click",
        closeModal
    );
}


document.querySelectorAll(
    "[data-close-modal]"
).forEach(element => {

    element.addEventListener(
        "click",
        closeModal
    );

});


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {
            closeModal();
        }

    }
);


// DOSYA SEÇİLDİĞİNDE BİLGİ

if (fileInput) {

    fileInput.addEventListener(
        "change",
        () => {

            const file =
                fileInput.files[0];

            if (!file) {

                fileInfo.textContent =
                    "Maksimum dosya boyutu: 500 MB";

                fileInfo.style.color =
                    "#555";

                return;
            }


            const sizeMB =
                file.size /
                1024 /
                1024;


            fileInfo.textContent =
                `${file.name} • ${sizeMB.toFixed(2)} MB`;


            if (
                file.size >
                MAX_FILE_SIZE
            ) {

                fileInfo.textContent =
                    "HATA: Dosya 500 MB'dan büyük.";

                fileInfo.style.color =
                    "#f06b6b";

            } else {

                fileInfo.style.color =
                    "#777";

            }

        }
    );

}


// MESAJ

function showMessage(
    message,
    type = "normal"
) {

    if (!uploadMessage) return;

    uploadMessage.textContent =
        message;

    uploadMessage.classList.add(
        "show"
    );


    if (type === "error") {

        uploadMessage.style.color =
            "#f06b6b";

        uploadMessage.style.borderColor =
            "#793939";

    } else {

        uploadMessage.style.color =
            "#d8d8d8";

        uploadMessage.style.borderColor =
            "#555";

    }
}


// FORM GÖNDER

if (uploadForm) {

    uploadForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const file =
                fileInput.files[0];

            const isimInput =
                document.getElementById(
                    "isim"
                );

            const isim =
                isimInput
                    ? isimInput.value.trim()
                    : "";


            if (!isim) {

                showMessage(
                    "Lütfen ismini yaz.",
                    "error"
                );

                return;
            }


            if (!file) {

                showMessage(
                    "Lütfen bir fotoğraf veya video seç.",
                    "error"
                );

                return;
            }


            if (
                file.size >
                MAX_FILE_SIZE
            ) {

                showMessage(
                    "Dosya çok büyük. Maksimum 500 MB.",
                    "error"
                );

                return;
            }


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


                let result = {};

                try {
                    result =
                        await response.json();
                } catch {
                    result = {};
                }


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
                    "Maksimum dosya boyutu: 500 MB";

                fileInfo.style.color =
                    "#555";


                await loadGallery();


                setTimeout(
                    () => {
                        closeModal();

                        uploadMessage.classList.remove(
                            "show"
                        );
                    },
                    1000
                );


            } catch (error) {

                console.error(
                    "Yükleme hatası:",
                    error
                );

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
}


// GALERİYİ GETİR

async function loadGallery() {

    if (!galeriGrid) return;


    try {

        const response =
            await fetch(
                "/api/galeri",
                {
                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Galeri yüklenemedi."
            );

        }


        const items =
            await response.json();


        renderGallery(
            Array.isArray(items)
                ? items
                : []
        );


    } catch (error) {

        console.error(
            "Galeri yükleme hatası:",
            error
        );


        galeriGrid.innerHTML = `
            <div class="gallery-empty">

                <div class="gallery-empty-mark">
                    !
                </div>

                <h2>
                    GALERİ YÜKLENEMEDİ
                </h2>

                <p>
                    Sayfayı yenileyip tekrar deneyin.
                </p>

            </div>
        `;

    }

}


// GALERİYİ OLUŞTUR

function renderGallery(items) {

    galeriCount.textContent =
        `${items.length} İÇERİK`;


    if (!items.length) {

        galeriGrid.innerHTML = `
            <div class="gallery-empty">

                <div class="gallery-empty-mark">
                    NBDS
                </div>

                <h2>
                    HENÜZ İÇERİK YOK
                </h2>

                <p>
                    İlk fotoğrafı veya videoyu sen paylaş.
                </p>

            </div>
        `;

        return;
    }


    galeriGrid.innerHTML =
        items.map(item => {

            const name =
                escapeHtml(
                    item.isim ||
                    "NBDS Üyesi"
                );

            const date =
                formatDate(
                    item.tarih
                );


            if (
                item.tip === "video"
            ) {

                return `
                    <article
                        class="gallery-card"
                    >

                        <video
                            class="gallery-media"
                            src="${item.dosya}"
                            controls
                            preload="metadata"
                        ></video>

                        <div class="gallery-media-type">
                            VİDEO
                        </div>

                        <div class="gallery-card-info">

                            <div class="gallery-card-name">
                                ${name}
                            </div>

                            <div class="gallery-card-date">
                                ${date}
                            </div>

                        </div>

                    </article>
                `;

            }


            return `
                <article
                    class="gallery-card"
                >

                    <img
                        class="gallery-media"
                        src="${item.dosya}"
                        alt="${name}"
                        loading="lazy"
                    >

                    <div class="gallery-media-type">
                        FOTOĞRAF
                    </div>

                    <div class="gallery-card-info">

                        <div class="gallery-card-name">
                            ${name}
                        </div>

                        <div class="gallery-card-date">
                            ${date}
                        </div>

                    </div>

                </article>
            `;

        }).join("");
}


// GÜVENLİ METİN

function escapeHtml(text) {

    return String(text)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


// TARİH

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(dateString);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }


    return date.toLocaleDateString(
        "tr-TR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}


// BAŞLAT

loadGallery();
