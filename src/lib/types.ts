// ============================================
// DuaxCar Kitchen - Type Definitions
// ============================================

export interface Course {
    id: string;
    slug: string;
    name: string;
    category: CourseCategory;
    courseType: "onsite" | "elearning";
    description: string;
    shortDescription: string;
    price: number;
    contactForPrice?: boolean;
    duration: string;
    maxStudents?: number; // Only for onsite
    instructor: string;
    instructorId: string;
    image: string;
    gallery?: string[]; // Multiple classroom and workshop photos
    highlights: string[];
    curriculum: CurriculumItem[];
    featured?: boolean;
    // Video preview / Intro
    videoUrl?: string; // YouTube URL, MP4 link, or Media Library video
    // E-learning specific
    totalLessons?: number;
    totalDuration?: string;
    accessDuration?: string; // e.g. "Trọn đời" or "6 tháng"
    onlineUrl?: string; // Link to equivalent online course
}

export type CourseCategory =
    | "mon-an-sang"
    | "mon-dong-que"
    | "mon-hai-san"
    | "mon-nhau"
    | "mon-com-tho"
    | "lau-nuong"
    | "mon-cao-cap"
    | "mon-gia-dinh";

export interface CurriculumItem {
    title: string;
    description: string;
    details?: string[];
}

export interface Instructor {
    id: string;
    name: string;
    role: string;
    title: string;
    image: string;
    bio: string;
    fullBio?: string;
    achievements: string[];
    courses: string[];
    quote?: string;
    experience?: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    avatar: string;
    content: string;
    rating: number;
    course: string;
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    author: string;
    authorImage: string;
    date: string;
    category: string;
    readTime: string;
    featured?: boolean;
}

export interface Stat {
    value: string;
    label: string;
    suffix?: string;
}

export interface NavItem {
    label: string;
    href: string;
}

export interface ContactInfo {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    companyName?: string;
    mapEmbed: string;
    socials: {
        facebook?: string;
        youtube?: string;
        tiktok?: string;
        zalo?: string;
    };
}
