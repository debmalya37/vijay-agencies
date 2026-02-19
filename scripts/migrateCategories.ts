import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import dbConnect from "../src/lib/dbConnect";
import { Category } from "../src/models/Category";


const parentCategories = [
  "Cleaning & Hygiene",
  "Paper & Tissues",
  "Equipment & Machines",
  "Kitchen & Food Service",
  "Bathroom & Washroom",
  "Laundry & Fabric Care",
  "Fragrance & Air Care",
  "Safety & Disposables",
  "Others",
];

const hierarchyMap: Record<string, string[]> = {
  "Cleaning & Hygiene": [
    "Cleaning",
    "Sanitizer",
    "Taski Chemical",
    "Taski Crew Range",
  ],

  "Paper & Tissues": [
    "Paper Products",
    "Tissues",
    "Dispencers",
  ],

  "Kitchen & Food Service": [
    "Kitchen care",
    "Foils & Foil Containers",
    "Cling Film",
    "Plastic Containers",
  ],

  "Safety & Disposables": [
    "Disposable Items",
  ],

  "Others": [
    "Housekeeping",
    "Plastic Products",
    "Reckitt Items",
    "Health & Wellness",
  ],
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function runMigration() {
  await dbConnect();

  console.log("🔵 Creating parent categories...");

  const parentDocs: Record<string, any> = {};

  for (const parentName of parentCategories) {
    const slug = slugify(parentName);

    const parent = await Category.findOneAndUpdate(
      { name: parentName },
      {
        name: parentName,
        slug,
        parent_category: null,
        is_active: true,
      },
      { upsert: true, new: true }
    );

    parentDocs[parentName] = parent;
    console.log(`✔ Parent ready: ${parentName}`);
  }

  console.log("\n🔵 Linking children...");

  for (const parentName in hierarchyMap) {
    const parent = parentDocs[parentName];
    if (!parent) continue;

    for (const childName of hierarchyMap[parentName]) {
      const child = await Category.findOne({ name: childName });

      if (!child) {
        console.log(`⚠ Missing child category: ${childName}`);
        continue;
      }

      if (child.parent_category?.toString() === parent._id.toString()) {
        console.log(`✔ Already linked: ${childName}`);
        continue;
      }

      await Category.updateOne(
        { _id: child._id },
        { parent_category: parent._id }
      );

      console.log(`✔ Linked ${childName} → ${parentName}`);
    }
  }

  console.log("\n✅ CATEGORY MIGRATION COMPLETE");
  process.exit(0);
}

runMigration().catch(err => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
