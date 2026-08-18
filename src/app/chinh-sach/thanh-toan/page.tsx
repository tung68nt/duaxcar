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
    { id: "quy-trinh-thanh-toan", title: "Quy trình thanh toán & Xác thực an toàn" },
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
            <div className="p-4 sm:p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs sm:text-small shadow-sm">
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
                    Nhằm tạo điều kiện thuận lợi và an toàn tối đa cho học viên trên toàn quốc, DuaxCar Kitchen hỗ trợ các hình thức thanh toán đa dạng sau:
                </p>

                <div className="grid sm:grid-cols-2 gap-3.5 my-4">
                    <div className="p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl">
                        <div className="flex items-center gap-2.5 font-bold text-xs text-[var(--color-text)] mb-1.5">
                            <QrCode className="w-4 h-4 text-[var(--color-primary)]" />
                            <span>Chuyển khoản Ngân hàng (QR Code 24/7)</span>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-secondary)] mb-0 leading-relaxed">
                            Quét mã VietQR chuyển khoản nhanh 24/7 qua Internet Banking của tất cả các ngân hàng Việt Nam. Hệ thống tự động xác nhận trong 1 phút.
                        </p>
                    </div>

                    <div className="p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl">
                        <div className="flex items-center gap-2.5 font-bold text-xs text-[var(--color-text)] mb-1.5">
                            <Building2 className="w-4 h-4 text-orange-500" />
                            <span>Thanh toán trực tiếp tại Trụ sở</span>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-secondary)] mb-0 leading-relaxed">
                            Thanh toán bằng tiền mặt hoặc quẹt thẻ POS (hỗ trợ thẻ Visa, Master, JCB, Napas) trực tiếp tại văn phòng tuyển sinh của DuaxCar Kitchen.
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
                    Do mỗi lớp học thực hành tại DuaxCar chỉ nhận <strong>tối đa 6 - 8 học viên</strong> để đảm bảo chất lượng “cầm tay chỉ việc”, quy trình giữ chỗ được thực hiện như sau:
                </p>
                <ul>
                    <li><strong>Mức phí đặt cọc:</strong> Tối thiểu <strong>30% - 50%</strong> tổng học phí của khóa học để trung tâm chuẩn bị nguyên vật liệu và xếp lịch giảng viên.</li>
                    <li><strong>Thời hạn hoàn tất học phí còn lại:</strong> Học viên thanh toán phần học phí còn lại vào ngày đầu tiên khai giảng khóa học trước khi bước vào giờ thực hành.</li>
                    <li><strong>Xác nhận nhập học:</strong> Ngay sau khi nhận tiền cọc, DuaxCar Kitchen sẽ gửi Giấy báo nhập học và mã lớp qua Email & SMS cho học viên.</li>
                </ul>
            </section>

            {/* Section 3 */}
            <section id="bao-luu-doi-lich">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">03</span>
                    Quy chế bảo lưu & Chuyển đổi khóa học
                </h2>
                <p>
                    Chúng tôi luôn tạo điều kiện linh hoạt nhất cho học viên khi có việc bận đột xuất hoặc kế hoạch kinh doanh thay đổi:
                </p>

                <div className="space-y-3 my-4">
                    <div className="p-3.5 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] text-xs">
                        <strong className="text-[var(--color-text)] block mb-1">1. Quyền bảo lưu học phí:</strong>
                        <span className="text-[var(--color-text-secondary)] leading-relaxed">
                            Học viên được bảo lưu toàn bộ học phí đã đóng trong thời hạn <strong>tối đa 06 tháng</strong> kể từ ngày đăng ký. Khi muốn tiếp tục học, chỉ cần báo trước cho ban quản lý lớp 05 ngày làm việc.
                        </span>
                    </div>

                    <div className="p-3.5 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] text-xs">
                        <strong className="text-[var(--color-text)] block mb-1">2. Chuyển đổi lớp hoặc khóa học:</strong>
                        <span className="text-[var(--color-text-secondary)] leading-relaxed">
                            Được phép chuyển sang khóa học khác hoặc đổi ca học hoàn toàn miễn phí nếu thông báo trước ngày khai giảng tối thiểu <strong>03 ngày</strong>.
                        </span>
                    </div>

                    <div className="p-3.5 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] text-xs">
                        <strong className="text-[var(--color-text)] block mb-1">3. Chuyển nhượng suất học cho người thân:</strong>
                        <span className="text-[var(--color-text-secondary)] leading-relaxed">
                            Học viên được quyền chuyển nhượng suất học của mình cho bạn bè hoặc người thân (cần có văn bản xác nhận ủy quyền gửi đến trung tâm).
                        </span>
                    </div>
                </div>
            </section>

            {/* Section 4 */}
            <section id="chinh-sach-hoan-phi">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">04</span>
                    Chính sách hoàn tiền & Điều kiện áp dụng
                </h2>
                <p>
                    Chính sách hoàn phí được áp dụng nghiêm ngặt theo các khung thời gian sau để bảo vệ quyền lợi của cả học viên và trung tâm:
                </p>

                <div className="overflow-x-auto my-4">
                    <table className="w-full text-left text-xs border border-[var(--color-border)] rounded-xl overflow-hidden">
                        <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                            <tr>
                                <th className="p-3 font-bold text-[var(--color-text)]">Thời điểm báo hủy</th>
                                <th className="p-3 font-bold text-[var(--color-text)]">Mức phí hoàn lại</th>
                                <th className="p-3 font-bold text-[var(--color-text)]">Thời gian xử lý</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)] bg-[var(--color-background)]">
                            <tr>
                                <td className="p-3 font-medium">Báo trước ngày khai giảng ≥ 05 ngày</td>
                                <td className="p-3 font-bold text-green-600">Hoàn 100% học phí đã đóng</td>
                                <td className="p-3 text-[var(--color-text-secondary)]">03 - 05 ngày làm việc</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">Báo trước ngày khai giảng từ 02 - 04 ngày</td>
                                <td className="p-3 font-bold text-orange-600">Hoàn 70% (Trừ chi phí chuẩn bị NVL)</td>
                                <td className="p-3 text-[var(--color-text-secondary)]">03 - 05 ngày làm việc</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">Báo trước ngày khai giảng &lt; 24 giờ</td>
                                <td className="p-3 font-bold text-amber-600">Không hoàn cọc (Chuyển sang bảo lưu 06 tháng)</td>
                                <td className="p-3 text-[var(--color-text-secondary)]">Kích hoạt bảo lưu ngay</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">Sau khi khóa học đã bắt đầu</td>
                                <td className="p-3 font-bold text-red-600">Không áp dụng hoàn phí</td>
                                <td className="p-3 text-[var(--color-text-secondary)]">-</td>
                            </tr>
                            <tr>
                                <td className="p-3 font-medium">Trung tâm hủy lớp vì lý do bất khả kháng</td>
                                <td className="p-3 font-bold text-green-600">Hoàn 100% học phí + Voucher 10%</td>
                                <td className="p-3 text-[var(--color-text-secondary)]">Trong vòng 24 giờ</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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
            <section id="quy-trinh-thanh-toan">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">06</span>
                    Quy trình thanh toán & Xác thực an toàn
                </h2>
                <p>
                    Để đảm bảo quyền lợi và tính minh bạch tài chính, quy trình thanh toán học phí tại DuaxCar Kitchen được thực hiện theo các bước chuẩn hóa sau:
                </p>
                
                <div className="space-y-3 my-4">
                    <div className="p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-xs space-y-1.5">
                        <div className="font-bold text-[var(--color-text)] flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                            Nhận thông tin thanh toán chính thức
                        </div>
                        <p className="text-[var(--color-text-secondary)] pl-7 mb-0 leading-relaxed">
                            Học viên sẽ nhận thông tin tài khoản ngân hàng chính thức kèm Mã hồ sơ học viên định danh qua tin nhắn SMS / Email từ tổng đài DuaxCar Kitchen hoặc trực tiếp từ chuyên viên tư vấn phụ trách.
                        </p>
                    </div>

                    <div className="p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-xs space-y-1.5">
                        <div className="font-bold text-[var(--color-text)] flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                            Cú pháp chuyển khoản chuẩn
                        </div>
                        <p className="text-[var(--color-text-secondary)] pl-7 mb-0 leading-relaxed">
                            Khi chuyển khoản, học viên vui lòng ghi đúng cú pháp: <span className="font-mono font-semibold text-[var(--color-primary)]">[Họ Tên] + [Số Điện Thoại] + [Tên Khóa Học]</span> để hệ thống kế toán tự động đối soát nhanh chóng.
                        </p>
                    </div>

                    <div className="p-4 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl text-xs space-y-1.5">
                        <div className="font-bold text-[var(--color-text)] flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                            Nhận Giấy báo nhập học & Biên lai điện tử
                        </div>
                        <p className="text-[var(--color-text-secondary)] pl-7 mb-0 leading-relaxed">
                            Sau khi hoàn tất thanh toán, bộ phận kế toán sẽ kích hoạt mã khóa học và gửi Phiếu thu / Giấy báo nhập học điện tử về số điện thoại và email của học viên trong vòng 30 phút làm việc.
                        </p>
                    </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] text-[var(--color-text)] flex items-start gap-2.5 my-3 shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <strong>Cảnh báo an toàn:</strong> DuaxCar Kitchen không thu học phí qua bất kỳ tài khoản cá nhân không được ủy quyền chính thức. Học viên chỉ chuyển khoản theo hướng dẫn trực tiếp từ kênh liên lạc chính thức của trung tâm.
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
                    Hiệu lực thi hành: Áp dụng trên toàn hệ thống từ 01/01/2026
                </div>
            </div>
        </PolicyLayout>
    );
}
