export interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: "burger" | "sandwich" | "sides" | "drinks";
    tags: string[];
    popular?: boolean;
}

export const menuItems: MenuItem[] = [
    // Burgers
    {
        id: 1,
        name: "Classic Smash",
        description:
            "Dva smash patty-ja, cheddar sir, svež paradajz, zelena salata, naš special sos",
        price: 890,
        image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
        category: "burger",
        tags: ["bestseller", "beef"],
        popular: true,
    },
    {
        id: 2,
        name: "Cheese Lover",
        description:
            "Trostruki cheddar, gouda, mozzarella, karamelizovan luk, truffle mayo",
        price: 1090,
        image:
            "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop",
        category: "burger",
        tags: ["cheese", "beef"],
        popular: true,
    },
    {
        id: 3,
        name: "BBQ Beast",
        description:
            "Dupli beef patty, slanina, BBQ sos, prženi luk, jalapeño, coleslaw",
        price: 1190,
        image:
            "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600&h=400&fit=crop",
        category: "burger",
        tags: ["spicy", "beef"],
        popular: true,
    },
    {
        id: 4,
        name: "Truffle Deluxe",
        description:
            "Wagyu beef patty, tartufi, brie sir, rukola, karamelizovan luk",
        price: 1490,
        image:
            "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=400&fit=crop",
        category: "burger",
        tags: ["premium", "beef"],
    },
    {
        id: 5,
        name: "Crispy Chicken",
        description:
            "Hrskava piletina, aioli sos, kiseli krastavčići, iceberg salata",
        price: 890,
        image:
            "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&h=400&fit=crop",
        category: "burger",
        tags: ["chicken"],
    },
    {
        id: 6,
        name: "Veggie Smash",
        description:
            "Domaći veggie patty, avokado, pečena paprika, hummus, mikro zeleniš",
        price: 790,
        image:
            "https://images.unsplash.com/photo-1520072959219-c595e6cdc529?w=600&h=400&fit=crop",
        category: "burger",
        tags: ["vegetarian"],
    },

    // Sandwiches
    {
        id: 7,
        name: "Philly Cheesesteak",
        description:
            "Tanko sečena govedina, topljeni provolone sir, karamelizovan luk i paprika",
        price: 990,
        image:
            "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
        category: "sandwich",
        tags: ["beef", "bestseller"],
        popular: true,
    },
    {
        id: 8,
        name: "Club Sandwich",
        description:
            "Piletina, slanina, jaje, paradajz, zelena salata, tostiran hleb",
        price: 790,
        image:
            "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=400&fit=crop",
        category: "sandwich",
        tags: ["chicken"],
    },
    {
        id: 9,
        name: "Pulled Pork",
        description:
            "12h dimljena svinjetina, coleslaw, BBQ sos, kiseli krastavčići",
        price: 1090,
        image:
            "https://images.unsplash.com/photo-1550507992-eb63ffee0847?w=600&h=400&fit=crop",
        category: "sandwich",
        tags: ["pork", "bbq"],
    },

    // Sides
    {
        id: 10,
        name: "Loaded Fries",
        description: "Hrskavi pomfrit, cheddar sos, slanina, vlašac",
        price: 490,
        image:
            "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop",
        category: "sides",
        tags: ["popular"],
        popular: true,
    },
    {
        id: 11,
        name: "Onion Rings",
        description: "Domaći prženi luk u hrskavom testu, chipotle mayo",
        price: 390,
        image:
            "https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=400&fit=crop",
        category: "sides",
        tags: ["vegetarian"],
    },
    {
        id: 12,
        name: "Coleslaw",
        description: "Svež kupus, šargarepa, domaći dressing",
        price: 290,
        image:
            "https://images.unsplash.com/photo-1625938145744-e380515399bf?w=600&h=400&fit=crop",
        category: "sides",
        tags: ["vegetarian", "fresh"],
    },

    // Drinks
    {
        id: 13,
        name: "Craft Lemonade",
        description: "Domaća limunada sa svežom nanom i đumbirom",
        price: 350,
        image:
            "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&h=400&fit=crop",
        category: "drinks",
        tags: ["fresh"],
    },
    {
        id: 14,
        name: "Milkshake",
        description: "Kremasti milkshake — vanila, čokolada ili jagoda",
        price: 450,
        image:
            "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop",
        category: "drinks",
        tags: ["sweet"],
    },
];
