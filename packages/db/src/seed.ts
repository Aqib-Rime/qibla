import { config } from "dotenv";
import { db } from "./index.ts";
import { event, imam, mosque } from "./schema/mosque.ts";

config({ path: ["../../.env.local", "../../.env", ".env.local", ".env"] });

type Fixture = {
  id: string;
  name: string;
  subtitle?: string;
  about?: string;
  address?: string;
  street?: string;
  area?: string;
  lat: number;
  lng: number;
  rating: number;
  reviewsCount: number;
  open: boolean;
  tags: string[];
  facilities: string[];
  imam?: { name: string; role: string; since: number };
  events?: { title: string; when: string; by?: string }[];
};

// Placeholder gallery via picsum.photos — deterministic seeds keep a mosque's
// images consistent across seed runs. Swap for curated Wikimedia/R2 URLs
// before launch.
function placeholderPhotos(id: string, count = 3): string[] {
  return Array.from(
    { length: count },
    (_, i) => `https://picsum.photos/seed/${id}-${i + 1}/1200/800`,
  );
}

const DHAKA_FIXTURES: Fixture[] = [
  {
    id: "m1",
    name: "Baitul Mukarram",
    subtitle: "National Mosque",
    about:
      "Bangladesh's national mosque, built in 1960. Holds up to 40,000 worshippers across 8 floors. Known for its cubic design inspired by the Kaaba and its central role in Eid prayers.",
    address: "Paltan, Dhaka 1000",
    street: "Bir Uttam Mir Shawkat Sarak",
    area: "Paltan",
    lat: 23.7306,
    lng: 90.4125,
    rating: 4.7,
    reviewsCount: 320,
    open: true,
    tags: ["Jummah", "Women", "Parking", "Open"],
    facilities: ["wudu", "women", "parking", "ac", "book", "elevator"],
    imam: { name: "Sheikh Abdul Kalam", role: "Imam & Khatib", since: 2018 },
    events: [
      {
        title: "Friday Khutbah",
        when: "Fri · 12:45 pm",
        by: "Sheikh A. Kalam",
      },
      { title: "Tafseer Circle", when: "Wed · 8:30 pm", by: "Mufti Rahman" },
    ],
  },
  {
    id: "m2",
    name: "Dhanmondi Jame",
    subtitle: "Masjid",
    about:
      "A community mosque serving Dhanmondi residents with daily prayers, madrasa classes, and weekly tafseer.",
    address: "Dhanmondi 27, Dhaka",
    street: "Satmasjid Road",
    area: "Dhanmondi 27",
    lat: 23.7461,
    lng: 90.3742,
    rating: 4.5,
    reviewsCount: 182,
    open: true,
    tags: ["Jummah", "Women", "Parking", "Open"],
    facilities: ["wudu", "women", "parking", "ac"],
    imam: { name: "Maulana Siddique", role: "Imam", since: 2015 },
    events: [
      { title: "Friday Khutbah", when: "Fri · 12:50 pm", by: "Imam Siddique" },
    ],
  },
  {
    id: "m3",
    name: "Gulshan Central",
    subtitle: "Masjid",
    about:
      "Large mosque in Gulshan serving the diplomatic zone, with multi-language Khutbahs.",
    address: "Gulshan 2, Dhaka",
    street: "Gulshan Avenue",
    area: "Gulshan 2",
    lat: 23.7925,
    lng: 90.4078,
    rating: 4.8,
    reviewsCount: 245,
    open: true,
    tags: ["Jummah", "Women", "Parking", "Open", "24/7"],
    facilities: ["wudu", "women", "parking", "ac", "elevator"],
    imam: { name: "Dr. Kamal Hossain", role: "Imam", since: 2020 },
  },
  {
    id: "m4",
    name: "Uttara Model",
    subtitle: "Jame Masjid",
    about: "Community mosque in Uttara with active madrasa and youth program.",
    address: "Sector 7, Uttara",
    street: "Jashimuddin Road",
    area: "Sector 7",
    lat: 23.8759,
    lng: 90.3795,
    rating: 4.4,
    reviewsCount: 98,
    open: true,
    tags: ["Jummah", "Parking", "Open"],
    facilities: ["wudu", "parking", "book"],
    imam: { name: "Mufti Ahmed", role: "Imam", since: 2019 },
  },
  {
    id: "m5",
    name: "Banani DOHS",
    subtitle: "Masjid",
    about: "Quiet mosque in Banani DOHS, walkable from most of the area.",
    address: "Banani DOHS",
    street: "Road 11",
    area: "Banani",
    lat: 23.7946,
    lng: 90.4044,
    rating: 4.6,
    reviewsCount: 134,
    open: true,
    tags: ["Jummah", "Women", "Open"],
    facilities: ["wudu", "women", "ac"],
    imam: { name: "Hafiz Jalil", role: "Imam", since: 2017 },
  },
  {
    id: "m6",
    name: "Mohammadpur Central",
    subtitle: "Central Masjid",
    about: "Neighborhood mosque with Quran classes for children every evening.",
    address: "Mohammadpur, Dhaka",
    street: "Iqbal Road",
    area: "Mohammadpur",
    lat: 23.7655,
    lng: 90.3588,
    rating: 4.3,
    reviewsCount: 76,
    open: false,
    tags: ["Jummah", "Parking", "Madrasa"],
    facilities: ["wudu", "parking", "book"],
    imam: { name: "Qari Shahidul", role: "Imam", since: 2016 },
  },
  {
    id: "m7",
    name: "Lalbagh Shahi",
    subtitle: "Masjid",
    about:
      "Historic Mughal-era mosque inside Lalbagh Fort complex. A protected heritage site.",
    address: "Lalbagh Fort, Dhaka",
    street: "Lalbagh Road",
    area: "Lalbagh",
    lat: 23.7186,
    lng: 90.388,
    rating: 4.9,
    reviewsCount: 412,
    open: true,
    tags: ["Jummah", "Open", "Historic"],
    facilities: ["wudu", "parking"],
    imam: { name: "Maulana Habib", role: "Imam & Guide", since: 2010 },
  },
  {
    id: "m8",
    name: "Tara Masjid",
    subtitle: "Star Mosque",
    about: "Famous 18th-century mosque decorated with Chinese porcelain stars.",
    address: "Armanitola, Old Dhaka",
    street: "Armanitola Road",
    area: "Armanitola",
    lat: 23.715,
    lng: 90.4064,
    rating: 4.8,
    reviewsCount: 267,
    open: true,
    tags: ["Jummah", "Historic"],
    facilities: ["wudu"],
    imam: { name: "Hafiz Noman", role: "Imam", since: 2014 },
  },
];

async function main() {
  console.log(`Seeding ${DHAKA_FIXTURES.length} mosques...`);

  for (const fx of DHAKA_FIXTURES) {
    await db
      .insert(mosque)
      .values({
        id: fx.id,
        name: fx.name,
        subtitle: fx.subtitle,
        about: fx.about,
        address: fx.address,
        street: fx.street,
        area: fx.area,
        city: "Dhaka",
        lat: fx.lat,
        lng: fx.lng,
        rating: fx.rating,
        reviewsCount: fx.reviewsCount,
        open: fx.open,
        tags: fx.tags,
        facilities: fx.facilities,
        photos: placeholderPhotos(fx.id),
        status: "approved",
      })
      .onConflictDoNothing();

    if (fx.imam) {
      await db
        .insert(imam)
        .values({
          id: `${fx.id}-imam`,
          mosqueId: fx.id,
          name: fx.imam.name,
          role: fx.imam.role,
          since: fx.imam.since,
        })
        .onConflictDoNothing();
    }

    if (fx.events?.length) {
      for (let i = 0; i < fx.events.length; i++) {
        const ev = fx.events[i]!;
        await db
          .insert(event)
          .values({
            id: `${fx.id}-event-${i}`,
            mosqueId: fx.id,
            title: ev.title,
            when: ev.when,
            by: ev.by,
          })
          .onConflictDoNothing();
      }
    }
  }

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
