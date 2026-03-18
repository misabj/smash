import bcrypt from "bcryptjs";
import db from "./db.js";

const menuItems = [
    {
        name: "Classic Smash",
        description: "Dva smash patty-ja, cheddar sir, svež paradajz, zelena salata, naš special sos",
        price: 890,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
        category: "burger",
        tags: JSON.stringify(["bestseller", "beef"]),
        popular: 1,
    },
    {
        name: "Cheese Lover",
        description: "Trostruki cheddar, gouda, mozzarella, karamelizovan luk, truffle mayo",
        price: 1090,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop",
        category: "burger",
        tags: JSON.stringify(["cheese", "beef"]),
        popular: 1,
    },
    {
        name: "BBQ Beast",
        description: "Dupli beef patty, slanina, BBQ sos, prženi luk, jalapeño, coleslaw",
        price: 1190,
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=400&fit=crop",
        category: "burger",
        tags: JSON.stringify(["spicy", "beef"]),
        popular: 1,
    },
    {
        name: "Truffle Deluxe",
        description: "Wagyu beef patty, tartufi, brie sir, rukola, karamelizovan luk",
        price: 1490,
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=400&fit=crop",
        category: "burger",
        tags: JSON.stringify(["premium", "beef"]),
        popular: 0,
    },
    {
        name: "Crispy Chicken",
        description: "Hrskava piletina, aioli sos, kiseli krastavčići, iceberg salata",
        price: 890,
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=400&fit=crop",
        category: "burger",
        tags: JSON.stringify(["chicken"]),
        popular: 0,
    },
    {
        name: "Veggie Smash",
        description: "Domaći veggie patty, avokado, pečena paprika, hummus, mikro zeleniš",
        price: 790,
        image: "https://images.unsplash.com/photo-1520072959219-c595e6cdc529?w=600&h=400&fit=crop",
        category: "burger",
        tags: JSON.stringify(["vegetarian"]),
        popular: 0,
    },
    {
        name: "Philly Cheesesteak",
        description: "Tanko sečena govedina, topljeni provolone sir, karamelizovan luk i paprika",
        price: 990,
        image: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
        category: "sandwich",
        tags: JSON.stringify(["beef", "bestseller"]),
        popular: 1,
    },
    {
        name: "Club Sandwich",
        description: "Piletina, slanina, jaje, paradajz, zelena salata, tostiran hleb",
        price: 790,
        image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
        category: "sandwich",
        tags: JSON.stringify(["chicken"]),
        popular: 0,
    },
    {
        name: "Pulled Pork",
        description: "12h dimljena svinjetina, coleslaw, BBQ sos, kiseli krastavčići",
        price: 1090,
        image: "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=600&h=400&fit=crop",
        category: "sandwich",
        tags: JSON.stringify(["pork", "bbq"]),
        popular: 0,
    },
    {
        name: "Loaded Fries",
        description: "Hrskavi pomfrit, cheddar sos, slanina, vlašac",
        price: 490,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop",
        category: "sides",
        tags: JSON.stringify(["popular"]),
        popular: 1,
    },
    {
        name: "Onion Rings",
        description: "Domaći prženi luk u hrskavom testu, chipotle mayo",
        price: 390,
        image: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=400&fit=crop",
        category: "sides",
        tags: JSON.stringify(["vegetarian"]),
        popular: 0,
    },
    {
        name: "Coleslaw",
        description: "Svež kupus, šargarepa, domaći dressing",
        price: 290,
        image: "https://images.unsplash.com/photo-1625938145744-e380515399bf?w=600&h=400&fit=crop",
        category: "sides",
        tags: JSON.stringify(["vegetarian", "fresh"]),
        popular: 0,
    },
    {
        name: "Craft Lemonade",
        description: "Domaća limunada sa svežom nanom i đumbirom",
        price: 350,
        image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&h=400&fit=crop",
        category: "drinks",
        tags: JSON.stringify(["fresh"]),
        popular: 0,
    },
    {
        name: "Milkshake",
        description: "Kremasti milkshake — vanila, čokolada ili jagoda",
        price: 450,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop",
        category: "drinks",
        tags: JSON.stringify(["sweet"]),
        popular: 0,
    },
];

// Seed admin user
const existingUser = db.prepare("SELECT id FROM users WHERE username = ?").get("admin");
if (!existingUser) {
    const hashedPassword = bcrypt.hashSync("admin123", 10);
    db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)").run(
        "admin",
        hashedPassword,
        "admin"
    );
    console.log("✓ Admin user created (admin / admin123)");
}

// Seed menu items
const count = db.prepare("SELECT COUNT(*) as count FROM menu_items").get() as { count: number };
if (count.count === 0) {
    const insert = db.prepare(
        "INSERT INTO menu_items (name, description, price, image, category, tags, popular) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    const insertMany = db.transaction((items: typeof menuItems) => {
        for (const item of items) {
            insert.run(item.name, item.description, item.price, item.image, item.category, item.tags, item.popular);
        }
    });

    insertMany(menuItems);
    console.log(`✓ ${menuItems.length} menu items seeded`);
} else {
    console.log(`✓ ${count.count} menu items already exist`);
}

console.log("✓ Database seeded successfully!");
