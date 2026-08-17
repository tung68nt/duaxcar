import React from "react";
import FaqClient from "@/components/layout/FaqClient";
import { getSupabaseFaqs } from "@/lib/cms";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Câu hỏi thường gặp | DuaxCar Kitchen",
    description: "Giải đáp các thắc mắc về khóa học, hình thức thanh toán và quy trình học tại DuaxCar Kitchen.",
};

export default async function FaqPage() {
    const liveFaqs = await getSupabaseFaqs();
    return (
        <FaqClient initialFaqs={liveFaqs.length > 0 ? liveFaqs : undefined} />
    );
}
