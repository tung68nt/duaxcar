import React from "react";
import { Metadata } from "next";
import { PolicyLayout } from "@/components/legal/PolicyLayout";
import { FileText, BookOpen, AlertTriangle, ShieldCheck, Scale, Award, UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
    title: "Điều Khoản Sử Dụng Dịch Vụ & Đào Tạo | DuaxCar Kitchen",
    description: "Quy chế đào tạo, quyền sở hữu trí tuệ công thức ẩm thực, nội quy học tập và quyền lợi học viên tại DuaxCar Kitchen Academy.",
};

const toc = [
    { id: "chap-thuan", title: "Phạm vi áp dụng & Chấp thuận điều khoản" },
    { id: "quy-che-dao-tao", title: "Quy chế tuyển sinh & Tổ chức lớp học" },
    { id: "so-huu-tri-tue", title: "Quyền sở hữu trí tuệ công thức & Giáo trình" },
    { id: "noi-quy-bep", title: "Nội quy thực hành & An toàn thực phẩm" },
    { id: "bao-hanh-cong-thuc", title: "Chính sách bảo hành công thức & Cố vấn mở quán" },
    { id: "gioi-han-trach-nhiem", title: "Quyền hạn & Giới hạn trách nhiệm pháp lý" },
    { id: "giai-quyet-tranh-chap", title: "Luật áp dụng & Giải quyết khiếu nại" },
];

export default function TermsOfServicePage() {
    return (
        <PolicyLayout
            title="Điều Khoản Sử Dụng Dịch Vụ"
            subtitle="Quy chế đào tạo, quyền sở hữu trí tuệ công thức ẩm thực, quyền và trách nhiệm của học viên khi tham gia các khóa học tại DuaxCar Kitchen Academy."
            badge="Quy Chế Đào Tạo & Bản Quyền"
            icon={<FileText className="w-4 h-4" />}
            lastUpdated="18/08/2026"
            toc={toc}
        >
            {/* Lead Intro Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs sm:text-small shadow-sm">
                <div className="flex items-center gap-2 font-bold text-[var(--color-primary)] text-sm mb-1.5">
                    <Scale className="w-4 h-4" />
                    <span>Thỏa thuận đào tạo & Quy chế học viên</span>
                </div>
                <p className="text-[var(--color-text)] mb-0">
                    Khi đăng ký tham gia bất kỳ khóa đào tạo (trực tiếp tại xưởng hoặc qua hệ thống E-learning trực tuyến) của DuaxCar Kitchen, học viên được xem là đã đọc, thấu hiểu và đồng thuận với toàn bộ các điều khoản và quy chế đào tạo dưới đây.
                </p>
            </div>

            {/* Section 1 */}
            <section id="chap-thuan">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">01</span>
                    Phạm vi áp dụng & Chấp thuận điều khoản
                </h2>
                <p>
                    Văn bản này quy định mối quan hệ pháp lý và thỏa thuận dịch vụ giữa:
                </p>
                <ul>
                    <li><strong>Đơn vị đào tạo:</strong> Học viện Ẩm thực DuaxCar Kitchen (thuộc sở hữu và vận hành bởi DuaxCar Vietnam).</li>
                    <li><strong>Học viên / Khách hàng:</strong> Mọi cá nhân, chủ hộ kinh doanh, đại diện doanh nghiệp F&B tham gia các khóa học nấu ăn, tư vấn set up menu và chuyển giao công nghệ bếp.</li>
                </ul>
                <p>
                    Điều khoản có giá trị ràng buộc kể từ thời điểm học viên hoàn tất thủ tục đăng ký hoặc thanh toán đặt cọc khóa học.
                </p>
            </section>

            {/* Section 2 */}
            <section id="quy-che-dao-tao">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">02</span>
                    Quy chế tuyển sinh & Tổ chức lớp học
                </h2>
                <p>
                    DuaxCar Kitchen cam kết chất lượng đào tạo thông qua các nguyên tắc chuẩn mực sau:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 my-4">
                    <div className="p-3.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl">
                        <div className="flex items-center gap-2 font-semibold text-[var(--color-text)] text-xs mb-1">
                            <UtensilsCrossed className="w-4 h-4 text-[var(--color-primary)]" />
                            <span>Mô hình đào tạo trực tiếp</span>
                        </div>
                        <ul className="text-[11px] text-[var(--color-text-secondary)] mb-0 space-y-1">
                            <li>Thực hành 100% tại xưởng bếp chuyên nghiệp.</li>
                            <li>Giới hạn sĩ số tối đa 6-8 học viên/lớp để giảng viên kèm sát từng thao tác.</li>
                            <li>Bao trọn gói nguyên vật liệu tươi ngon chuẩn kinh doanh trong suốt khóa học.</li>
                        </ul>
                    </div>

                    <div className="p-3.5 bg-[var(--color-background)] border border-[var(--color-border)] rounded-xl">
                        <div className="flex items-center gap-2 font-semibold text-[var(--color-text)] text-xs mb-1">
                            <BookOpen className="w-4 h-4 text-[var(--color-primary)]" />
                            <span>Khóa học Online (E-learning)</span>
                        </div>
                        <ul className="text-[11px] text-[var(--color-text-secondary)] mb-0 space-y-1">
                            <li>Video bài giảng 4K quay góc nhìn thứ nhất (First-person).</li>
                            <li>Giáo trình định lượng gam điện tử tải về vĩnh viễn.</li>
                            <li>Hỗ trợ giải đáp 1:1 cùng Bếp trưởng qua nhóm Zalo riêng.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Section 3 */}
            <section id="so-huu-tri-tue">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">03</span>
                    Quyền sở hữu trí tuệ công thức & Giáo trình
                </h2>
                <p>
                    Tất cả các tài liệu đào tạo, video bài giảng, công thức định lượng gia vị độc quyền, phương pháp ninh nước dùng và tài liệu set up menu do DuaxCar Kitchen cung cấp đều thuộc quyền sở hữu trí tuệ của DuaxCar:
                </p>
                <ul>
                    <li><strong>Quyền của học viên:</strong> Học viên có toàn quyền sử dụng công thức đã học để mở quán, phát triển kinh doanh chuỗi nhà hàng hoặc nấu phục vụ gia đình không giới hạn.</li>
                    <li><strong>Hành vi nghiêm cấm:</strong> Nghiêm cấm mọi hành vi sao chép giáo trình, quay lén video bài giảng, bán lại khóa học, hoặc mở lớp dạy lại nguyên bản công thức của DuaxCar Kitchen dưới mọi hình thức thương mại khi chưa có sự đồng ý bằng văn bản.</li>
                </ul>
                <div className="p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] text-[var(--color-text)] flex items-start gap-2.5 my-3 shadow-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <strong>Xử lý vi phạm:</strong> Mọi hành vi sao chép giáo trình, quay lén bài giảng hoặc phát tán công thức độc quyền vì mục đích thương mại sẽ bị đình chỉ khóa học ngay lập tức và chuyển hồ sơ cho cơ quan chức năng xử lý theo Luật Sở hữu trí tuệ.
                    </div>
                </div>
            </section>

            {/* Section 4 */}
            <section id="noi-quy-bep">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">04</span>
                    Nội quy thực hành & An toàn thực phẩm
                </h2>
                <p>
                    Để đảm bảo môi trường học tập chuyên nghiệp và an toàn tuyệt đối, học viên tham gia lớp thực hành trực tiếp cam kết:
                </p>
                <ol>
                    <li>Mặc trang phục bếp chỉnh tề (tạp dề, mũ bếp, giày chống trượt) do học viện cấp trong suốt buổi học.</li>
                    <li>Tuyệt đối tuân thủ quy tắc <strong>An Toàn Vệ Sinh Thực Phẩm (ATVSTP)</strong> và phòng chống cháy nổ trong khu vực bếp nấu công nghiệp.</li>
                    <li>Tuân theo mọi chỉ dẫn an toàn dao kéo, thiết bị nhiệt và nồi hầm áp suất từ Giảng viên hướng dẫn.</li>
                    <li>Bảo quản thiết bị, máy móc và dụng cụ thực hành được giao.</li>
                </ol>
            </section>

            {/* Section 5 */}
            <section id="bao-hanh-cong-thuc">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">05</span>
                    Chính sách bảo hành công thức & Cố vấn mở quán
                </h2>
                <p>
                    DuaxCar Kitchen tự hào là đơn vị duy nhất cam kết <strong>Bảo Hành Công Thức Trọn Đời</strong> cho toàn bộ học viên:
                </p>
                <ul>
                    <li><strong>Học lại miễn phí:</strong> Nếu sau khóa học học viên chưa tự tin làm ra vị chuẩn kinh doanh, được đăng ký tham gia lại lớp thực hành hoàn toàn miễn phí (chỉ cần đăng ký trước với bộ phận xếp lớp).</li>
                    <li><strong>Cố vấn nguyên vật liệu:</strong> Cung cấp danh sách nhà cung ứng thịt bò, xương ống, thảo mộc, gia vị chuẩn giá gốc tại các tỉnh thành trên toàn quốc.</li>
                    <li><strong>Hỗ trợ thẩm định mặt bằng & Tính giá vốn (Costing):</strong> Đội ngũ chuyên gia hỗ trợ thẩm định menu, tính cost chuẩn xác đảm bảo biên lợi nhuận tối ưu 60-70% khi mở bán.</li>
                </ul>
            </section>

            {/* Section 6 */}
            <section id="gioi-han-trach-nhiem">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">06</span>
                    Quyền hạn & Giới hạn trách nhiệm pháp lý
                </h2>
                <p>
                    DuaxCar Kitchen cam kết truyền thụ 100% kỹ thuật và bí quyết chuẩn mực nhất. Tuy nhiên, sự thành công trong kinh doanh mở quán còn phụ thuộc vào nhiều yếu tố khách quan (vị trí mặt bằng, kỹ năng quản lý nhân sự, chiến lược marketing, thị hiếu địa phương...). Do đó, DuaxCar Kitchen không chịu trách nhiệm tài chính về kết quả kinh doanh cá nhân của học viên.
                </p>
            </section>

            {/* Section 7 */}
            <section id="giai-quyet-tranh-chap">
                <h2>
                    <span className="w-6 h-6 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-mono">07</span>
                    Luật áp dụng & Giải quyết khiếu nại
                </h2>
                <p>
                    Điều khoản này được điều chỉnh và diễn giải theo quy định pháp luật của Nước Cộng hòa Xã hội Chủ nghĩa Việt Nam. Mọi bất đồng hoặc khiếu nại phát sinh sẽ được ưu tiên giải quyết qua thương lượng và hòa giải trên tinh thần thiện chí và tôn trọng quyền lợi học viên.
                </p>
            </section>

            {/* Verification Stamp Footer */}
            <div className="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                    <Award className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>Hội đồng Đào tạo <strong>DuaxCar Kitchen Academy</strong></span>
                </div>
                <div className="text-[var(--color-text-muted)] text-[11px]">
                    Mã văn bản: <code>TERMS-EDU-2026-V3.0</code>
                </div>
            </div>
        </PolicyLayout>
    );
}
