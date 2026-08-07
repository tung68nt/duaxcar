import React from "react";

export const metadata = {
    title: "Chính sách thanh toán | DuaxCar Kitchen",
    description: "Quy định về thanh toán khóa học",
};

export default function ThanhtoanPage() {
    return (
        <div className="container py-20">
            <h1 className="heading-1 mb-8 text-[var(--color-primary)]">Chính sách thanh toán</h1>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>Các hình thức thanh toán được chấp nhận tại DuaxCar Kitchen:</p>

                <h3>1. Chuyển khoản ngân hàng</h3>
                <p>Thông tin tài khoản sẽ được cung cấp khi học viên đăng ký khóa học.</p>

                <h3>2. Tiền mặt</h3>
                <p>Thanh toán trực tiếp tại văn phòng: Số 20 TT18, KĐT Văn Phú, Phú La, Hà Đông, Hà Nội.</p>

                <h3>3. Hoàn tiền</h3>
                <p>Chính sách hoàn tiền sẽ áp dụng theo quy định cụ thể của từng khóa học.</p>

                <p><em>(Nội dung chi tiết đang được cập nhật...)</em></p>
            </div>
        </div>
    );
}
