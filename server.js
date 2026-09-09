const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

const publicFolder = path.join(__dirname, "public");
const uploadFolder = path.join(publicFolder, "uploads");
const galleryFile = path.join(__dirname, "galeri.json");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicFolder));


/* ================================
   NBDS-GALERİ
================================ */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);

        const randomName =
            Date.now() +
            "-" +
            Math.random().toString(36).substring(2, 9) +
            extension;

        cb(null, randomName);
    }
});

const upload = multer({
    storage,

    limits: {
        fileSize: 500 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
            "video/mp4",
            "video/webm",
            "video/quicktime"
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(
                new Error(
                    "Sadece fotoğraf veya video yükleyebilirsin."
                )
            );
        }
    }
});


app.post(
    "/api/galeri/yukle",
    upload.single("dosya"),
    (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Lütfen bir fotoğraf veya video seç."
                });
            }

            const isim =
                (req.body.isim || "NBDS Üyesi")
                    .trim()
                    .substring(0, 40);

            const dosyaUrl =
                "/uploads/" +
                req.file.filename;

            let galeri = [];

            if (fs.existsSync(galleryFile)) {

                try {
                    galeri = JSON.parse(
                        fs.readFileSync(
                            galleryFile,
                            "utf8"
                        )
                    );
                } catch {
                    galeri = [];
                }
            }

            const yeniIcerik = {
                id: Date.now(),
                isim: isim || "NBDS Üyesi",
                dosya: dosyaUrl,
                tip: req.file.mimetype.startsWith("video/")
                    ? "video"
                    : "foto",
                tarih: new Date().toISOString()
            };

            galeri.unshift(yeniIcerik);

            fs.writeFileSync(
                galleryFile,
                JSON.stringify(
                    galeri,
                    null,
                    2
                )
            );

            res.json({
                success: true,
                message:
                    "İçerik galeriye eklendi.",
                icerik: yeniIcerik
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message:
                    "Yükleme sırasında bir hata oluştu."
            });
        }
    }
);


app.get(
    "/api/galeri",
    (req, res) => {

        if (!fs.existsSync(galleryFile)) {
            return res.json([]);
        }

        try {

            const galeri = JSON.parse(
                fs.readFileSync(
                    galleryFile,
                    "utf8"
                )
            );

            res.json(galeri);

        } catch {

            res.json([]);
        }
    }
);


/* ================================
   KICK CANLI YAYIN DURUMU
================================ */

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

let kickStatusCache = kickCreators.map(username => ({
    username,
    live: false,
    viewerCount: 0,
    title: "",
    category: "",
    checkedAt: null
}));

async function checkKickCreator(username) {

    const url =
        "https://kick.com/api/v2/channels/" +
        encodeURIComponent(username);

    try {

        const response = await fetch(
            url,
            {
                headers: {
                    "Accept": "application/json",
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
                    "Referer": "https://kick.com/"
                },
                signal: AbortSignal.timeout(8000)
            }
        );

        if (!response.ok) {
            throw new Error(
                `KICK HTTP ${response.status}`
            );
        }

        const data = await response.json();

        const stream =
            data && data.livestream
                ? data.livestream
                : null;

        const categories =
            stream &&
            Array.isArray(stream.categories)
                ? stream.categories
                : [];

        return {
            username,
            live: Boolean(stream),
            viewerCount:
                stream
                    ? Number(stream.viewer_count || 0)
                    : 0,
            title:
                stream
                    ? String(stream.session_title || "")
                    : "",
            category:
                categories.length
                    ? String(categories[0].name || "")
                    : "",
            checkedAt:
                new Date().toISOString()
        };

    } catch (error) {

        console.error(
            `KICK durum kontrolü başarısız (${username}):`,
            error.message
        );

        const previous =
            kickStatusCache.find(
                item =>
                    item.username.toLowerCase() ===
                    username.toLowerCase()
            );

        return {
            username,
            live:
                previous
                    ? previous.live
                    : false,
            viewerCount:
                previous
                    ? previous.viewerCount
                    : 0,
            title:
                previous
                    ? previous.title
                    : "",
            category:
                previous
                    ? previous.category
                    : "",
            checkedAt:
                new Date().toISOString(),
            stale: true
        };
    }
}

async function refreshKickStatus() {

    const results =
        await Promise.all(
            kickCreators.map(
                checkKickCreator
            )
        );

    kickStatusCache =
        results.sort(
            (a, b) =>
                Number(b.live) -
                Number(a.live)
        );
}

refreshKickStatus();

setInterval(
    refreshKickStatus,
    60 * 1000
);

app.get(
    "/api/kick-status",
    (req, res) => {

        res.json({
            success: true,
            liveCount:
                kickStatusCache.filter(
                    item => item.live
                ).length,
            checkedAt:
                new Date().toISOString(),
            creators:
                kickStatusCache
        });
    }
);


/* ================================
   HATALAR
================================ */

app.use(
    (error, req, res, next) => {

        if (error instanceof multer.MulterError) {

            if (
                error.code ===
                "LIMIT_FILE_SIZE"
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Dosya çok büyük. Maksimum 500 MB."
                });
            }
        }

        if (error) {

            return res.status(400).json({
                success: false,
                message:
                    error.message
            });
        }

        next();
    }
);


app.listen(PORT, () => {

    console.log(
        `NOBODIES çalışıyor - port ${PORT}`
    );

    console.log(
        "KICK canlı durum sistemi aktif."
    );
});
