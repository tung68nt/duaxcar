export interface PolicyData {
    id: "bao-mat" | "dieu-khoan" | "thanh-toan";
    title: string;
    subtitle: string;
    badge: string;
    lastUpdated: string;
    content: string; // Rich HTML
}

export const defaultPolicies: PolicyData[] = [
    {
        id: "bao-mat",
        title: "Chính Sách Bảo Mật Thông Tin",
        subtitle: "Học viện Ẩm thực DuaxCar Kitchen cam kết bảo vệ tuyệt đối quyền riêng tư và dữ liệu cá nhân của học viên, khách hàng theo Nghị định 13/2023/NĐ-CP của Chính phủ.",
        badge: "Bảo Mật & Quyền Riêng Tư",
        lastUpdated: "18/08/2026",
        content: `
<h2>1. Mục đích thu thập thông tin cá nhân</h2>
<p>DuaxCar Kitchen thu thập thông tin của học viên và khách hàng nhằm các mục đích minh bạch sau:</p>
<ul>
    <li>Tư vấn, xếp lịch học và hỗ trợ đăng ký các khóa đào tạo nấu ăn thực chiến hoặc E-learning.</li>
    <li>Gửi tài liệu học tập, công thức cập nhật và thông báo lịch học, lịch khai giảng định kỳ.</li>
    <li>Hỗ trợ xuất hóa đơn điện tử (VAT), hoàn tất thủ tục cấp chứng chỉ hoặc giấy chứng nhận tốt nghiệp.</li>
    <li>Khảo sát chất lượng đào tạo và hỗ trợ học viên giải đáp thắc mắc sau khi hoàn thành khóa học.</li>
</ul>

<h2>2. Phạm vi và loại thông tin thu thập</h2>
<p>Các thông tin chúng tôi thu thập bao gồm:</p>
<ul>
    <li><strong>Thông tin liên hệ cơ bản:</strong> Họ và tên, số điện thoại liên lạc, địa chỉ email, khu vực sinh sống hoặc địa điểm dự kiến mở quán.</li>
    <li><strong>Thông tin đăng ký học tập:</strong> Khóa học quan tâm, mục tiêu học (mở quán kinh doanh, nâng cao tay nghề, hoặc nấu gia đình), khung giờ học mong muốn.</li>
    <li><strong>Thông tin giao dịch:</strong> Lịch sử thanh toán học phí, thông tin xuất hóa đơn doanh nghiệp (nếu có yêu cầu).</li>
</ul>

<h2>3. Thời gian lưu trữ thông tin</h2>
<p>Dữ liệu cá nhân của học viên sẽ được lưu trữ an toàn trong hệ thống của DuaxCar Kitchen cho đến khi có yêu cầu hủy bỏ từ chính học viên. Trong mọi trường hợp khác, thông tin sẽ được bảo lưu bảo mật để phục vụ quyền lợi bảo lưu khóa học và hỗ trợ kỹ thuật trọn đời.</p>

<h2>4. Cam kết không chia sẻ dữ liệu cho bên thứ ba</h2>
<p>Chúng tôi cam kết tuyệt đối <strong>không bán, cho thuê, chia sẻ hoặc tiết lộ</strong> thông tin cá nhân của học viên cho bất kỳ bên thứ ba nào vì mục đích thương mại hoặc quảng cáo ngoài hệ sinh thái DuaxCar Kitchen.</p>

<h2>5. Quyền của học viên đối với dữ liệu cá nhân</h2>
<p>Học viên có toàn quyền yêu cầu kiểm tra, cập nhật, điều chỉnh hoặc yêu cầu xóa bỏ thông tin cá nhân của mình trong hệ thống bất kỳ lúc nào bằng cách liên hệ với bộ phận CSKH qua Hotline <strong>0963.896.791</strong> hoặc gửi email về <strong>contact@duaxcar.vn</strong>.</p>
        `.trim()
    },
    {
        id: "dieu-khoan",
        title: "Điều Khoản Dịch Vụ & Quy Chế Đào Tạo",
        subtitle: "Quy chế đào tạo, quyền sở hữu trí tuệ công thức ẩm thực, nội quy học tập và quyền lợi học viên tại DuaxCar Kitchen Academy.",
        badge: "Quy Chế Đào Tạo & Bản Quyền",
        lastUpdated: "18/08/2026",
        content: `
<h2>1. Phạm vi áp dụng & Chấp thuận điều khoản</h2>
<p>Khi đăng ký tham gia bất kỳ khóa học nào tại DuaxCar Kitchen (trực tiếp hoặc trực tuyến), học viên đồng ý tuân thủ toàn bộ các quy chế đào tạo, nội quy bếp và chính sách bảo vệ thương hiệu của trung tâm.</p>

<h2>2. Quy chế tuyển sinh & Tổ chức lớp học</h2>
<ul>
    <li>Mỗi lớp học thực hành trực tiếp chỉ nhận tối đa <strong>6 - 8 học viên</strong> nhằm đảm bảo mỗi học viên đều được giảng viên kèm cặp trực tiếp từng bước.</li>
    <li>Học viên cần có mặt đúng giờ theo lịch đã đăng ký. Trong trường hợp nghỉ đột xuất, cần thông báo trước cho ban quản trị lớp để được sắp xếp buổi học bù phù hợp.</li>
    <li>Trung tâm cung cấp 100% nguyên vật liệu tươi ngon chuẩn kinh doanh, trang thiết bị bếp chuyên dụng và giáo trình độc quyền.</li>
</ul>

<h2>3. Quyền sở hữu trí tuệ công thức & Giáo trình</h2>
<ul>
    <li><strong>Quyền của học viên:</strong> Học viên có toàn quyền sử dụng kiến thức, công thức và kỹ năng đã học để mở quán ăn, phát triển chuỗi nhà hàng hoặc phục vụ gia đình không giới hạn.</li>
    <li><strong>Hành vi nghiêm cấm:</strong> Nghiêm cấm mọi hành vi sao chép giáo trình, quay lén video bài giảng, bán lại khóa học, hoặc mở lớp dạy lại nguyên bản công thức độc quyền của DuaxCar Kitchen dưới mọi hình thức thương mại khi chưa có văn bản đồng ý.</li>
</ul>

<h2>4. Nội quy thực hành & An toàn vệ sinh thực phẩm</h2>
<ul>
    <li>Tuân thủ nghiêm ngặt quy định về vệ sinh an toàn thực phẩm, đồng phục bảo hộ lao động và an toàn phòng cháy chữa cháy trong khu vực bếp thực hành.</li>
    <li>Bảo quản cẩn thận dụng cụ và thiết bị máy móc đào tạo theo hướng dẫn của giảng viên và trợ giảng.</li>
</ul>
        `.trim()
    },
    {
        id: "thanh-toan",
        title: "Chính Sách Thanh Toán & Hoàn Phí",
        subtitle: "Quy định minh bạch về thanh toán học phí, đặt cọc giữ chỗ lớp thực hành, chính sách bảo lưu và cam kết hoàn phí tại DuaxCar Kitchen.",
        badge: "Thanh Toán & Hoàn Phí",
        lastUpdated: "18/08/2026",
        content: `
<h2>1. Phương thức thanh toán được chấp nhận</h2>
<p>DuaxCar Kitchen hỗ trợ đa dạng phương thức thanh toán thuận tiện và an toàn:</p>
<ul>
    <li><strong>Chuyển khoản Ngân hàng (QR Code 24/7):</strong> Chuyển khoản nhanh qua Internet Banking của tất cả ngân hàng tại Việt Nam.</li>
    <li><strong>Thanh toán trực tiếp:</strong> Tiền mặt hoặc quẹt thẻ POS (Visa, Master, JCB, Napas) tại văn phòng tuyển sinh của trung tâm.</li>
</ul>

<h2>2. Quy trình đặt cọc & Xác nhận giữ chỗ</h2>
<ul>
    <li><strong>Mức phí đặt cọc:</strong> Tối thiểu <strong>30% - 50%</strong> tổng học phí của khóa học để trung tâm chuẩn bị nguyên vật liệu và xếp lịch giảng viên.</li>
    <li><strong>Thời hạn hoàn tất học phí:</strong> Học viên thanh toán phần học phí còn lại vào ngày đầu tiên khai giảng khóa học trước khi bước vào giờ thực hành.</li>
    <li><strong>Xác nhận nhập học:</strong> Ngay sau khi nhận tiền cọc, DuaxCar Kitchen sẽ gửi Giấy báo nhập học và mã lớp qua Email & SMS cho học viên.</li>
</ul>

<h2>3. Quy chế bảo lưu & Chuyển đổi khóa học</h2>
<ul>
    <li><strong>Quyền bảo lưu:</strong> Học viên được bảo lưu toàn bộ học phí đã đóng trong thời hạn <strong>tối đa 06 tháng</strong> kể từ ngày đăng ký.</li>
    <li><strong>Chuyển đổi khóa học:</strong> Được phép chuyển sang khóa học khác hoặc đổi ca học hoàn toàn miễn phí nếu thông báo trước ngày khai giảng tối thiểu <strong>03 ngày</strong>.</li>
    <li><strong>Chuyển nhượng suất học:</strong> Học viên được quyền chuyển nhượng suất học của mình cho bạn bè hoặc người thân.</li>
</ul>

<h2>4. Chính sách hoàn phí & Điều kiện áp dụng</h2>
<ul>
    <li><strong>Báo hủy trước ngày khai giảng ≥ 05 ngày:</strong> Hoàn lại <strong>100%</strong> học phí đã đóng.</li>
    <li><strong>Báo hủy trước ngày khai giảng từ 02 - 04 ngày:</strong> Hoàn lại <strong>70%</strong> học phí (trừ chi phí chuẩn bị nguyên vật liệu tươi).</li>
    <li><strong>Báo hủy trước ngày khai giảng &lt; 24 giờ:</strong> Không hoàn cọc, tự động kích hoạt chế độ bảo lưu 06 tháng.</li>
    <li><strong>Trung tâm hủy lớp vì lý do bất khả kháng:</strong> Hoàn <strong>100%</strong> học phí trong vòng 24 giờ kèm voucher ưu đãi 10%.</li>
</ul>

<h2>5. Xuất hóa đơn tài chính (VAT) & Biên nhận</h2>
<p>DuaxCar Kitchen hỗ trợ xuất Hóa Đơn Điện Tử (VAT) cho các doanh nghiệp, công ty, nhà hàng hoặc hộ kinh doanh cá thể có nhu cầu hạch toán chi phí đào tạo nhân sự trong vòng 01 - 03 ngày làm việc.</p>
        `.trim()
    }
];
