import { createRequire } from 'module'; const require = createRequire(import.meta.url);

// server/seed.ts
import bcrypt from "bcryptjs";

// server/db.ts
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
var __dirname = path.dirname(fileURLToPath(import.meta.url));
var dbPath = path.join(__dirname, "database.sqlite");
var db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('burger', 'sandwich', 'sides', 'drinks')),
    tags TEXT DEFAULT '[]',
    popular INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
var cols = db.prepare("PRAGMA table_info(orders)").all();
if (cols.length > 0 && (!cols.some((c) => c.name === "tracking_code") || !cols.some((c) => c.name === "estimated_delivery_at"))) {
  db.exec("DROP TABLE orders");
}
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tracking_code TEXT UNIQUE NOT NULL,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    delivery_address TEXT,
    items TEXT NOT NULL,
    total INTEGER NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'preparing', 'ready', 'delivered', 'cancelled')),
    estimated_delivery_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS promotions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    discount_percent INTEGER NOT NULL CHECK(discount_percent > 0 AND discount_percent <= 100),
    applicable_category TEXT CHECK(applicable_category IN ('burger', 'sandwich', 'sides', 'drinks', 'all')),
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
var db_default = db;

// server/seed.ts
var menuItems = [
  {
    name: "Classic Smash",
    description: "Dva smash patty-ja, cheddar sir, sve\u017E paradajz, zelena salata, na\u0161 special sos",
    price: 890,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    category: "burger",
    tags: JSON.stringify(["bestseller", "beef"]),
    popular: 1
  },
  {
    name: "Cheese Lover",
    description: "Trostruki cheddar, gouda, mozzarella, karamelizovan luk, truffle mayo",
    price: 1090,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop",
    category: "burger",
    tags: JSON.stringify(["cheese", "beef"]),
    popular: 1
  },
  {
    name: "BBQ Beast",
    description: "Dupli beef patty, slanina, BBQ sos, pr\u017Eeni luk, jalape\xF1o, coleslaw",
    price: 1190,
    image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=400&fit=crop",
    category: "burger",
    tags: JSON.stringify(["spicy", "beef"]),
    popular: 1
  },
  {
    name: "Truffle Deluxe",
    description: "Wagyu beef patty, tartufi, brie sir, rukola, karamelizovan luk",
    price: 1490,
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=400&fit=crop",
    category: "burger",
    tags: JSON.stringify(["premium", "beef"]),
    popular: 0
  },
  {
    name: "Crispy Chicken",
    description: "Hrskava piletina, aioli sos, kiseli krastav\u010Di\u0107i, iceberg salata",
    price: 890,
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=400&fit=crop",
    category: "burger",
    tags: JSON.stringify(["chicken"]),
    popular: 0
  },
  {
    name: "Veggie Smash",
    description: "Doma\u0107i veggie patty, avokado, pe\u010Dena paprika, hummus, mikro zeleni\u0161",
    price: 790,
    image: "https://images.unsplash.com/photo-1520072959219-c595e6cdc529?w=600&h=400&fit=crop",
    category: "burger",
    tags: JSON.stringify(["vegetarian"]),
    popular: 0
  },
  {
    name: "Philly Cheesesteak",
    description: "Tanko se\u010Dena govedina, topljeni provolone sir, karamelizovan luk i paprika",
    price: 990,
    image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
    category: "sandwich",
    tags: JSON.stringify(["beef", "bestseller"]),
    popular: 1
  },
  {
    name: "Club Sandwich",
    description: "Piletina, slanina, jaje, paradajz, zelena salata, tostiran hleb",
    price: 790,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
    category: "sandwich",
    tags: JSON.stringify(["chicken"]),
    popular: 0
  },
  {
    name: "Pulled Pork",
    description: "12h dimljena svinjetina, coleslaw, BBQ sos, kiseli krastav\u010Di\u0107i",
    price: 1090,
    image: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=600&h=400&fit=crop",
    category: "sandwich",
    tags: JSON.stringify(["pork", "bbq"]),
    popular: 0
  },
  {
    name: "Loaded Fries",
    description: "Hrskavi pomfrit, cheddar sos, slanina, vla\u0161ac",
    price: 490,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop",
    category: "sides",
    tags: JSON.stringify(["popular"]),
    popular: 1
  },
  {
    name: "Onion Rings",
    description: "Doma\u0107i pr\u017Eeni luk u hrskavom testu, chipotle mayo",
    price: 390,
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=400&fit=crop",
    category: "sides",
    tags: JSON.stringify(["vegetarian"]),
    popular: 0
  },
  {
    name: "Coleslaw",
    description: "Sve\u017E kupus, \u0161argarepa, doma\u0107i dressing",
    price: 290,
    image: "https://images.unsplash.com/photo-1625938145744-e380515399bf?w=600&h=400&fit=crop",
    category: "sides",
    tags: JSON.stringify(["vegetarian", "fresh"]),
    popular: 0
  },
  {
    name: "Craft Lemonade",
    description: "Doma\u0107a limunada sa sve\u017Eom nanom i \u0111umbirom",
    price: 350,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&h=400&fit=crop",
    category: "drinks",
    tags: JSON.stringify(["fresh"]),
    popular: 0
  },
  {
    name: "Milkshake",
    description: "Kremasti milkshake \u2014 vanila, \u010Dokolada ili jagoda",
    price: 450,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop",
    category: "drinks",
    tags: JSON.stringify(["sweet"]),
    popular: 0
  }
];
var existingUser = db_default.prepare("SELECT id FROM users WHERE username = ?").get("admin");
if (!existingUser) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db_default.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run(
    "admin",
    hashedPassword,
    "admin"
  );
  console.log("\u2713 Admin user created (admin / admin123)");
}
var count = db_default.prepare("SELECT COUNT(*) as count FROM menu_items").get();
if (count.count === 0) {
  const insert = db_default.prepare(
    "INSERT INTO menu_items (name, description, price, image, category, tags, popular) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  const insertMany = db_default.transaction((items) => {
    for (const item of items) {
      insert.run(item.name, item.description, item.price, item.image, item.category, item.tags, item.popular);
    }
  });
  insertMany(menuItems);
  console.log(`\u2713 ${menuItems.length} menu items seeded`);
} else {
  console.log(`\u2713 ${count.count} menu items already exist`);
}
console.log("\u2713 Database seeded successfully!");
