var express = require('express');
var router = express.Router();


const products = {
    "digital_books": [{
            "judul": "Bawang Merah dan Bawang Putih",
            "penerbit": "Pustaka RIRI"
        },
        {
            "judul": "Kelinci dan Kura-Kura",
            "penerbit": "Pustaka RIRI"
        },
        {
            "judul": "Malin Kundang",
            "penerbit": "Pustaka RIRI"
        }
    ],
    "educational_games": [{
            "judul": "Marbel Piano",
            "tipe": "Edukasi Anak"
        },
        {
            "judul": "Marbel Teliti Mencari Perbedaan",
            "tipe": "Edukasi Anak"
        },
        {
            "judul": "Marbel Belajar Bahasa Inggris",
            "tipe": "Edukasi Anak"
        }
    ]
}

router.get('/', (req, res) => {
    res.json({
        data: products
    });
});

module.exports = router;