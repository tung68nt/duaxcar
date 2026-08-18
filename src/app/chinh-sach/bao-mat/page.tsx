import React from "react";
import { Metadata } from "next";
import { PolicyLayout } from "@/components/legal/PolicyLayout";
import { ShieldCheck, Lock, UserCheck, EyeOff, Server, Bell, CheckCircle2, Award } from "lucide-react";

export const metadata: Metadata = {
    title: "Chính Sách Bảo Mật Thông Tin | DuaxCar Kitchen",
    description: "Cam kết bảo vệ tuyệt đối dữ liệu và thông tin cá nhân của học viên và khách hàng tại Học viện Ẩm thực DuaxCar Kitchen theo quy định pháp luật hiện hành.",
};

const toc = [
    { id: "muc-dich", title: "Mục đích & Phạm vi thu thập thông tin" },
    { id: "pham-vi-su-dung", title: "Phạm vi & Nguyên tắc sử dụng dữ liệu" },
    { id: "thoi-gian-luu-tru", title: "Thời gian lưu trữ & Bảo quản thông tin" },
    { id: "bao-mat-thanh-toan", title: "Cam kết bảo mật giao dịch & Thanh toán" },
    { id: "chia-se-ben-thu-ba", title: "Chính sách chia sẻ cho bên thứ ba" },
    { id: "quyen-hoc-vien", title: "Quyền lợi và Trách nhiệm của học viên" },
    { id: "thay-doi-chinh-sach", title: "Hiệu lực & Điều khoản sửa đổi" },
];

export default function PrivacyPolicyPage() {
    return (
        <PolicyLayout
            title="Chính Sách Bảo Mật Thông Tin"
            subtitle="Học viện Ẩm thực DuaxCar Kitchen cam kết bảo vệ tuyệt đối quyền riêng tư và dữ liệu cá nhân của học viên, khách hàng theo Nghị định 13/2023/NĐ-CP của Chính phủ."
            badge="Bảo Mật & Quyền Riêng Tư"
            icon={<ShieldCheck className="w-4 h-4" />}
            lastUpdated="18/08/2026"
            toc={toc}
        >
            {/* Lead Commitment Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs sm:text-small shadow-sm">
                <div className="flex items-center gap-2 font-bold text-[var(--color-primary)] text-sm mb-1.5">
                    <Lock className="w-4 h-4" />
                    <span>Cam kết bảo mật tuyệt đối từ DuaxCar Kitchen</span>
                </div>
                <p className="text-[var(--color-text)] mb-0">
                    Sự tin cậy của học viên là nền tảng hoạt động của DuaxCar Kitchen. Chúng tôi áp dụng các tiêu chuẩn an toàn dữ liệu cao nhất nhằm đảm bảo mọi thông tin cá nhân, hồ sơ đào tạo và bí quyết công thức kinh doanh của bạn được bảo mật tuyệt đối.
                </p>
            </div>

            {/* Section 1 */}
            <section id="muc-dich">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">01</span>
                    Mục đích & Phạm vi thu thập thông tin
                </h2>
                <p>
                    Để hỗ trợ quy trình tư vấn tuyển sinh, xếp lớp đào tạo và hỗ trợ kỹ thuật sau khóa học, DuaxCar Kitchen tiến hành thu thập một số thông tin cần thiết bao gồm:
                </p>
                <ul>
                    <li><strong>Thông tin định danh cơ bản:</strong> Họ và tên, Số điện thoại (Zalo), Địa chỉ Email, Địa chỉ cư trú hoặc địa điểm dự kiến mở quán.</li>
                    <li><strong>Thông tin học tập & nguyện vọng:</strong> Khóa học quan tâm (học trực tiếp hoặc online), mô hình kinh doanh dự kiến (quán ăn gia đình, chuỗi nhà hàng, takeaway...).</li>
                    <li><strong>Dữ liệu giao dịch đào tạo:</strong> Lịch sử thanh toán học phí, mã hóa đơn, biên nhận chuyển khoản (chúng tôi không lưu trữ mật khẩu ngân hàng hay mã CVV của thẻ tín dụng).</li>
                    <li><strong>Dữ liệu kỹ thuật tự động:</strong> Địa chỉ IP, trình duyệt web, thời gian truy cập website nhằm tối ưu hóa trải nghiệm và tốc độ tải trang.</li>
                </ul>
            </section>

            {/* Section 2 */}
            <section id="pham-vi-su-dung">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">02</span>
                    Phạm vi & Nguyên tắc sử dụng dữ liệu
                </h2>
                <p>
                    Mọi thông tin cá nhân do học viên cung cấp chỉ được sử dụng nghiêm ngặt cho các mục đích hợp pháp sau:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 my-4">
                    <div className="p-3.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl">
                        <div className="flex items-center gap-2 font-semibold text-[var(--color-text)] text-xs mb-1">
                            <UserCheck className="w-4 h-4 text-[var(--color-primary)]" />
                            <span>Quản lý học viên & Lớp học</span>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-secondary)] mb-0">
                            Xếp lịch học thực hành trực tiếp tại bếp, gửi giáo trình điện tử và tài liệu công thức độc quyền.
                        </p>
                    </div>

                    <div className="p-3.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl">
                        <div className="flex items-center gap-2 font-semibold text-[var(--color-text)] text-xs mb-1">
                            <Bell className="w-4 h-4 text-[var(--color-primary)]" />
                            <span>Thông báo & Cập nhật</span>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-secondary)] mb-0">
                            Gửi thông báo lịch khai giảng, thông tin cập nhật công thức mới hoặc chương trình ưu đãi dành riêng cho cựu học viên.
                        </p>
                    </div>
                </div>
                <p>
                    DuaxCar Kitchen <strong>tuyệt đối không</strong> bán, trao đổi, cho thuê hoặc chuyển nhượng cơ sở dữ liệu học viên cho bất kỳ đơn vị quảng cáo hay bên thứ ba nào vì mục đích thương mại.
                </p>
            </section>

            {/* Section 3 */}
            <section id="thoi-gian-luu-tru">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">03</span>
                    Thời gian lưu trữ & Bảo quản thông tin
                </h2>
                <p>
                    Thời hạn lưu trữ dữ liệu cá nhân của học viên được quy định như sau:
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Loại dữ liệu</th>
                            <th>Mục đích sử dụng</th>
                            <th>Thời hạn lưu trữ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Thông tin tư vấn ban đầu</td>
                            <td>Tư vấn chọn khóa học phù hợp</td>
                            <td>12 tháng kể từ ngày đăng ký</td>
                        </tr>
                        <tr>
                            <td>Hồ sơ học viên chính thức</td>
                            <td>Bảo hành công thức & Cấp chứng chỉ</td>
                            <td>Trọn đời (để hỗ trợ cựu học viên khi mở quán)</td>
                        </tr>
                        <tr>
                            <td>Hóa đơn & Chứng từ tài chính</td>
                            <td>Báo cáo tài chính & Kế toán</td>
                            <td>Theo quy định của Luật Kế toán Việt Nam</td>
                        </tr>
                    </tbody>
                </table>
                <p>
                    Học viên có quyền yêu cầu xóa bỏ hoặc đóng băng dữ liệu cá nhân bất kỳ lúc nào bằng cách liên hệ bộ phận hỗ trợ của học viện.
                </p>
            </section>

            {/* Section 4 */}
            <section id="bao-mat-thanh-toan">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">04</span>
                    Cam kết bảo mật giao dịch & Thanh toán
                </h2>
                <p>
                    Hệ thống thanh toán học phí của DuaxCar Kitchen áp dụng các giao thức an toàn tiêu chuẩn quốc tế:
                </p>
                <ul>
                    <li><strong>Mã hóa SSL 256-bit:</strong> Toàn bộ dữ liệu truyền tải giữa máy tính học viên và máy chủ đều được mã hóa an toàn qua giao thức HTTPS.</li>
                    <li><strong>Bảo mật cổng ngân hàng:</strong> Giao dịch chuyển khoản trực tiếp qua mã QR VietQR chuẩn Napas 247 được xác thực 2 lớp qua ứng dụng ngân hàng số của học viên.</li>
                    <li><strong>Biên nhận điện tử:</strong> Mọi khoản thanh toán đều có mã tra cứu và xác nhận tự động qua SMS/Zalo/Email ngay sau khi hoàn tất.</li>
                </ul>
            </section>

            {/* Section 5 */}
            <section id="chia-se-ben-thu-ba">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">05</span>
                    Chính sách chia sẻ cho bên thứ ba
                </h2>
                <p>
                    Chúng tôi chỉ cung cấp thông tin cá nhân cho bên thứ ba trong các trường hợp ngoại lệ sau:
                </p>
                <ol>
                    <li>Được sự đồng ý hoặc ủy quyền rõ ràng bằng văn bản từ chính học viên.</li>
                    <li>Các đối tác dịch vụ vận chuyển được chỉ định để gửi tài liệu, giáo trình, dụng cụ hoặc nguyên liệu mẫu đến tận nhà học viên.</li>
                    <li>Khi có yêu cầu bằng văn bản từ cơ quan thực thi pháp luật hoặc cơ quan nhà nước có thẩm quyền theo đúng trình tự pháp luật Việt Nam.</li>
                </ol>
            </section>

            {/* Section 6 */}
            <section id="quyen-hoc-vien">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">06</span>
                    Quyền lợi và Trách nhiệm của học viên
                </h2>
                <p><strong>Học viên có các quyền hợp pháp sau:</strong></p>
                <ul>
                    <li>Yêu cầu kiểm tra, cập nhật, điều chỉnh hoặc hủy bỏ thông tin cá nhân đã lưu trữ.</li>
                    <li>Từ chối nhận các email/tin nhắn thông báo khuyến mãi hoặc thông tin tiếp thị.</li>
                    <li>Yêu cầu giải trình về việc thu thập và sử dụng thông tin của mình.</li>
                </ul>
                <p><strong>Trách nhiệm của học viên:</strong></p>
                <ul>
                    <li>Cung cấp thông tin chính xác, trung thực khi đăng ký để bảo đảm quyền lợi khi cấp chứng chỉ và bảo lưu khóa học.</li>
                    <li>Tự bảo quản thông tin đăng nhập tài khoản học trực tuyến (E-learning), không chia sẻ tài khoản cho người khác sử dụng chung.</li>
                </ul>
            </section>

            {/* Section 7 */}
            <section id="thay-doi-chinh-sach">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">07</span>
                    Hiệu lực & Điều khoản sửa đổi
                </h2>
                <p>
                    Chính sách này có hiệu lực chính thức kể từ ngày công bố trên website <code>duaxcar.vn</code>. DuaxCar Kitchen có thể cập nhật nội dung chính sách theo từng thời kỳ để phù hợp với quy định pháp luật và nâng cao chất lượng dịch vụ. Mọi thay đổi quan trọng sẽ được thông báo công khai trên trang chủ.
                </p>
            </section>

            {/* Verification Stamp Footer */}
            <div className="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <Award className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Ban Điều Hành & Pháp Chế <strong>DuaxCar Kitchen Academy</strong></span>
                </div>
                <div className="text-[var(--color-text-muted)] text-[11px]">
                    Mã văn bản: <code>POL-SEC-2026-V2.1</code>
                </div>
            </div>
        </PolicyLayout>
    );
}
