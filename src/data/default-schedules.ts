export interface ScheduleItem {
    id: string;
    courseSlug: string;
    courseName?: string;
    courseUrl?: string;
    courseImage?: string;
    instructorName?: string;
    price?: number;
    priceOverride?: number;
    startDate: string;
    endDate: string;
    time: string;
    location: string;
    spotsLeft: number;
    totalSpots: number;
    status: "opening" | "almost-full" | "full" | "closed";
    note?: string;
    visible: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const defaultSchedules: ScheduleItem[] = [
    {
        id: "sch-1",
        courseSlug: "pho-bo-ha-noi",
        courseName: "Phở Bò Hà Nội",
        courseUrl: "/khoa-hoc/pho-bo-ha-noi",
        courseImage: "/images/courses/pho-bo.jpg",
        instructorName: "Nghệ nhân Nguyễn Hữu Thọ",
        price: 15500000,
        priceOverride: 12500000,
        startDate: "2026-10-15",
        endDate: "2026-10-16",
        time: "08:00 - 17:00",
        location: "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
        spotsLeft: 3,
        totalSpots: 8,
        status: "opening",
        note: "Tặng cẩm nang kỹ thuật hầm nước dùng độc quyền & công thức cost nguyên liệu",
        visible: true,
    },
    {
        id: "sch-2",
        courseSlug: "bun-bo-hue",
        courseName: "Bún Bò Huế",
        courseUrl: "/khoa-hoc/bun-bo-hue",
        courseImage: "/images/courses/bun-bo-hue.jpg",
        instructorName: "Nghệ nhân Nguyễn Hữu Thọ",
        price: 15500000,
        priceOverride: 13000000,
        startDate: "2026-10-22",
        endDate: "2026-10-23",
        time: "08:00 - 17:00",
        location: "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
        spotsLeft: 4,
        totalSpots: 8,
        status: "opening",
        note: "Thực hành nấu mắm ruốc chuẩn cố đô, chả cua giòn ngọt",
        visible: true,
    },
    {
        id: "sch-3",
        courseSlug: "lau-nuong",
        courseName: "Lẩu Nướng Trọn Gói",
        courseUrl: "/khoa-hoc/lau-nuong",
        courseImage: "/images/courses/lau-nuong.jpg",
        instructorName: "Master Chef Christine Hà",
        price: 5500000,
        startDate: "2026-11-02",
        endDate: "2026-11-03",
        time: "08:00 - 17:00",
        location: "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
        spotsLeft: 7,
        totalSpots: 10,
        status: "opening",
        note: "Chia sẻ danh bạ nhà cung cấp thịt sỉ toàn quốc & công thức 8 loại sốt ướp nướng",
        visible: true,
    },
    {
        id: "sch-4",
        courseSlug: "pho-ga-ha-noi",
        courseName: "Phở Gà Hà Nội",
        courseUrl: "/khoa-hoc/pho-ga-ha-noi",
        courseImage: "/images/courses/pho-ga.png",
        instructorName: "Master Chef Phạm Tuấn Hải",
        price: 15500000,
        priceOverride: 12900000,
        startDate: "2026-11-10",
        endDate: "2026-11-11",
        time: "08:00 - 16:00",
        location: "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
        spotsLeft: 5,
        totalSpots: 8,
        status: "opening",
        note: "Bí quyết luộc gà da vàng giòn óng ả, lọc thịt thẩm mỹ và ninh nước dùng thanh trong",
        visible: true,
    },
    {
        id: "sch-5",
        courseSlug: "pho-ga-tron",
        courseName: "Phở gà trộn",
        courseUrl: "/khoa-hoc/pho-ga-tron",
        courseImage: "/uploads/pho-ga-tron.webp",
        instructorName: "Nghệ nhân Nguyễn Hữu Thọ",
        price: 800000,
        startDate: "2026-11-18",
        endDate: "2026-11-19",
        time: "08:00 - 17:00",
        location: "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
        spotsLeft: 3,
        totalSpots: 8,
        status: "opening",
        note: "Công thức sốt trộn chua ngọt đậm đà, món ăn best-seller thêm vào menu",
        visible: true,
    },
    {
        id: "sch-6",
        courseSlug: "pho-xao",
        courseName: "Phở xào chuẩn vị kinh doanh",
        courseUrl: "/khoa-hoc/pho-xao",
        courseImage: "/uploads/test-logo-upload-1787974793202.png",
        instructorName: "Nghệ nhân Nguyễn Hữu Thọ",
        price: 850000,
        startDate: "2026-11-25",
        endDate: "2026-11-26",
        time: "09:00 - 18:00",
        location: "Cơ sở Cầu Giấy (12 Lê Văn Lương, Hà Nội)",
        spotsLeft: 2,
        totalSpots: 6,
        status: "almost-full",
        note: "Kỹ thuật xóc chảo lửa lớn chuẩn hương khói nhà hàng, sợi phở dai không nát",
        visible: true,
    },
];
