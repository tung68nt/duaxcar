import fs from 'fs';
import path from 'path';
import { 
    courses as defaultCourses, 
    instructors as defaultInstructors, 
    blogPosts as defaultBlogs, 
    testimonials as defaultTestimonials, 
    siteConfig as defaultSiteConfig,
    courseCategories
} from '@/data/mock';
import { Course, Instructor, BlogPost, Testimonial } from '@/lib/types';

const DB_FILE = path.join(process.cwd(), 'src', 'data', 'cms-store.json');

export interface FAQItem {
    id: string;
    category: string;
    title: string;
    content: string;
    visible: boolean;
}

export interface SiteSettings {
    brandName: string;
    tagline: string;
    logo?: string;
    favicon?: string;
    phone: string;
    hotline: string;
    email: string;
    address: string;
    facebook: string;
    youtube: string;
    tiktok: string;
    academy: string;
    heroTitle: string;
    heroSubtitle: string;
    heroBanners: { id: number; image: string; alt: string }[];
    aboutHeroTitle: string;
    aboutHeroSubtitle: string;
    aboutStoryTitle: string;
    aboutStoryContent: string;
    aboutStoryImage: string;
    aboutVision: string;
    aboutMission: string;
}

export interface Registration {
    id: string;
    name: string;
    phone: string;
    email: string;
    courseName: string;
    status: "pending" | "contacted" | "enrolled" | "cancelled";
    date: string;
    note?: string;
}

import { MediaItem } from './media-store';

export interface DBData {
    courses: Course[];
    instructors: Instructor[];
    blogs: BlogPost[];
    testimonials: Testimonial[];
    faqs: FAQItem[];
    settings: SiteSettings;
    registrations: Registration[];
    media?: MediaItem[];
}

const defaultFaqs: FAQItem[] = [
    {
        id: "faq-1",
        category: "Về khóa học",
        title: "Tôi chưa biết gì về nấu ăn có học được không?",
        content: "Hoàn toàn được! Các khóa học tại DuaxCar Kitchen được thiết kế từ cơ bản đến nâng cao, phù hợp cho cả người mới bắt đầu. Giảng viên sẽ hướng dẫn chi tiết từng bước, từ cách cầm dao, sơ chế nguyên liệu đến kỹ thuật nấu nướng chuyên nghiệp.",
        visible: true
    },
    {
        id: "faq-2",
        category: "Về khóa học",
        title: "Học phí đã bao gồm nguyên liệu chưa?",
        content: "Đối với các khóa học trực tiếp (Onsite), học phí ĐÃ BAO GỒM toàn bộ chi phí nguyên liệu thực hành, tài liệu và chứng chỉ. Bạn không cần đóng thêm bất kỳ khoản phí nào khác.",
        visible: true
    },
    {
        id: "faq-3",
        category: "Về khóa học",
        title: "Lớp học có bao nhiêu học viên?",
        content: "Để đảm bảo chất lượng giảng dạy 1 kèm 1 và thời gian thực hành tối đa, mỗi lớp học tại DuaxCar Kitchen giới hạn từ 3 đến 8 học viên.",
        visible: true
    },
    {
        id: "faq-4",
        category: "Học trực tuyến",
        title: "Khóa học Online xem được trong bao lâu?",
        content: "Các khóa học E-Learning trên hệ thống Academy của DuaxCar có thời hạn sở hữu trọn đời. Bạn có thể xem lại bài giảng video chuẩn HD bất cứ lúc nào, trên mọi thiết bị.",
        visible: true
    }
];

const defaultSettings: SiteSettings = {
    brandName: "DuaxCar Kitchen",
    tagline: "Trung tâm đào tạo ẩm thực chuyên nghiệp",
    logo: "/images/logo.png",
    favicon: "/images/logo.png",
    phone: "0988.234.567",
    hotline: "0966.789.012",
    email: "contact@duaxcar.com",
    address: "Số 12, Ngõ 45, Đường Lê Văn Lương, Cầu Giấy, Hà Nội",
    facebook: "https://facebook.com/duaxcar",
    youtube: "https://youtube.com/@duaxcar",
    tiktok: "https://tiktok.com/@duaxcar",
    academy: "https://academy.duaxcar.com/",
    heroTitle: "Nơi khởi đầu cho thành công trong kinh doanh ẩm thực",
    heroSubtitle: "Đào tạo các món ăn Việt truyền thống và kỹ năng kinh doanh quán ăn thực tế. Học cùng nghệ nhân ẩm thực với hơn 25 năm kinh nghiệm.",
    heroBanners: [
        { id: 1, image: "/images/hero-banner.jpg", alt: "Không gian đào tạo Duaxcar" },
        { id: 2, image: "/images/hero-pho.jpg", alt: "Nghệ thuật nấu Phở bò chuẩn vị" },
        { id: 3, image: "/images/hero-bunbo.jpg", alt: "Bí quyết kinh doanh Bún bò Huế" }
    ],
    aboutHeroTitle: "Hành trình giữ lửa & Nâng tầm ẩm thực Việt",
    aboutHeroSubtitle: "DuaxCar Kitchen – Nơi đào tạo nghề bếp chuẩn vị, chuẩn tâm, đồng hành cùng hàng nghìn chủ quán kinh doanh thành công.",
    aboutStoryTitle: "Câu chuyện sáng lập DuaxCar Kitchen",
    aboutStoryContent: "Được thành lập bởi các nghệ nhân ẩm thực tâm huyết, DuaxCar Kitchen ra đời với sứ mệnh mang đến những công thức chuẩn kinh doanh, bí quyết nấu ăn gia truyền và tư duy vận hành bài bản cho những ai ấp ủ ước mơ mở quán ăn.",
    aboutStoryImage: "/images/about-story.jpg",
    aboutVision: "Trở thành hệ sinh thái đào tạo và hỗ trợ khởi nghiệp ẩm thực hàng đầu tại Việt Nam.",
    aboutMission: "Đồng hành cùng học viên từ công thức món ăn đến vận hành điểm bán, giúp mọi quán ăn tối ưu chi phí và bứt phá doanh thu."
};

const defaultRegistrations: Registration[] = [
    { id: "reg-1", name: "Lê Minh Tuấn", phone: "0982345678", email: "minhtuan@gmail.com", courseName: "Phở Bò Truyền Thống", status: "pending", date: "2026-07-18" },
    { id: "reg-2", name: "Nguyễn Thị Mai", phone: "0905123456", email: "mainguyen@gmail.com", courseName: "Bún Bò Huế", status: "contacted", date: "2026-07-17" },
    { id: "reg-3", name: "Phan Anh Đức", phone: "0918765432", email: "anhduc@gmail.com", courseName: "Cơm Thố Xèo", status: "enrolled", date: "2026-07-15" }
];

export function getLocalDB(): DBData {
    try {
        if (!fs.existsSync(DB_FILE)) {
            const initialData: DBData = {
                courses: defaultCourses,
                instructors: defaultInstructors,
                blogs: defaultBlogs,
                testimonials: defaultTestimonials,
                faqs: defaultFaqs,
                settings: defaultSettings,
                registrations: defaultRegistrations
            };
            fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
            fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
            return initialData;
        }

        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
            courses: parsed.courses || defaultCourses,
            instructors: parsed.instructors || defaultInstructors,
            blogs: parsed.blogs || defaultBlogs,
            testimonials: parsed.testimonials || defaultTestimonials,
            faqs: parsed.faqs || defaultFaqs,
            settings: parsed.settings || defaultSettings,
            registrations: parsed.registrations || defaultRegistrations,
            media: parsed.media || []
        };
    } catch (e) {
        console.error("Error reading local db store:", e);
        return {
            courses: defaultCourses,
            instructors: defaultInstructors,
            blogs: defaultBlogs,
            testimonials: defaultTestimonials,
            faqs: defaultFaqs,
            settings: defaultSettings,
            registrations: defaultRegistrations
        };
    }
}

export function saveLocalDB(data: Partial<DBData>) {
    try {
        const current = getLocalDB();
        const updated = { ...current, ...data };
        fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
        fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
        return updated;
    } catch (e) {
        console.error("Error writing to local db store:", e);
        return null;
    }
}
