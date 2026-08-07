import React from "react";

export const metadata = {
    title: "Điều khoản sử dụng | DuaxCar Kitchen",
    description: "Điều khoản sử dụng dịch vụ tại DuaxCar Kitchen",
};

export default function DieukhoanPage() {
    return (
        <div className="container py-20">
            <h1 className="heading-1 mb-8 text-[var(--color-primary)]">Điều khoản sử dụng</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>Chào mừng bạn đến với DuaxCar Kitchen. Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản dưới đây:</p>

                <h3>1. Giới thiệu</h3>
                <p>DuaxCar Kitchen là đơn vị cung cấp các khóa học nấu ăn và tư vấn kinh doanh F&B.</p>

                <h3>2. Quyền sở hữu trí tuệ</h3>
                <p>Mọi nội dung trên website này bao gồm hình ảnh, video, văn bản đều thuộc bản quyền của DuaxCar Kitchen.</p>

                <h3>3. Trách nhiệm người dùng</h3>
                <p>Người dùng cam kết không sử dụng website vào mục đích vi phạm pháp luật.</p>

                <p><em>(Nội dung chi tiết đang được cập nhật...)</em></p>
            </div>
        </div>
    );
}
