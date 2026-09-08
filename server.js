const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

const publicFolder = path.join(__dirname, "public");
const uploadFolder = path.join(publicFolder, "uploads");

if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(publicFolder));

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
        fileSize: 100 * 1024 * 1024
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
            cb(new Error("Sadece fotoğraf veya video yükleyebilirsin."));
        }
    }
});


/*
    NBDS-GALERİ
    Fotoğraf / video yükleme
*/

app.post(
    "/api/galeri/yukle",
    upload.single("dosya"),
    (req, res) => {

        try {

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Lütfen bir fotoğraf veya video seç."
                });
            }

            const isim =
                (req.body.isim || "NBDS Üyesi")
                .trim()
                .substring(0, 40);

            const dosyaUrl =
                "/uploads/" +
                req.file.filename;

            const galeriDosyasi =
                path.join(
                    __dirname,
                    "galeri.json"
                );

            let galeri = [];

            if (fs.existsSync(galeriDosyasi)) {

                try {

                    galeri =
                        JSON.parse(
                            fs.readFileSync(
                                galeriDosyasi,
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
                galeriDosyasi,
                JSON.stringify(
                    galeri,
                    null,
                    2
                )
            );

            res.json({
                success: true,
                message: "İçerik galeriye eklendi.",
                icerik: yeniIcerik
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                success: false,
                message: "Yükleme sırasında bir hata oluştu."
            });
        }
    }
);


/*
    Galeri içeriklerini getir
*/

app.get(
    "/api/galeri",
    (req, res) => {

        const galeriDosyasi =
            path.join(
                __dirname,
                "galeri.json"
            );

        if (!fs.existsSync(galeriDosyasi)) {

            return res.json([]);
        }

        try {

            const galeri =
                JSON.parse(
                    fs.readFileSync(
                        galeriDosyasi,
                        "utf8"
                    )
                );

            res.json(galeri);

        } catch {

            res.json([]);
        }
    }
);


/*
    Multer hataları
*/

app.use((error, req, res, next) => {

    if (error instanceof multer.MulterError) {

        if (error.code === "LIMIT_FILE_SIZE") {

            return res.status(400).json({
                success: false,
                message:
                    "Dosya çok büyük. Maksimum 100 MB."
            });
        }
    }

    if (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    next();
});


app.listen(PORT, () => {

    console.log(
        `NOBODIES çalışıyor - port ${PORT}`
    );

});
