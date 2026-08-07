import {
    Coffee,
    Sprout,
    Fish,
    Beer,
    Soup,
    Flame,
    Sparkles,
    Home,
    Utensils,
} from "lucide-react";

interface CategoryIconProps {
    id: string;
    className?: string;
}

export default function CategoryIcon({ id, className = "w-8 h-8" }: CategoryIconProps) {
    switch (id) {
        case "mon-an-sang":
            return <Coffee className={className} />;
        case "mon-dong-que":
            return <Sprout className={className} />;
        case "mon-hai-san":
            return <Fish className={className} />;
        case "mon-nhau":
            return <Beer className={className} />;
        case "mon-com-tho":
            return <Soup className={className} />;
        case "lau-nuong":
            return <Flame className={className} />;
        case "mon-cao-cap":
            return <Sparkles className={className} />;
        case "mon-gia-dinh":
            return <Home className={className} />;
        default:
            return <Utensils className={className} />;
    }
}
