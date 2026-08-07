import Link from "next/link";
import Image from "next/image";
import {
    ChefHat,
    Target,
    Eye,
    Award,
    Users,
    TrendingUp,
    Heart,
    CheckCircle,
    Calendar,
    Quote,
    BookOpen,
    ArrowRight,
    HeartHandshake,
} from "lucide-react";
import { stats, instructors as mockInstructors } from "@/data/mock";
import { getSupabaseInstructors } from "@/lib/cms";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Về DuaxCar - Giới thiệu & Đội ngũ giảng viên",
    description:
        "Tìm hiểu về DuaxCar Kitchen - Trung tâm đào tạo ẩm thực chuyên biệt với đội ngũ nghệ nhân ẩm thực hàng đầu.",
};

import AboutUsClient from "@/components/layout/AboutUsClient";

export default async function AboutUsAndTeamPage() {
    const liveInstructors = await getSupabaseInstructors();
    const instructors = liveInstructors.length > 0 ? liveInstructors : mockInstructors;

    return (
        <AboutUsClient 
            initialStats={stats}
            initialInstructors={instructors}
        />
    );
}

