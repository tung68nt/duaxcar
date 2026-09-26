export interface ScheduleItem {
    id: string;
    courseSlug: string;
    startDate: string;
    endDate: string;
    time: string;
    location: string;
    spotsLeft: number;
    totalSpots: number;
    status: "opening" | "almost-full" | "full" | "closed";
    priceOverride?: number;
    note?: string;
    visible: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const defaultSchedules: ScheduleItem[] = [
    {
        id: "sch-1",
        courseSlug: "pho-bo-truyen-thong",
        startDate: "2026-10-15",
        endDate: "2026-10-16",
        time: "08:00 - 17:00",
        location: "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
        spotsLeft: 3,
        totalSpots: 8,
        status: "opening",
        note: "Tặng cẩm nang kỹ thuật hầm nước dùng độc quyền",
        visible: true,
    },
    {
        id: "sch-2",
        courseSlug: "bun-bo-hue",
        startDate: "2026-10-22",
        endDate: "2026-10-23",
        time: "08:00 - 17:00",
        location: "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
        spotsLeft: 4,
        totalSpots: 8,
        status: "opening",
        note: "Thực hành nấu mắm ruốc chuẩn cố đô",
        visible: true,
    },
    {
        id: "sch-3",
        courseSlug: "lau-nuong-tron-goi",
        startDate: "2026-11-02",
        endDate: "2026-11-03",
        time: "08:00 - 17:00",
        location: "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
        spotsLeft: 7,
        totalSpots: 10,
        status: "opening",
        note: "Chia sẻ danh bạ nhà cung cấp thịt sỉ toàn quốc",
        visible: true,
    },
    {
        id: "sch-4",
        courseSlug: "mon-dong-que-thuc-chien",
        startDate: "2026-11-10",
        endDate: "2026-11-11",
        time: "08:00 - 16:00",
        location: "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
        spotsLeft: 5,
        totalSpots: 8,
        status: "opening",
        note: "Bí quyết chế biến ếch, lươn, ốc không bị tanh",
        visible: true,
    },
    {
        id: "sch-5",
        courseSlug: "hai-san-nha-hang",
        startDate: "2026-11-18",
        endDate: "2026-11-19",
        time: "08:00 - 17:00",
        location: "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
        spotsLeft: 3,
        totalSpots: 8,
        status: "opening",
        note: "Công thức các loại sốt hải sản siêu cuốn",
        visible: true,
    },
    {
        id: "sch-6",
        courseSlug: "mon-cao-cap-fine-dining",
        startDate: "2026-11-25",
        endDate: "2026-11-27",
        time: "09:00 - 18:00",
        location: "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
        spotsLeft: 2,
        totalSpots: 6,
        status: "almost-full",
        note: "Trải nghiệm bếp Âu - Á chuẩn nhà hàng 5 sao",
        visible: true,
    },
];
