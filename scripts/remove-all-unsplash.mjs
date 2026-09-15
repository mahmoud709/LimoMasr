import { promises as fs } from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "b2tqubbe",
  api_key: "842369475353943",
  api_secret: "jcT8jqJL41r_jQHqop-B2NfkhEk",
  secure: true,
});

const dataDir = path.join(process.cwd(), "data");

async function main() {
  // Fetch Cloudinary images
  const cRes = await cloudinary.api.resources({ type: "upload", max_results: 500 });
  const resources = cRes.resources || [];
  const cUrls = resources.map(r => r.secure_url);

  console.log(`Found ${cUrls.length} Cloudinary images.`);
  if (cUrls.length === 0) {
    console.error("No Cloudinary images found!");
    return;
  }

  const jsonFiles = ["hotels.json", "hotel-apartments.json", "flights.json", "fast-track.json", "articles.json", "cars.json"];

  let imgIndex = 0;

  for (const fileName of jsonFiles) {
    const filePath = path.join(dataDir, fileName);
    try {
      const content = await fs.readFile(filePath, "utf8");
      if (!content || !content.trim()) continue;

      let json = JSON.parse(content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content);

      let modified = false;

      const processItem = (item) => {
        if (typeof item !== "object" || item === null) return;
        for (const key of Object.keys(item)) {
          if (typeof item[key] === "string" && item[key].includes("unsplash.com")) {
            item[key] = cUrls[imgIndex % cUrls.length];
            imgIndex++;
            modified = true;
          } else if (Array.isArray(item[key])) {
            item[key] = item[key].map(val => {
              if (typeof val === "string" && val.includes("unsplash.com")) {
                const replacement = cUrls[imgIndex % cUrls.length];
                imgIndex++;
                modified = true;
                return replacement;
              }
              return val;
            });
          } else if (typeof item[key] === "object") {
            processItem(item[key]);
          }
        }
      };

      if (Array.isArray(json)) {
        json.forEach(processItem);
      } else {
        processItem(json);
      }

      if (modified) {
        await fs.writeFile(filePath, JSON.stringify(json, null, 2), "utf8");
        console.log(`Updated ${fileName} with Cloudinary URLs.`);
      }
    } catch (err) {
      console.error(`Error processing ${fileName}:`, err.message);
    }
  }
}

main();
