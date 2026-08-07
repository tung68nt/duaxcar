import React from "react";

export const metadata = {
    title: "Chính sách bảo mật | DuaxCar Kitchen",
    description: "Chính sách bảo mật thông tin khách hàng",
};

export default function BaomatPage() {
    return (
        <div className="container py-20">
            <h1 className="heading-1 mb-8 text-[var(--color-primary)]">Chính sách bảo mật</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>DuaxCar Kitchen cam kết bảo mật thông tin cá nhân của quý khách hàng.</p>

                <h3>1. Mục đích thu thập thông tin</h3>
                <p>Chúng tôi thu thập thông tin để hỗ trợ đăng ký khóa học và tư vấn dịch vụ.</p>

                <h3>2. Phạm vi sử dụng thông tin</h3>
                <p>Thông tin chỉ được sử dụng nội bộ và không chia sẻ cho bên thứ ba nếu không có sự đồng ý.</p>

                <h3>3. Thời gian lưu trữ</h3>
                <p>Dữ liệu được lưu trữ cho đến khi có yêu cầu hủy bỏ.</p>

                <p><em>(Nội dung chi tiết đang được cập nhật...)</em></p>
            </div>
        </div>
    );
}
