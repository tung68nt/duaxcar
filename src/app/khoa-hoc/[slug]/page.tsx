import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
    ChefHat,
    Clock,
    Users,
    ArrowRight,
    CheckCircle,
    ArrowLeft,
    Play,
    BookOpen,
    Lock,
} from "lucide-react";
import { CourseAccordion } from "@/components/ui/course-accordion";
import { courses as mockCourses, instructors as mockInstructors, courseCategories } from "@/data/mock";
import { getSupabaseCourses, getSupabaseInstructors } from "@/lib/cms";
import { Metadata } from "next";
import CategoryIcon from "@/components/category-icon";
import CourseRegistrationForm from "@/components/layout/course-registration-form";

export const revalidate = 30;

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const liveCourses = await getSupabaseCourses();
    const courses = liveCourses.length > 0 ? liveCourses : mockCourses;
    return courses.map((course) => ({
        slug: course.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const liveCourses = await getSupabaseCourses();
    const courses = liveCourses.length > 0 ? liveCourses : mockCourses;
    const course = courses.find((c) => c.slug === slug);

    if (!course) {
        return {
            title: "Không tìm thấy khóa học",
        };
    }


    return {
        title: course.name,
        description: course.description,
    };
}

import CourseDetailClient from "@/components/layout/CourseDetailClient";

export default async function CourseDetailPage({ params }: Props) {
    const { slug } = await params;
    const liveCourses = await getSupabaseCourses();
    const courses = liveCourses.length > 0 ? liveCourses : mockCourses;

    const liveInstructors = await getSupabaseInstructors();
    const instructors = liveInstructors.length > 0 ? liveInstructors : mockInstructors;

    const course = courses.find((c) => c.slug === slug);

    if (!course) {
        notFound();
    }

    const instructor = instructors.find((i) => i.id === course.instructorId);
    const category = courseCategories.find((c) => c.id === course.category);
    const relatedCourses = courses
        .filter((c) => c.category === course.category && c.id !== course.id)
        .slice(0, 3);


    return (
        <CourseDetailClient
            slug={slug}
            initialCourse={course}
            initialRelatedCourses={relatedCourses}
            initialInstructor={instructor}
            initialCategory={category}
        />
    );
}
