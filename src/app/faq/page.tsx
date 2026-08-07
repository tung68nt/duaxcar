import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import { ArrowRight, MessageCircle, Phone, Mail } from "lucide-react";

export const metadata = {
    title: "Câu hỏi thường gặp | DuaxCar Kitchen",
    description: "Giải đáp các thắc mắc về khóa học, hình thức thanh toán và quy trình học tại DuaxCar Kitchen.",
};

import FaqClient from "@/components/layout/FaqClient";

export default function FaqPage() {
    return (
        <FaqClient />
    );
}
