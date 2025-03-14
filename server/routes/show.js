const router = require("express").Router();
const File = require("../models/file");

// Show page
router.get("/:uuid", async (req, res) => {
    try {
        // Get the file from the database
        const file = await File.findOne({ uuid: req.params.uuid });

        // If file not found
        if (!file) {
            return res.render("download", { error: "Link has been expired." });
        }

        return res.render("download", {
            uuid: file.uuid,
            fileName: file.filename,
            fileSize: file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}` // ✅ Fixed string interpolation
        });

    } catch (err) {
        return res.render("download", { error: "Something went wrong." });
    }
});

module.exports = router;
// Compare this snippet from server/routes/download.js: