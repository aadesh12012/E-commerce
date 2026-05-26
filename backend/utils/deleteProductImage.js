const fs = require("fs").promises;
const path = require("path");

/**
 * Removes product image files from local storage when applicable.
 * External URLs (CDN, third-party hosts) are skipped — nothing to delete on disk.
 */
async function deleteProductImage(imageUrl) {
    if (!imageUrl || typeof imageUrl !== "string") {
        return;
    }

    const uploadsDir = path.join(__dirname, "..", "uploads");

    const tryUnlink = async (filePath) => {
        try {
            await fs.unlink(filePath);
        } catch (err) {
            // Ignore missing files; log other errors without failing the request
            if (err.code !== "ENOENT") {
                console.warn("deleteProductImage:", err.message);
            }
        }
    };

    // Relative path: /uploads/filename.jpg
    if (imageUrl.startsWith("/uploads/")) {
        const fileName = path.basename(imageUrl);
        await tryUnlink(path.join(uploadsDir, fileName));
        return;
    }

    // Absolute URL that may point to this server's uploads folder
    try {
        const parsed = new URL(imageUrl);
        if (parsed.pathname.startsWith("/uploads/")) {
            const fileName = path.basename(parsed.pathname);
            await tryUnlink(path.join(uploadsDir, fileName));
        }
    } catch {
        // Not a valid URL — treat as external reference, no file cleanup
    }
}

module.exports = { deleteProductImage };
