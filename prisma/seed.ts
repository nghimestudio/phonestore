import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const phones = [
  {
    name: "iPhone 16 Pro",
    slug: "iphone-16-pro",
    brand: "Apple",
    description:
      "Titanium design, A18 Pro chip, and a powerful camera system for pro photography and video.",
    price: 1199,
    compareAtPrice: 1299,
    stock: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80",
    storageGb: 256,
    color: "Natural Titanium",
    featured: true,
    specs: {
      display: "6.3-inch Super Retina XDR",
      chip: "A18 Pro",
      camera: "48MP Fusion",
      battery: "All-day battery life",
    },
  },
  {
    name: "iPhone 16",
    slug: "iphone-16",
    brand: "Apple",
    description:
      "A18 chip, advanced dual-camera system, and Camera Control for everyday photography.",
    price: 899,
    compareAtPrice: 999,
    stock: 40,
    imageUrl:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80",
    storageGb: 128,
    color: "Ultramarine",
    featured: true,
    specs: {
      display: "6.1-inch Super Retina XDR",
      chip: "A18",
      camera: "48MP Fusion",
      battery: "Up to 22 hours video",
    },
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    slug: "samsung-galaxy-s24-ultra",
    brand: "Samsung",
    description:
      "Galaxy AI, built-in S Pen, and a 200MP camera for flagship Android performance.",
    price: 1299,
    compareAtPrice: 1399,
    stock: 18,
    imageUrl:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    storageGb: 512,
    color: "Titanium Black",
    featured: true,
    specs: {
      display: "6.8-inch Dynamic AMOLED 2X",
      chip: "Snapdragon 8 Gen 3",
      camera: "200MP wide",
      battery: "5000mAh",
    },
  },
  {
    name: "Samsung Galaxy S24",
    slug: "samsung-galaxy-s24",
    brand: "Samsung",
    description:
      "Compact flagship with Galaxy AI features and a bright Dynamic AMOLED display.",
    price: 799,
    compareAtPrice: 899,
    stock: 30,
    imageUrl:
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80",
    storageGb: 256,
    color: "Onyx Black",
    featured: false,
    specs: {
      display: "6.2-inch Dynamic AMOLED 2X",
      chip: "Exynos 2400",
      camera: "50MP wide",
      battery: "4000mAh",
    },
  },
  {
    name: "Google Pixel 9 Pro",
    slug: "google-pixel-9-pro",
    brand: "Google",
    description:
      "Best-in-class computational photography with Gemini AI built into the Pixel experience.",
    price: 999,
    compareAtPrice: 1099,
    stock: 22,
    imageUrl:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
    storageGb: 256,
    color: "Obsidian",
    featured: true,
    specs: {
      display: "6.3-inch LTPO OLED",
      chip: "Google Tensor G4",
      camera: "50MP triple camera",
      battery: "5060mAh",
    },
  },
  {
    name: "Google Pixel 9",
    slug: "google-pixel-9",
    brand: "Google",
    description:
      "Clean Android, excellent cameras, and helpful Gemini AI features at a mid-flagship price.",
    price: 699,
    compareAtPrice: 799,
    stock: 35,
    imageUrl:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
    storageGb: 128,
    color: "Porcelain",
    featured: false,
    specs: {
      display: "6.3-inch OLED",
      chip: "Google Tensor G4",
      camera: "50MP dual camera",
      battery: "4700mAh",
    },
  },
  {
    name: "Xiaomi 14 Ultra",
    slug: "xiaomi-14-ultra",
    brand: "Xiaomi",
    description:
      "Leica optics, Snapdragon performance, and a pro imaging suite for photography enthusiasts.",
    price: 1099,
    compareAtPrice: 1199,
    stock: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80",
    storageGb: 512,
    color: "Black",
    featured: true,
    specs: {
      display: "6.73-inch LTPO AMOLED",
      chip: "Snapdragon 8 Gen 3",
      camera: "50MP Leica quad",
      battery: "5300mAh",
    },
  },
  {
    name: "Xiaomi Redmi Note 13 Pro",
    slug: "xiaomi-redmi-note-13-pro",
    brand: "Xiaomi",
    description:
      "High-value midrange phone with a sharp AMOLED screen and long-lasting battery.",
    price: 329,
    compareAtPrice: 379,
    stock: 50,
    imageUrl:
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80",
    storageGb: 256,
    color: "Midnight Black",
    featured: false,
    specs: {
      display: "6.67-inch AMOLED",
      chip: "Snapdragon 7s Gen 2",
      camera: "200MP main",
      battery: "5100mAh",
    },
  },
  {
    name: "OnePlus 12",
    slug: "oneplus-12",
    brand: "OnePlus",
    description:
      "Flagship speed with a Hasselblad-tuned camera and ultra-fast charging.",
    price: 799,
    compareAtPrice: 899,
    stock: 20,
    imageUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    storageGb: 256,
    color: "Silky Black",
    featured: false,
    specs: {
      display: "6.82-inch LTPO AMOLED",
      chip: "Snapdragon 8 Gen 3",
      camera: "50MP Hasselblad",
      battery: "5400mAh",
    },
  },
  {
    name: "Nothing Phone (2a)",
    slug: "nothing-phone-2a",
    brand: "Nothing",
    description:
      "Distinctive Glyph interface, clean software, and strong midrange value.",
    price: 349,
    compareAtPrice: 399,
    stock: 28,
    imageUrl:
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80",
    storageGb: 128,
    color: "Milk",
    featured: false,
    specs: {
      display: "6.7-inch AMOLED",
      chip: "Dimensity 7200 Pro",
      camera: "50MP dual",
      battery: "5000mAh",
    },
  },
  {
    name: "Sony Xperia 1 VI",
    slug: "sony-xperia-1-vi",
    brand: "Sony",
    description:
      "Creator-focused phone with pro video tools and a cinema-inspired display.",
    price: 1399,
    compareAtPrice: 1499,
    stock: 8,
    imageUrl:
      "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=800&q=80",
    storageGb: 256,
    color: "Black",
    featured: false,
    specs: {
      display: "6.5-inch OLED 21:9",
      chip: "Snapdragon 8 Gen 3",
      camera: "48MP triple ZEISS",
      battery: "5000mAh",
    },
  },
  {
    name: "ASUS ROG Phone 8",
    slug: "asus-rog-phone-8",
    brand: "ASUS",
    description:
      "Gaming powerhouse with advanced cooling, high refresh rate, and side triggers.",
    price: 999,
    compareAtPrice: 1099,
    stock: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80",
    storageGb: 256,
    color: "Phantom Black",
    featured: true,
    specs: {
      display: "6.78-inch AMOLED 165Hz",
      chip: "Snapdragon 8 Gen 3",
      camera: "50MP triple",
      battery: "5500mAh",
    },
  },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const customerPassword = await bcrypt.hash("customer123", 10);

  await prisma.user.create({
    data: {
      name: "Store Admin",
      email: "admin@phonestore.com",
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      name: "Demo Customer",
      email: "customer@phonestore.com",
      passwordHash: customerPassword,
      role: Role.USER,
    },
  });

  for (const phone of phones) {
    await prisma.product.create({
      data: {
        ...phone,
        specs: JSON.stringify(phone.specs),
      },
    });
  }

  console.log(`Seeded ${phones.length} phones and 2 users.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
