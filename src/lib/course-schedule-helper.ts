import { ScheduleItem } from "@/data/default-schedules";
import { Course } from "@/lib/types";

// Known course mappings to prevent any slug vs name confusion
export const SLUG_TO_INFO: Record<
    string,
    { name: string; slug: string; image: string; instructor: string; price: number; url: string }
> = {
    "pho-bo-ha-noi": {
        name: "Phở Bò Hà Nội",
        slug: "pho-bo-ha-noi",
        image: "/images/courses/pho-bo.jpg",
        instructor: "Nghệ nhân Nguyễn Hữu Thọ",
        price: 15500000,
        url: "/khoa-hoc/pho-bo-ha-noi",
    },
    "pho-bo-truyen-thong": {
        name: "Phở Bò Hà Nội",
        slug: "pho-bo-ha-noi",
        image: "/images/courses/pho-bo.jpg",
        instructor: "Nghệ nhân Nguyễn Hữu Thọ",
        price: 15500000,
        url: "/khoa-hoc/pho-bo-ha-noi",
    },
    "bun-bo-hue": {
        name: "Bún Bò Huế",
        slug: "bun-bo-hue",
        image: "/images/courses/bun-bo-hue.jpg",
        instructor: "Nghệ nhân Nguyễn Hữu Thọ",
        price: 15500000,
        url: "/khoa-hoc/bun-bo-hue",
    },
    "lau-nuong": {
        name: "Lẩu Nướng Trọn Gói",
        slug: "lau-nuong",
        image: "/images/courses/lau-nuong.jpg",
        instructor: "Master Chef Christine Hà",
        price: 5500000,
        url: "/khoa-hoc/lau-nuong",
    },
    "lau-nuong-tron-goi": {
        name: "Lẩu Nướng Trọn Gói",
        slug: "lau-nuong",
        image: "/images/courses/lau-nuong.jpg",
        instructor: "Master Chef Christine Hà",
        price: 5500000,
        url: "/khoa-hoc/lau-nuong",
    },
    "pho-ga-ha-noi": {
        name: "Phở Gà Hà Nội",
        slug: "pho-ga-ha-noi",
        image: "/images/courses/pho-ga.png",
        instructor: "Master Chef Phạm Tuấn Hải",
        price: 15500000,
        url: "/khoa-hoc/pho-ga-ha-noi",
    },
    "pho-ga": {
        name: "Phở Gà Hà Nội",
        slug: "pho-ga-ha-noi",
        image: "/images/courses/pho-ga.png",
        instructor: "Master Chef Phạm Tuấn Hải",
        price: 15500000,
        url: "/khoa-hoc/pho-ga-ha-noi",
    },
    "pho-ga-tron": {
        name: "Phở Gà Trộn & Miến Gà",
        slug: "pho-ga-tron",
        image: "/uploads/pho-ga-tron.webp",
        instructor: "Master Chef Phạm Tuấn Hải",
        price: 9500000,
        url: "/khoa-hoc/pho-ga-tron",
    },
    "mon-dong-que": {
        name: "Món Đồng Quê Thực Chiến",
        slug: "mon-dong-que",
        image: "/images/courses/mon-dong-que.jpg",
        instructor: "Đầu bếp Duaxcar",
        price: 8000000,
        url: "/khoa-hoc/mon-dong-que",
    },
    "mon-dong-que-thuc-chien": {
        name: "Món Đồng Quê Thực Chiến",
        slug: "mon-dong-que",
        image: "/images/courses/mon-dong-que.jpg",
        instructor: "Đầu bếp Duaxcar",
        price: 8000000,
        url: "/khoa-hoc/mon-dong-que",
    },
    "pho-xao": {
        name: "Phở Xào & Mì Xào Giòn",
        slug: "pho-xao",
        image: "/uploads/test-logo-upload-1787974793202.png",
        instructor: "Nghệ nhân Nguyễn Hữu Thọ",
        price: 8500000,
        url: "/khoa-hoc/pho-xao",
    },
    "hai-san-nha-hang": {
        name: "Hải Sản Nhà Hàng",
        slug: "mon-hai-san",
        image: "/images/courses/mon-dong-que.jpg",
        instructor: "Đầu bếp Duaxcar",
        price: 9000000,
        url: "/khoa-hoc/mon-hai-san",
    },
    "mon-hai-san": {
        name: "Hải Sản Nhà Hàng",
        slug: "mon-hai-san",
        image: "/images/courses/mon-dong-que.jpg",
        instructor: "Đầu bếp Duaxcar",
        price: 9000000,
        url: "/khoa-hoc/mon-hai-san",
    },
    "mon-cao-cap": {
        name: "Món Cao Cấp Fine Dining",
        slug: "mon-cao-cap",
        image: "/images/courses/pho-bo.jpg",
        instructor: "Master Chef Christine Hà",
        price: 18000000,
        url: "/khoa-hoc/mon-cao-cap",
    },
    "mon-cao-cap-fine-dining": {
        name: "Món Cao Cấp Fine Dining",
        slug: "mon-cao-cap",
        image: "/images/courses/pho-bo.jpg",
        instructor: "Master Chef Christine Hà",
        price: 18000000,
        url: "/khoa-hoc/mon-cao-cap",
    },
};

/**
 * Checks if a string looks like a raw kebab-case slug rather than a human-readable title
 */
export function isSlugString(str?: string): boolean {
    if (!str) return false;
    const trimmed = str.trim();
    // E.g. pho-bo-truyen-thong, lau-nuong-tron-goi
    return /^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(trimmed);
}

/**
 * Normalizes and resolves a schedule item with full course information
 */
export function resolveScheduleInfo(schedule: ScheduleItem, coursesList: Course[] = []) {
    // 1. Try to match from coursesList
    const matchedCourse = coursesList.find(
        (c) =>
            c.slug === schedule.courseSlug ||
            c.id === schedule.courseSlug ||
            (SLUG_TO_INFO[schedule.courseSlug] && c.slug === SLUG_TO_INFO[schedule.courseSlug].slug)
    );

    const fallbackInfo = SLUG_TO_INFO[schedule.courseSlug] || SLUG_TO_INFO[matchedCourse?.slug || ""];

    // 2. Resolve Course Name (Never allow raw slug to display!)
    let displayName = schedule.courseName?.trim();
    if (!displayName || isSlugString(displayName)) {
        displayName = matchedCourse?.name || fallbackInfo?.name || "Khóa học Bếp Chuyên Nghiệp";
    }

    // 3. Resolve Image (Never allow broken image or empty image or slug as image!)
    let displayImage = schedule.courseImage?.trim();
    if (!displayImage || isSlugString(displayImage) || displayImage.includes("undefined")) {
        displayImage = matchedCourse?.image || fallbackInfo?.image || "/images/courses/pho-bo.jpg";
    }

    // 4. Resolve URL
    const realSlug = matchedCourse?.slug || fallbackInfo?.slug || schedule.courseSlug;
    const displayUrl = schedule.courseUrl?.trim() || `/khoa-hoc/${realSlug}`;

    // 5. Resolve Instructor
    const displayInstructor =
        schedule.instructorName?.trim() ||
        matchedCourse?.instructor ||
        fallbackInfo?.instructor ||
        "Nghệ nhân DuaxCar Kitchen";

    // 6. Resolve Price
    const displayPrice = schedule.price || matchedCourse?.price || fallbackInfo?.price;

    return {
        ...schedule,
        courseSlug: realSlug,
        courseName: displayName,
        courseImage: displayImage,
        courseUrl: displayUrl,
        instructorName: displayInstructor,
        price: displayPrice,
        matchedCourse,
    };
}
