import React from "react";
import { Metadata } from "next";
import { PolicyLayout } from "@/components/legal/PolicyLayout";
import { CreditCard, QrCode, Building2, RefreshCw, ReceiptText, ShieldCheck, AlertCircle, Award } from "lucide-react";

export const metadata: Metadata = {
    title: "Chính Sách Thanh Toán & Hoàn Phí Đào Tạo | DuaxCar Kitchen",
    description: "Quy định thanh toán học phí, đặt cọc giữ chỗ, chính sách bảo lưu và hoàn phí đào tạo tại Học viện Ẩm thực DuaxCar Kitchen.",
};

const toc = [
    { id: "phuong-thuc-thanh-toan", title: "Phương thức thanh toán được chấp nhận" },
    { id: "dat-coc-giu-cho", title: "Quy trình đặt cọc & Xác nhận giữ chỗ" },
    { id: "bao-luu-doi-lich", title: "Quy chế bảo lưu & Chuyển đổi khóa học" },
    { id: "chinh-sach-hoan-phi", title: "Chính sách hoàn tiền & Điều kiện áp dụng" },
    { id: "hoa-don-tai-chinh", title: "Xuất hóa đơn tài chính (VAT) & Biên nhận" },
    { id: "tai-khoan-chinh-thuc", title: "Thông tin tài khoản thụ hưởng chính thức" },
];

export default function PaymentPolicyPage() {
    return (
        <PolicyLayout
            title="Chính Sách Thanh Toán & Hoàn Phí"
            subtitle="Quy định minh bạch về thanh toán học phí, đặt cọc giữ chỗ lớp thực hành, chính sách bảo lưu và cam kết hoàn phí tại DuaxCar Kitchen."
            badge="Thanh Toán & Hoàn Phí"
            icon={<CreditCard className="w-4 h-4" />}
            lastUpdated="18/08/2026"
            toc={toc}
        >
            {/* Lead Intro Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-orange-500/10 border-l-4 border-[var(--color-primary)] text-xs sm:text-small">
                <div className="flex items-center gap-2 font-bold text-[var(--color-primary)] text-sm mb-1.5">
                    <ReceiptText className="w-4 h-4" />
                    <span>Minh bạch tài chính & Quyền lợi học viên</span>
                </div>
                <p className="text-[var(--color-text)] mb-0">
                    Học phí tại DuaxCar Kitchen là <strong>học phí trọn gói</strong> (bao gồm 100% nguyên vật liệu thực hành tươi ngon chuẩn kinh doanh, giáo trình và đồng phục bếp, cam kết không phát sinh bất kỳ chi phí phụ nào trong suốt quá trình học).
                </p>
            </div>

            {/* Section 1 */}
            <section id="phuong-thuc-thanh-toan">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">01</span>
                    Phương thức thanh toán được chấp nhận
                </h2>
                <p>
                    Nhằm tạo sự thuận tiện tối đa cho học viên trên khắp cả nước và kiều bào nước ngoài, DuaxCar Kitchen hỗ trợ các hình thức thanh toán sau:
                </p>
                <div className="grid sm:grid-cols-2 gap-3.5 my-4">
                    <div className="p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl">
                        <div className="flex items-center gap-2 font-semibold text-[var(--color-text)] text-xs mb-1.5">
                            <QrCode className="w-4 h-4 text-[var(--color-primary)]" />
                            <span>1. Chuyển khoản ngân hàng 24/7 (VietQR)</span>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-secondary)] mb-0">
                            Chuyển khoản nhanh qua mã QR tự động Napas 247 từ tất cả các ứng dụng ngân hàng và ví điện tử. Tiền nổi ngay lập tức và hệ thống tự động kích hoạt tài khoản E-learning.
                        </p>
                    </div>

                    <div className="p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl">
                        <div className="flex items-center gap-2 font-semibold text-[var(--color-text)] text-xs mb-1.5">
                            <Building2 className="w-4 h-4 text-[var(--color-primary)]" />
                            <span>2. Thanh toán tiền mặt tại Văn phòng học viện</span>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-secondary)] mb-0">
                            Thanh toán trực tiếp tại: Số 20 TT18, KĐT Văn Phú, Phú La, Hà Đông, Hà Nội. Bộ phận lễ tân sẽ cấp phiếu thu có dấu mộc đỏ ngay khi nhận tiền.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 2 */}
            <section id="dat-coc-giu-cho">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">02</span>
                    Quy trình đặt cọc & Xác nhận giữ chỗ
                </h2>
                <p>
                    Do mỗi lớp thực hành trực tiếp tại xưởng bếp chỉ giới hạn <strong>tối đa 6-8 học viên</strong> để đảm bảo chất lượng, học viên cần tuân thủ quy trình giữ chỗ:
                </p>
                <ol>
                    <li><strong>Mức đặt cọc giữ chỗ:</strong> Tối thiểu <strong>1.000.000đ - 2.000.000đ</strong>/khóa học (khoản tiền này sẽ được trừ trực tiếp vào tổng học phí).</li>
                    <li><strong>Thời hạn hoàn tất học phí còn lại:</strong> Học viên đóng đủ phần học phí còn lại vào ngày khai giảng đầu tiên tại lớp.</li>
                    <li><strong>Xác nhận nhập học:</strong> Sau khi nhận tiền cọc, học viện sẽ gửi Giấy Báo Nhập Học chính thức qua Zalo và SMS trong vòng 30 phút.</li>
                </ol>
            </section>

            {/* Section 3 */}
            <section id="bao-luu-doi-lich">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">03</span>
                    Quy chế bảo lưu & Chuyển đổi khóa học
                </h2>
                <p>
                    Trường hợp học viên có việc đột xuất không thể tham gia khóa học theo lịch đã đăng ký:
                </p>
                <ul>
                    <li><strong>Thời hạn thông báo:</strong> Học viên cần thông báo cho bộ phận đào tạo trước ngày khai giảng tối thiểu <strong>03 ngày</strong>.</li>
                    <li><strong>Thời hạn bảo lưu:</strong> Học phí đã đóng được <strong>bảo lưu nguyên vẹn trong vòng 12 tháng</strong>. Học viên có thể sắp xếp học vào bất kỳ đợt khai giảng nào tiếp theo.</li>
                    <li><strong>Chuyển đổi khóa học:</strong> Học viên có thể chuyển đổi sang môn học khác (ví dụ: từ Phở Bò sang Bún Bò Huế hoặc Lẩu) và chỉ cần bù hoặc nhận lại chênh lệch học phí nếu có.</li>
                </ul>
            </section>

            {/* Section 4 */}
            <section id="chinh-sach-hoan-phi">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">04</span>
                    Chính sách hoàn tiền & Điều kiện áp dụng
                </h2>
                <p>
                    Chính sách hoàn phí được quy định cụ thể theo bảng dưới đây:
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Trường hợp hủy khóa học</th>
                            <th>Mức hoàn trả</th>
                            <th>Thời gian xử lý</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Học viện thay đổi lịch hoặc hủy lớp do nguyên nhân khách quan</td>
                            <td><strong className="text-green-600 font-bold">Hoàn 100%</strong> học phí đã đóng</td>
                            <td>Trong vòng 24 giờ</td>
                        </tr>
                        <tr>
                            <td>Học viên báo hủy trước ngày khai giảng từ 05 ngày trở lên</td>
                            <td><strong>Hoàn 100%</strong> số tiền cọc/học phí</td>
                            <td>Trong vòng 48 giờ làm việc</td>
                        </tr>
                        <tr>
                            <td>Học viên báo hủy trước ngày khai giảng từ 01 - 04 ngày</td>
                            <td>Chuyển sang <strong>Bảo lưu 100%</strong> cho khóa sau</td>
                            <td>Xác nhận bảo lưu tức thì</td>
                        </tr>
                        <tr>
                            <td>Khóa học Online (E-learning) đã kích hoạt và tải tài liệu</td>
                            <td>Không áp dụng hoàn tiền (do đặc thù giáo trình số)</td>
                            <td>Hỗ trợ giải đáp chuyên môn trọn đời</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Section 5 */}
            <section id="hoa-don-tai-chinh">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">05</span>
                    Xuất hóa đơn tài chính (VAT) & Biên nhận
                </h2>
                <p>
                    DuaxCar Kitchen hỗ trợ xuất Hóa Đơn Điện Tử (VAT) cho các doanh nghiệp, công ty, nhà hàng hoặc hộ kinh doanh cá thể có nhu cầu hạch toán chi phí đào tạo nhân sự:
                </p>
                <ul>
                    <li>Vui lòng cung cấp đầy đủ thông tin xuất hóa đơn (Tên công ty, Mã số thuế, Địa chỉ, Email nhận HĐĐT) cho nhân viên tư vấn ngay khi chuyển khoản.</li>
                    <li>Hóa đơn điện tử hợp lệ sẽ được gửi về email của quý công ty trong vòng 01 - 03 ngày làm việc.</li>
                </ul>
            </section>

            {/* Section 6 */}
            <section id="tai-khoan-chinh-thuc">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">06</span>
                    Thông tin tài khoản thụ hưởng chính thức
                </h2>
                <p>
                    Để đảm bảo an toàn tuyệt đối, tránh các trường hợp mạo danh, học viên chỉ chuyển khoản vào tài khoản ngân hàng chính thức sau:
                </p>
                
                <div className="p-4 bg-[var(--color-background)] border-2 border-[var(--color-primary)]/30 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-text-muted)] font-medium">Ngân hàng:</span>
                        <strong className="text-[var(--color-text)]">Ngân hàng TMCP Quân Đội (MB Bank)</strong>
                    </div>
                    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-text-muted)] font-medium">Chủ tài khoản:</span>
                        <strong className="text-[var(--color-primary)] uppercase">DUAXCAR KITCHEN / NGUYEN HUU THO</strong>
                    </div>
                    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                        <span className="text-[var(--color-text-muted)] font-medium">Số tài khoản:</span>
                        <strong className="font-mono text-sm tracking-wider text-[var(--color-text)]">0963896791</strong>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                        <span className="text-[var(--color-text-muted)] font-medium">Cú pháp chuyển khoản:</span>
                        <span className="font-mono bg-[var(--color-surface)] px-2 py-0.5 rounded border border-[var(--color-border)] text-[11px] text-[var(--color-text)]">
                            [Họ Tên] + [Số Điện Thoại] + [Tên Khóa Học]
                        </span>
                    </div>
                </div>

                <div className="p-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-[11px] text-[var(--color-text)] flex items-start gap-2.5 my-3">
                    <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <strong>Xác thực an toàn:</strong> Sau khi hoàn tất chuyển khoản, học viên vui lòng chụp lại màn hình giao dịch và gửi cho nhân viên tư vấn để nhận mã Giấy Báo Nhập Học.
                    </div>
                </div>
            </section>

            {/* Verification Stamp Footer */}
            <div className="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <Award className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Phòng Kế Toán & Tài Chính <strong>DuaxCar Kitchen Academy</strong></span>
                </div>
                <div className="text-[var(--color-text-muted)] text-[11px]">
                    Mã văn bản: <code>POL-PAY-2026-V2.0</code>
                </div>
            </div>
        </PolicyLayout>
    );
}
