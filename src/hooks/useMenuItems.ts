import { useState, useEffect } from "react";
import { menuApi, type MenuItemAPI } from "../services/api";
import { menuItems as staticItems, type MenuItem } from "../data/menu";

export function useMenuItems() {
    const [items, setItems] = useState<MenuItem[]>(staticItems);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        menuApi
            .getAll()
            .then((data: MenuItemAPI[]) => {
                setItems(
                    data.map((d) => ({
                        id: d.id,
                        name: d.name,
                        description: d.description,
                        price: d.price,
                        image: d.image,
                        category: d.category,
                        tags: d.tags,
                        popular: d.popular,
                    }))
                );
            })
            .catch(() => {
                // fallback to static data if API not available
                setItems(staticItems);
            })
            .finally(() => setLoading(false));
    }, []);

    return { items, loading };
}
