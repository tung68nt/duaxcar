import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, email, course, message } = body;

        // Basic validation
        if (!name || !phone) {
            return NextResponse.json(
                { error: 'Họ tên và số điện thoại là thông tin bắt buộc.' },
                { status: 400 }
            );
        }

        const scriptUrl = process.env.GOOGLE_SHEETS_SCRIPT_URL;

        const createdAt = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        // Fallback for development / testing when env is not set
        if (!scriptUrl || scriptUrl.includes('YOUR_APPS_SCRIPT_WEB_APP_ID')) {
            console.log('================ CONTACT FORM SUBMISSION (FALLBACK LOG) ================');
            console.log(`Thời gian: ${createdAt}`);
            console.log(`Họ tên: ${name}`);
            console.log(`Số điện thoại: ${phone}`);
            console.log(`Email: ${email || 'N/A'}`);
            console.log(`Khóa học quan tâm: ${course || 'Chưa chọn'}`);
            console.log(`Nội dung: ${message || 'N/A'}`);
            console.log('======================================================================');
            console.warn('LƯU Ý: Biến môi trường GOOGLE_SHEETS_SCRIPT_URL chưa được cấu hình. Dữ liệu tạm thời chỉ ghi log ra console.');
            
            return NextResponse.json({
                success: true,
                message: 'Gửi thành công! (Dữ liệu ghi log tại console do chưa cấu hình Google Sheet)',
            });
        }

        // Send request to Google Apps Script
        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                phone,
                email,
                course,
                message,
                createdAt,
            }),
        });

        if (!response.ok) {
            throw new Error(`Google Apps Script trả về status: ${response.status}`);
        }

        const result = await response.json();
        if (result.result !== 'success') {
            throw new Error(result.error || 'Google Apps Script báo lỗi xử lý');
        }

        return NextResponse.json({
            success: true,
            message: 'Thông tin của bạn đã được gửi thành công!',
        });
    } catch (error: any) {
        console.error('Error in /api/contact:', error);
        return NextResponse.json(
            { error: error.message || 'Đã xảy ra lỗi hệ thống khi gửi thông tin.' },
            { status: 500 }
        );
    }
}
