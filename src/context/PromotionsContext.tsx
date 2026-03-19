import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { promotionsApi, type PromotionAPI } from "../services/api";

interface PromotionsContextType {
    promotions: PromotionAPI[];
    getDiscount: (category: string) => number;
    getPromoForCategory: (category: string) => PromotionAPI | undefined;
}

const PromotionsContext = createContext<PromotionsContextType>({
    promotions: [],
    getDiscount: () => 0,
    getPromoForCategory: () => undefined,
});

export function PromotionsProvider({ children }: { children: ReactNode }) {
    const [promotions, setPromotions] = useState<PromotionAPI[]>([]);

    useEffect(() => {
        promotionsApi.getActive().then(setPromotions).catch(() => { });
    }, []);

    const getPromoForCategory = (category: string) => {
        // Specific category promo takes priority over "all"
        return (
            promotions.find((p) => p.applicable_category === category) ||
            promotions.find((p) => p.applicable_category === "all")
        );
    };

    const getDiscount = (category: string) => {
        const promo = getPromoForCategory(category);
        return promo ? promo.discount_percent : 0;
    };

    return (
        <PromotionsContext.Provider value={{ promotions, getDiscount, getPromoForCategory }}>
            {children}
        </PromotionsContext.Provider>
    );
}

export function usePromotions() {
    return useContext(PromotionsContext);
}
