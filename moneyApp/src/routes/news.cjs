const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await fetch(
            `https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_API_KEY}`
        );
        const data = await response.json();
        res.json(data.slice(0, 8));
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching news");
    }
});

module.exports = router;