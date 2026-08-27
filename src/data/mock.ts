import {
    Course,
    Instructor,
    Testimonial,
    BlogPost,
    Stat,
    ContactInfo,
} from "@/lib/types";

// ============================================
// Site Configuration
// ============================================
export const siteConfig = {
    name: "DuaxCar Kitchen",
    tagline: "Trung tâm đào tạo ẩm thực chuyên nghiệp",
    description:
        "Đào tạo các món ăn Việt truyền thống và kỹ năng kinh doanh quán ăn thực tế. Nấu từ tâm, kinh doanh từ bền vững.",
};

// Navigation
export const navigation = [
    { label: "Trang chủ", href: "/" },
    { label: "Về DuaxCar", href: "/ve-duaxcar" },
    { label: "Khóa học Trực tiếp", href: "/khoa-hoc?type=onsite" },
    { label: "Khóa học Online", href: "/khoa-hoc?type=elearning" },
    { label: "Lịch khai giảng", href: "/lich-khai-giang" },
    { label: "Tin tức", href: "/tin-tuc" },
    { label: "FAQ", href: "/faq" },
    { label: "Liên hệ", href: "/lien-he" },
];

// ============================================
// Course Types
// ============================================
export const courseTypes = [
    {
        id: "onsite",
        name: "Khóa học Trực tiếp",
        description: "Học tại trung tâm với giảng viên, thực hành trực tiếp",
        icon: "🏫",
    },
    {
        id: "elearning",
        name: "Khóa học Online",
        description: "Học online mọi lúc mọi nơi, video bài giảng chất lượng cao",
        icon: "💻",
    },
];

// ============================================
// Course Categories with Images
// ============================================
export const courseCategories = [
    {
        id: "mon-an-sang",
        name: "Món ăn sáng",
        icon: "🍜",
        image: "/images/categories/category_breakfast_1767962922195.png",
    },
    {
        id: "mon-dong-que",
        name: "Món Đồng quê",
        icon: "🥘",
        image: "/images/categories/category_countryside_1767962937918.png",
    },
    {
        id: "mon-hai-san",
        name: "Món Hải sản",
        icon: "🦐",
        image: "/images/categories/category_seafood_1767962954756.png",
    },
    {
        id: "mon-nhau",
        name: "Món Nhậu",
        icon: "🍺",
        image: "/images/categories/category_nhau_1767962971288.png",
    },
    {
        id: "mon-com-tho",
        name: "Món Cơm thố",
        icon: "🍚",
        image: "/images/categories/category_claypot_1767963001577.png",
    },
    {
        id: "lau-nuong",
        name: "Lẩu + Nướng",
        icon: "🍲",
        image: "/images/categories/category_hotpot_1767963019417.png",
    },
    {
        id: "mon-cao-cap",
        name: "Món Cao cấp",
        icon: "✨",
        image: "/images/categories/category_premium_1767963034930.png",
    },
    {
        id: "mon-gia-dinh",
        name: "Món Gia đình",
        icon: "🏠",
        image: "/images/categories/category_family_1767963050450.png",
    },
];

// ============================================
// Instructors Data
// ============================================
export const instructors: Instructor[] = [
    {
        id: "nguyen-huu-tho",
        name: "Nguyễn Hữu Thọ",
        role: "Giảng viên Món Việt",
        title: "Đồng sáng lập Duaxcar Kitchen | Giám đốc Cốt Phở Thọ",
        image: "/images/instructors/nguyen-huu-tho-v3.jpg",
        bio: "Nghệ nhân ẩm thực Bún bò Huế, Giám đốc Cốt Phở Thọ với hơn 10 năm kinh nghiệm.",
        fullBio: `Nguyễn Hữu Thọ sinh ra tại Mỹ Đức, Hà Nội – nơi tuổi thơ của anh gắn liền với mùi riêu cua, tiếng chảo mỡ xèo xèo và những buổi theo mẹ ra chợ từ sáng sớm để chuẩn bị cho gánh bún, hàng phở. Chính những ký ức giản dị và sống động ấy đã âm thầm gieo vào anh tình yêu với bếp Việt, đặc biệt là món nước truyền thống.

Khởi đầu từ Trường Du lịch Hà Nội với chuyên ngành nấu ăn hệ trung cấp, Thọ bước chân vào bếp bằng cả sự đam mê và tinh thần học nghề nghiêm túc. Anh từng nấu ăn trong môi trường công trình như quân đội tại Lâm Đồng – nơi mọi thứ bắt đầu từ bếp củi, vạc lớn và kỷ luật thép. Chính những năm tháng ấy đã rèn cho anh tính tỉ mỉ, sức bền và sự chính xác trong từng thao tác làm bếp.

Sau đó, anh trải qua nhiều năm tích lũy kinh nghiệm tại các nhà hàng món Việt khắp miền Bắc – từ các quán đồng quê, đặc sản thú rừng đến nhà hàng thành thị. Vai trò bếp trưởng tại Mansion (Đào Tấn), Friendi (Nguyễn Chánh) giúp anh hoàn thiện tư duy tổ chức bếp, đào tạo đội nhóm và kiểm soát chất lượng món ăn ở quy mô lớn.

Năm 2019, Nguyễn Hữu Thọ được vinh danh là Nghệ nhân ẩm thực Bún bò Huế tại Lễ hội Bonsai Việt – Nhật do Tập đoàn Vingroup tổ chức. Đây là cột mốc đánh dấu hành trình nghiêm túc của anh với việc giữ gìn và nâng tầm món Việt truyền thống.

Không chỉ dừng lại ở gian bếp, anh sáng lập Công ty Cốt Phở Thọ, cung cấp nước dùng cô đặc chất lượng cao cho các mô hình phở, bún, lẩu trên toàn quốc – với mong muốn giúp hàng nghìn chủ quán tiết kiệm thời gian, ổn định hương vị và tối ưu vận hành.

Hiện là giảng viên chính tại Duaxcar Kitchen, Nguyễn Hữu Thọ trực tiếp đào tạo các lớp học phở, bún, món Việt chuẩn vị. Với anh, việc dạy nghề không đơn thuần là truyền công thức – mà là truyền lửa, truyền văn hóa, truyền tư duy làm nghề bền vững.`,
        quote: "Mùi phở, mùi bún riêu đã ở trong máu từ ngày còn nhỏ. Tôi không chọn nghề – nghề chọn tôi.",
        experience: "10+ NĂM",
        achievements: [
            "Nghệ nhân ẩm thực Bún bò Huế 2019 (Vingroup)",
            "Bếp trưởng Mansion, Friendi",
            "Giám đốc Công ty Cốt Phở Thọ",
        ],
        courses: [
            "Phở bò truyền thống & hiện đại",
            "Bún bò Huế chuẩn vị",
            "Món nước Việt Nam",
            "Tư duy vận hành quán ăn",
        ],
    },
    {
        id: "pham-van-long",
        name: "Phạm Văn Long",
        role: "Founder Duax Car Kitchen",
        title: "Cố vấn đào tạo & chiến lược vận hành",
        image: "/images/instructors/pham-van-long-v3.jpg",
        bio: "Đầu bếp tư duy kinh doanh, chuyên gia cố vấn mô hình quán ăn.",
        fullBio: `Phạm Văn Long là người sáng lập Duax Car Kitchen – nơi hội tụ những đầu bếp thực chiến, tâm huyết với ẩm thực Việt và mô hình đào tạo sát với thực tế kinh doanh.

Xuất thân là một đầu bếp, Long nhanh chóng nhận ra rằng để một quán ăn thành công không chỉ cần món ăn ngon mà còn cần tư duy vận hành đúng, chiến lược sản phẩm rõ ràng và khả năng quản lý chi phí hiệu quả. Từ trải nghiệm mở – vận hành nhiều mô hình quán ăn tại Hà Nội, anh đã đúc kết được quy trình giúp học viên rút ngắn thời gian khởi sự và giảm thiểu sai lầm khi bắt đầu.

Tại Duax Car Kitchen, anh không chỉ đứng sau các khóa học mà còn trực tiếp xây dựng lộ trình đào tạo, lựa chọn giảng viên, biên soạn giáo trình và cố vấn mô hình kinh doanh cho từng học viên sau khóa học.

Với tư duy đổi mới, thực tế và luôn đặt học viên làm trung tâm, Phạm Văn Long là người đứng sau sự phát triển bền vững và định hướng chiến lược dài hạn cho Duax Car Kitchen.`,
        quote: "Một người đầu bếp giỏi là người nấu được món ngon. Nhưng một người dạy nghề tốt – là người giúp người khác sống được với nghề.",
        experience: "15+ NĂM",
        achievements: [
            "Sáng lập & điều hành Duax Car Kitchen",
            "Cố vấn mô hình kinh doanh quán ăn",
            "Thiết kế chương trình đào tạo món Việt",
            "Đồng hành tư vấn vận hành",
        ],
        courses: [
            "Cố vấn mô hình kinh doanh quán ăn",
            "Thiết kế thực đơn theo thị trường",
            "Tư duy vận hành F&B",
        ],
    },
    {
        id: "luu-duc-toan",
        name: "Lưu Đức Toàn",
        role: "Chuyên gia ẩm thực món Việt",
        title: "Giảng viên giàu kinh nghiệm | Nghệ nhân Bàn tay vàng",
        image: "/images/instructors/luu-duc-toan-v3.jpg",
        bio: "Nghệ nhân ẩm thực 'Bàn tay vàng' 2024, hơn 25 năm kinh nghiệm thực chiến.",
        fullBio: `Với hơn 25 năm gắn bó trong ngành bếp chuyên nghiệp, Lưu Đức Toàn là một trong những giảng viên giàu kinh nghiệm, đặc biệt trong việc chế biến các món ăn truyền thống Việt Nam.

Trong suốt sự nghiệp, anh từng đảm nhận các vị trí đầu bếp quan trọng tại nhiều nhà hàng và khách sạn lớn:
- 5 năm tại Unilever Knorr, phụ trách phát triển công thức và kiểm định chất lượng món ăn.
- 9 năm tại Long Vĩ Palace, nhà hàng tiệc cưới & hội nghị cao cấp tại Hà Nội.
- 3 năm tại Khách sạn Thương mại, môi trường yêu cầu cao về kỹ thuật và chuẩn vị.

Bên cạnh công việc thực chiến trong nhà hàng – khách sạn, anh còn là giảng viên giảng dạy tại các trung tâm đào tạo nghề, truyền đạt kỹ năng và tư duy nấu món Việt cho nhiều thế hệ học viên.

Điểm mạnh chuyên môn: chế biến các món Việt truyền thống, ứng dụng nguyên liệu thực tế, tối ưu hương vị và quy trình vận hành bếp cho mô hình quán ăn vừa & nhỏ.

Năm 2024 được ban văn phòng chính phủ trao tặng bằng Nghệ nhân ẩm thực bàn tay vàng.`,
        quote: "Nghề bếp không chỉ cần tay nghề – mà cần tâm và bản lĩnh.",
        experience: "25+ NĂM",
        achievements: [
            "Nghệ nhân ẩm thực \"Bàn tay vàng\" 2024",
            "5 năm tại Unilever Knorr",
            "Bếp trưởng Long Vĩ Palace (9 năm)",
        ],
        courses: ["Phở bò gia truyền", "Bún riêu cua đồng", "Các món đồng quê"],
    },
];

// ============================================
// Courses Data - With Type (Onsite / E-learning)
// ============================================
export const courses: Course[] = [
    // ========== ONSITE COURSES ==========
    {
        id: "pho-bo-truyen-thong",
        slug: "pho-bo-truyen-thong",
        name: "Phở Bò Truyền Thống",
        category: "mon-an-sang",
        courseType: "onsite",
        description:
            "Khóa học đào tạo chuyên sâu về phở bò chuẩn vị Hà Nội. Từ cách chọn xương, ninh nước dùng đến kỹ thuật thái thịt, trần bánh phở hoàn hảo.",
        shortDescription: "Học cách nấu phở bò chuẩn vị Hà Nội từ A-Z",
        price: 5000000,
        duration: "2 ngày (16 giờ)",
        maxStudents: 8,
        instructor: "Nguyễn Hữu Thọ",
        instructorId: "nguyen-huu-tho",
        image: "/images/courses/pho-bo.jpg",
        featured: true,
        highlights: [
            "Bí quyết ninh nước dùng trong vắt, thơm ngọt",
            "Kỹ thuật chọn và sơ chế nguyên liệu chuẩn",
            "Công thức gia vị độc quyền",
            "Tư vấn mô hình kinh doanh quán phở",
        ],
        curriculum: [
            {
                title: "Lịch sử và văn hóa Phở",
                description: "Tìm hiểu về nguồn gốc, lịch sử phát triển và ý nghĩa văn hóa của món Phở Việt Nam."
            },
            {
                title: "Chọn lựa và sơ chế nguyên liệu",
                description: "Kỹ thuật chọn thịt bò, xương bò tươi ngon. Sơ chế và khử mùi xương đúng cách."
            },
            {
                title: "Gia vị và hương liệu độc quyền",
                description: "Bí quyết phối trộn quế, hồi, thảo quả... để tạo nên hương vị phở truyền thống đặc trưng."
            },
            {
                title: "Kỹ thuật ninh nước dùng trong - ngọt",
                description: "Quy trình ninh xương, kiểm soát lửa và nhiệt độ để nước dùng trong, ngọt tự nhiên."
            },
            {
                title: "Kỹ thuật thái thịt và chần phở",
                description: "Thái thịt bò tái, chín đẹp mắt. Kỹ thuật chần bánh phở giữ được độ dai ngon."
            },
            {
                title: "Trình bày và phục vụ",
                description: "Cách trình bày tô phở đẹp mắt, chuẩn nhà hàng và quy trình phục vụ chuyên nghiệp."
            }
        ],
        onlineUrl: "https://academy.duaxcar.com/courses/pho-bo-online",
    },
    {
        id: "bun-bo-hue",
        slug: "bun-bo-hue",
        name: "Bún Bò Huế Chuẩn Vị",
        category: "mon-an-sang",
        courseType: "onsite",
        description:
            "Khóa học bún bò Huế từ nghệ nhân ẩm thực. Học cách nấu nước dùng đậm đà, chuẩn vị miền Trung.",
        shortDescription: "Bí quyết nấu bún bò Huế đậm đà chuẩn vị Cố Đô",
        price: 4500000,
        duration: "2 ngày (14 giờ)",
        maxStudents: 8,
        instructor: "Nguyễn Hữu Thọ",
        instructorId: "nguyen-huu-tho",
        image: "/images/courses/bun-bo-hue.jpg",
        highlights: [
            "Bí quyết sa tế ớt Huế",
            "Công thức tỷ lệ mắm ruốc chuẩn",
            "Kỹ thuật làm chả cua",
            "Tư vấn setup quán bún bò",
        ],
        curriculum: [
            {
                title: "Tổng quan về Bún Bò Huế",
                description: "Đặc trưng hương vị và sự khác biệt của Bún Bò Huế so với các món nước khác."
            },
            {
                title: "Sơ chế chân giò và xương",
                description: "Cách làm sạch, rút xương chân giò và xử lý xương bò để nước dùng thơm ngon."
            },
            {
                title: "Xử lý mắm ruốc và gia vị",
                description: "Kỹ thuật nấu mắm ruốc không bị hôi, tạo vị đậm đà đặc trưng cho nước dùng."
            },
            {
                title: "Cách làm sa tế và chả cua",
                description: "Công thức sa tế cay thơm và cách quết chả cua dai ngon, không bị bở."
            },
            {
                title: "Nấu nước lèo và nêm nếm",
                description: "Quy trình nấu nước lèo, định lượng gia vị chuẩn để kinh doanh."
            }
        ],
        featured: true,
        onlineUrl: "https://academy.duaxcar.com/courses/bun-bo-hue-online",
    },
    {
        id: "pho-ga",
        slug: "pho-ga",
        name: "Phở Gà Truyền Thống",
        category: "mon-an-sang",
        courseType: "onsite",
        description:
            "Chuyên đề Phở Gà truyền thống Hà Nội. Kỹ thuật luộc gà da giòn, thịt dai và nước dùng thanh ngọt.",
        shortDescription: "Nghệ thuật nấu Phở Gà Hà Nội thanh tao",
        price: 3500000,
        duration: "1.5 ngày (12 giờ)",
        maxStudents: 10,
        instructor: "Phạm Tuấn Hải",
        instructorId: "pham-tuan-hai",
        image: "/images/courses/pho-ga.png",
        highlights: [
            "Kỹ thuật luộc gà da giòn",
            "Lọc xương gà siêu tốc",
            "Nấu nước dùng gà trong veo",
            "Tận dụng phụ phẩm gà",
        ],
        curriculum: [
            {
                title: "Chọn gà và sơ chế",
                description: "Cách chọn gà ta ngon, sơ chế sạch và khử mùi hôi của gà."
            },
            {
                title: "Kỹ thuật luộc gà",
                description: "Bí quyết luộc gà da giòn, vàng óng, thịt chín tới không bị nát."
            },
            {
                title: "Lọc tách xương và thịt",
                description: "Kỹ thuật lọc xương gà nhanh, giữ nguyên hình dáng miếng thịt."
            },
            {
                title: "Chế biến nước dùng gà",
                description: "Sử dụng xương gà và gia vị để nấu nước dùng thanh ngọt, không bị đục."
            },
            {
                title: "Các món biến tấu",
                description: "Làm phở gà trộn, miến gà và cách làm nước sốt trộn đặc biệt."
            }
        ],
        featured: true,
        onlineUrl: "https://academy.duaxcar.com/courses/pho-ga-online",
    },
    {
        id: "lau-nuong",
        slug: "lau-nuong",
        name: "Lẩu Nướng Trọn Gói",
        category: "lau-nuong",
        courseType: "onsite",
        description:
            "Combo khóa học Lẩu và Nướng theo mô hình kinh doanh buffet hoặc gọi món. Hơn 20 loại sốt ướp và nước lẩu.",
        shortDescription: "Khởi nghiệp quán Lẩu Nướng với trọn bộ công thức hot",
        price: 5500000,
        duration: "2 ngày (16 giờ)",
        maxStudents: 15,
        instructor: "Christine Hà",
        instructorId: "christine-ha",
        image: "/images/courses/lau-nuong.jpg",
        highlights: [
            "20+ công thức sốt ướp thịt",
            "10 loại nước lẩu Á - Âu",
            "Kỹ thuật cắt thái decor",
            "Quản lý cost món ăn",
        ],
        curriculum: [
            {
                title: "Tổng quan mô hình Lẩu Nướng",
                description: "Phân tích thị trường, lựa chọn mô hình kinh doanh phù hợp (Buffet/Alacarte)."
            },
            {
                title: "Các loại sốt ướp thịt nướng",
                description: "Thực hành sốt BBQ, sốt tiêu đen, sốt Bulgogi, sốt sa tế..."
            },
            {
                title: "Các loại nước sốt chấm",
                description: "Pha chế nước chấm me, sốt chấm xanh hải sản, sốt trứng muối..."
            },
            {
                title: "Chế biến các loại nước lẩu",
                description: "Nấu nước cốt lẩu Thái, lẩu nấm, lẩu Tứ Xuyên, lẩu riêu cua."
            },
            {
                title: "Setup quầy line và decor",
                description: "Cách sắp xếp quầy buffet đẹp mắt, hấp dẫn và tối ưu vận hành."
            }
        ],
        featured: true,
    },
    {
        id: "mon-dong-que",
        slug: "mon-dong-que",
        name: "Món Đồng Quê Thực Chiến",
        category: "mon-dong-que",
        courseType: "onsite",
        description:
            "Các món ăn dân dã đậm chất quê hương: Ếch om chuối đậu, lươn xào sả ớt, cá kho tộ...",
        shortDescription: "Ẩm thực đồng quê dân dã hút khách",
        price: 3500000,
        duration: "1.5 ngày (12 giờ)",
        maxStudents: 10,
        instructor: "Nguyễn Hữu Thọ",
        instructorId: "nguyen-huu-tho",
        image: "/images/courses/dong-que.jpg",
        highlights: [
            "Xử lý mùi tanh thủy hải sản",
            "Kỹ thuật kho tộ, om, nấu mẻ",
            "Trang trí phong cách quê",
            "Lên thực đơn quán nhậu",
        ],
        curriculum: [
            {
                title: "Sơ chế nguyên liệu đồng quê",
                description: "Cách làm sạch và khử tanh ếch, lươn, ốc, cá đồng hiệu quả."
            },
            {
                title: "Các món chế biến từ Ếch",
                description: "Thực hành Ếch om chuối đậu, Ếch rang muối, Ếch xào lăn."
            },
            {
                title: "Các món chế biến từ Lươn và Ốc",
                description: "Lươn xào sả ớt, Chả ốc, Ốc nấu chuối đậu."
            },
            {
                title: "Kỹ thuật kho và om",
                description: "Bí quyết kho cá chắc thịt, đậm đà và kỹ thuật om mẻ chua dịu."
            }
        ],
    },
    {
        id: "hai-san-nha-hang",
        slug: "hai-san-nha-hang",
        name: "Hải Sản Nhà Hàng",
        category: "mon-hai-san",
        courseType: "onsite",
        description:
            "Khóa học chế biến hải sản chuyên nghiệp theo phong cách nhà hàng. Từ sơ chế đến các kỹ thuật nấu nướng cao cấp.",
        shortDescription: "Chế biến hải sản theo phong cách nhà hàng",
        price: 6000000,
        duration: "2 ngày (16 giờ)",
        maxStudents: 6,
        instructor: "Lưu Đức Toàn",
        instructorId: "luu-duc-toan",
        image: "/images/courses/hai-san.jpg",
        highlights: [
            "Kỹ thuật sơ chế hải sản tươi sống",
            "10+ món hải sản cao cấp",
            "Phù hợp nhà hàng, quán bia",
            "Kiểm soát chi phí nguyên liệu",
        ],
        curriculum: [
            { title: "Chọn và sơ chế hải sản", description: "Các phương pháp sơ chế hải sản, khử tanh và bảo quản tươi ngon." },
            { title: "Các món hấp, nướng", description: "Kỹ thuật hấp giữ ngọt và nướng thơm lừng với các loại sốt." },
            { title: "Các món xào, chiên", description: "Bí quyết xào hải sản không ra nước, chiên giòn tan." },
            { title: "Lẩu hải sản và nước dùng", description: "Nấu nước lẩu hải sản chua cay, đậm đà chuẩn vị." }
        ],
    },
    {
        id: "mon-cao-cap-fine-dining",
        slug: "mon-cao-cap-fine-dining",
        name: "Món Cao Cấp Fine Dining",
        category: "mon-cao-cap",
        courseType: "onsite",
        description:
            "Các món ăn tinh tế, phù hợp nhà hàng cao cấp. Kỹ thuật trình bày đẹp mắt và hương vị tinh tế.",
        shortDescription: "Món ăn tinh tế cho nhà hàng cao cấp",
        price: 8000000,
        duration: "3 ngày (24 giờ)",
        maxStudents: 6,
        instructor: "Lưu Đức Toàn",
        instructorId: "luu-duc-toan",
        image: "/images/courses/fine-dining.jpg",
        highlights: [
            "Kỹ thuật plating chuyên nghiệp",
            "10+ món premium Việt fusion",
            "Phù hợp nhà hàng cao cấp",
            "Tư duy sáng tạo menu",
        ],
        curriculum: [
            { title: "Nguyên tắc fine dining", description: "Hiểu về tiêu chuẩn phục vụ và trình bày món ăn cao cấp." },
            { title: "Kỹ thuật plating", description: "Nghệ thuật trình bày món ăn đẹp mắt, tinh tế." },
            { title: "Món khai vị cao cấp", description: "Chế biến các món Salad, Soup Âu đặc sắc." },
            { title: "Món chính và tráng miệng", description: "Thực hành Steak, Cá hồi áp chảo và các món tráng miệng." }
        ],
    },
    {
        id: "mon-au-cao-cap",
        slug: "mon-au-cao-cap",
        name: "Món Âu Cao Cấp",
        category: "mon-cao-cap",
        courseType: "onsite",
        description:
            "Trải nghiệm phong cách ẩm thực phương Tây. Học cách chế biến Steak, Pasta, Salad và các loại sốt Âu.",
        shortDescription: "Tinh hoa ẩm thực phương Tây đẳng cấp",
        price: 8500000,
        duration: "3 ngày (24 giờ)",
        maxStudents: 8,
        instructor: "Christine Hà",
        instructorId: "christine-ha",
        image: "/images/courses/mon-au.jpg",
        highlights: [
            "Kiến thức về thịt bò nhập khẩu",
            "Kỹ thuật áp chảo Steak",
            "Làm Pasta tươi",
            "Tư duy sáng tạo menu",
        ],
        curriculum: [
            { title: "Nguyên tắc fine dining", description: "Hiểu về tiêu chuẩn phục vụ và trình bày món ăn cao cấp." },
            { title: "Kỹ thuật plating", description: "Nghệ thuật trình bày món ăn đẹp mắt, tinh tế." },
            { title: "Món khai vị cao cấp", description: "Chế biến các món Salad, Soup Âu đặc sắc." },
            { title: "Món chính và tráng miệng", description: "Thực hành Steak, Cá hồi áp chảo và các món tráng miệng." }
        ],
    },

    // ========== E-LEARNING COURSES ==========
    {
        id: "online-bun-rieu",
        slug: "online-bun-rieu",
        name: "Bún Riêu Cua",
        category: "mon-an-sang",
        courseType: "elearning",
        description:
            "Học nấu bún riêu cua đồng chuẩn vị miền Bắc ngay tại nhà. Video hướng dẫn chi tiết từng bước.",
        shortDescription: "Bún riêu cua đồng thơm ngon tại nhà",
        price: 990000,
        duration: "Không giới hạn",
        instructor: "Phạm Tuấn Hải",
        instructorId: "pham-tuan-hai",
        image: "/images/courses/bun-rieu.jpg",
        highlights: [
            "Cách chọn cua đồng ngon",
            "Bí quyết nấu riêu đóng tảng",
            "Làm giấm bỗng tại nhà",
            "Hỗ trợ online 1-1",
            "Tặng Ebook công thức",
        ],
        curriculum: [
            {
                title: "Giới thiệu và Dụng cụ",
                description: "Giới thiệu tổng quan về khóa học và các dụng cụ bếp cần thiết."
            },
            {
                title: "Chọn nguyên liệu",
                description: "Hướng dẫn chọn mua cua đồng, cà chua và các loại rau ăn kèm."
            },
            {
                title: "Sơ chế và giã cua",
                description: "Kỹ thuật sơ chế cua, giã và lọc lấy nước cốt cua nhiều thịt."
            },
            {
                title: "Công thức nước dùng",
                description: "Nấu nước dùng chua thanh, nêm nếm gia vị hài hòa."
            },
            {
                title: "Hoàn thiện thành phẩm",
                description: "Cách chưng gạch cua, trình bày tô bún và thưởng thức."
            }
        ],
        // Elearning fields
        totalLessons: 12,
        totalDuration: "120 phút",
        accessDuration: "Trọn đời",
    },
    {
        id: "online-bun-cha",
        slug: "online-bun-cha",
        name: "Bún Chả Hà Nội",
        category: "mon-an-sang",
        courseType: "elearning",
        description:
            "Công thức bún chả Hà Nội gia truyền. Bí quyết ướp thịt nướng mềm thơm và pha nước chấm đu đủ.",
        shortDescription: "Tinh hoa Bún Chả Hà Nội",
        price: 890000,
        duration: "Không giới hạn",
        instructor: "Christine Hà",
        instructorId: "christine-ha",
        image: "/images/courses/bun-cha.jpg",
        highlights: [
            "Công thức ướp thịt mềm",
            "Kỹ thuật nướng than hoa",
            "Pha nước chấm chuẩn vị",
            "Làm dưa góp giòn ngon",
        ],
        curriculum: [
            {
                title: "Giới thiệu khóa học",
                description: "Nội dung khóa học và văn hóa thưởng thức Bún Chả."
            },
            {
                title: "Chuẩn bị nguyên liệu",
                description: "Chọn thịt ba chỉ, thịt nạc vai và các loại rau sống."
            },
            {
                title: "Bí quyết ướp thịt",
                description: "Công thức sốt ướp chả miếng và chả viên đậm đà, dậy mùi."
            },
            {
                title: "Kỹ thuật nướng",
                description: "Cách nướng thịt trên than hoa để thịt chín vàng, không bị cháy."
            },
            {
                title: "Pha nước chấm",
                description: "Tỷ lệ vàng pha nước mắm chấm bún chả chua ngọt."
            }
        ],
        // Elearning fields
        totalLessons: 10,
        totalDuration: "90 phút",
        accessDuration: "Trọn đời",
    },
    {
        id: "pho-bo-online",
        slug: "pho-bo-online",
        name: "Phở Bò Truyền Thống - Online",
        category: "mon-an-sang",
        courseType: "elearning",
        description:
            "Phiên bản online của khóa phở bò nổi tiếng. Học mọi lúc mọi nơi với video HD chi tiết.",
        shortDescription: "Khóa phở bò online từ nghệ nhân ẩm thực",
        price: 1490000,
        duration: "10 video (5 giờ)",
        totalLessons: 10,
        totalDuration: "5 giờ",
        accessDuration: "Trọn đời",
        instructor: "Nguyễn Hữu Thọ",
        instructorId: "nguyen-huu-tho",
        image: "/images/courses/pho-bo-online.jpg",
        highlights: [
            "10 video HD chất lượng cao",
            "Công thức chi tiết kèm định lượng",
            "Tư vấn 1-1 qua Zalo",
            "Truy cập trọn đời",
        ],
        curriculum: [
            { title: "Bài 1: Tổng quan về phở bò", description: "A detailed description of this lesson." },
            { title: "Bài 2: Chọn xương và nguyên liệu", description: "A detailed description of this lesson." },
            { title: "Bài 3: Sơ chế xương", description: "A detailed description of this lesson." },
            { title: "Bài 4: Ninh xương (phần 1)", description: "A detailed description of this lesson." },
            { title: "Bài 5: Ninh xương (phần 2)", description: "A detailed description of this lesson." },
            { title: "Bài 6: Pha chế gia vị", description: "A detailed description of this lesson." },
            { title: "Bài 7: Thái thịt và trần bánh", description: "A detailed description of this lesson." },
            { title: "Bài 8: Hoàn thiện tô phở", description: "A detailed description of this lesson." },
            { title: "Bài 9: Các biến thể", description: "A detailed description of this lesson." },
            { title: "Bài 10: Kinh doanh quán phở", description: "A detailed description of this lesson." },
        ],
    },
    {
        id: "bun-bo-hue-online",
        slug: "bun-bo-hue-online",
        name: "Bún Bò Huế - Online",
        category: "mon-an-sang",
        courseType: "elearning",
        description:
            "Khóa học bún bò Huế online từ nghệ nhân ẩm thực. Video HD hướng dẫn chi tiết từng bước.",
        shortDescription: "Bún bò Huế chuẩn vị qua video online",
        price: 1290000,
        duration: "8 video (4 giờ)",
        totalLessons: 8,
        totalDuration: "4 giờ",
        accessDuration: "Trọn đời",
        instructor: "Nguyễn Hữu Thọ",
        instructorId: "nguyen-huu-tho",
        image: "/images/courses/bun-bo-hue-online.jpg",
        highlights: [
            "8 video HD chi tiết",
            "Bí quyết mắm ruốc chuẩn",
            "Kỹ thuật làm chả Huế",
            "Truy cập trọn đời",
        ],
        curriculum: [
            {
                title: "Bài 1: Đặc trưng bún bò Huế",
                description: "Tổng quan về món ăn và các đặc điểm nhận diện hương vị chuẩn."
            },
            {
                title: "Bài 2: Nguyên liệu cần thiết",
                description: "Chi tiết các loại nguyên liệu, gia vị đặc trưng cho Bún Bò Huế."
            },
            {
                title: "Bài 3: Pha chế mắm ruốc",
                description: "Kỹ thuật xử lý mắn ruốc để tạo mùi thơm đặc trưng mà không bị hôi."
            },
            {
                title: "Bài 4: Nấu nước dùng",
                description: "Quy trình hầm xương và nêm nếm nước dùng đậm đà."
            },
            {
                title: "Bài 5: Làm chả cua",
                description: "Hướng dẫn làm chả cua dai ngon, đúng điệu Huế."
            },
            {
                title: "Bài 6: Làm chả Huế",
                description: "Kỹ thuật quết và gói chả Huế truyền thống."
            },
            {
                title: "Bài 7: Hoàn thiện tô bún",
                description: "Cách trình bày tô bún đẹp mắt, đầy đặn."
            },
            {
                title: "Bài 8: Kinh doanh bún bò",
                description: "Chia sẻ kinh nghiệm định giá và vận hành quán bún bò."
            }
        ],
    },
    {
        id: "pho-ga-online",
        slug: "pho-ga-online",
        name: "Phở Gà Truyền Thống - Online",
        category: "mon-an-sang",
        courseType: "elearning",
        description:
            "Khóa học online phở gà thanh đạm chuẩn vị Bắc. Video HD chi tiết từ chọn gà đến nước dùng.",
        shortDescription: "Phở gà thanh đạm chuẩn vị qua video online",
        price: 990000,
        duration: "6 video (3 giờ)",
        totalLessons: 6,
        totalDuration: "3 giờ",
        accessDuration: "Trọn đời",
        instructor: "Nguyễn Hữu Thọ",
        instructorId: "nguyen-huu-tho",
        image: "/images/courses/pho-ga-online.jpg",
        highlights: [
            "6 video HD chất lượng cao",
            "Bí quyết nước dùng trong vắt",
            "Cách chọn gà ngon",
            "Truy cập trọn đời",
        ],
        curriculum: [
            { title: "Tổng quan mô hình Lẩu Nướng", description: "Phân tích thị trường, lựa chọn mô hình kinh doanh phù hợp (Buffet/Alacarte)." },
            { title: "Các loại sốt ướp thịt nướng", description: "Thực hành sốt BBQ, sốt tiêu đen, sốt Bulgogi, sốt sa tế..." },
            { title: "Các loại nước sốt chấm", description: "Pha chế nước chấm me, sốt chấm xanh hải sản, sốt trứng muối..." },
            { title: "Chế biến các loại nước lẩu", description: "Nấu nước cốt lẩu Thái, lẩu nấm, lẩu Tứ Xuyên, lẩu riêu cua." },
            { title: "Setup quầy line và decor", description: "Cách sắp xếp quầy buffet đẹp mắt, hấp dẫn và tối ưu vận hành." }
        ],
    },
];

// ============================================
// Testimonials
// ============================================
export const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Nguyễn Văn Minh",
        role: "Chủ quán Phở Minh - Hà Đông",
        avatar: "/images/testimonials/avatar-1.jpg",
        content:
            "Sau khóa học phở bò, tôi đã tự tin mở quán và hiện tại doanh thu rất ổn định. Thầy Thọ dạy rất tận tình, từ kỹ thuật đến tư duy kinh doanh.",
        rating: 5,
        course: "Phở Bò Truyền Thống",
    },
    {
        id: "2",
        name: "Trần Thị Hương",
        role: "Chủ quán Bún Huế Hương - Thanh Xuân",
        avatar: "/images/testimonials/avatar-2.jpg",
        content:
            "Khóa học bún bò Huế thực sự đáng giá. Tôi học được không chỉ công thức mà còn cả cách quản lý quán, tính giá thành. Giờ quán của tôi đã có lãi từ tháng đầu tiên!",
        rating: 5,
        course: "Bún Bò Huế Chuẩn Vị",
    },
    {
        id: "3",
        name: "Phạm Đức Anh",
        role: "Đầu bếp tự do",
        avatar: "/images/testimonials/avatar-3.jpg",
        content:
            "Tôi đã học nhiều nơi nhưng DuaxCar Kitchen cho tôi cảm giác thực chiến nhất. Các thầy đều là người làm nghề thật, chia sẻ kinh nghiệm thật.",
        rating: 5,
        course: "Lẩu Nướng Trọn Gói",
    },
    {
        id: "4",
        name: "Lê Thị Mai",
        role: "Chủ quán ăn gia đình - Cầu Giấy",
        avatar: "/images/testimonials/avatar-4.jpg",
        content:
            "Ban đầu tôi chỉ muốn nấu ngon cho gia đình, nhưng sau khóa học tôi đã mở được quán nhỏ. Cảm ơn thầy Long đã tư vấn mô hình rất chi tiết.",
        rating: 5,
        course: "Món Gia Đình Cơ Bản",
    },
];

// ============================================
// Stats
// ============================================
export const stats: Stat[] = [
    { value: "500", label: "Học viên đã đào tạo", suffix: "+" },
    { value: "25", label: "Năm kinh nghiệm", suffix: "+" },
    { value: "50", label: "Quán mở thành công", suffix: "+" },
    { value: "8", label: "Danh mục khóa học", suffix: "" },
];

// ============================================
// Blog Posts
// ============================================
export const blogPosts: BlogPost[] = [
    {
        id: "1",
        slug: "bi-quyet-nau-pho-ngon-tai-nha",
        title: "Bí quyết nấu phở bò ngon tại nhà chuẩn vị Hà Nội",
        excerpt:
            "Hướng dẫn chi tiết cách nấu phở bò chuẩn vị truyền thống Hà Nội. Từ khâu chọn xương, sơ chế đến bí quyết ninh nước dùng trong vắt, ngọt thanh.",
        content: `
            <p class="lead">Phở bò Hà Nội không chỉ là một món ăn, mà là một nét văn hóa, một niềm tự hào của ẩm thực Việt. Để nấu được một nồi phở chuẩn vị tại nhà không khó, nhưng đòi hỏi sự tỉ mỉ và kiên nhẫn. Dưới đây là bí quyết từ nghệ nhân Nguyễn Hữu Thọ.</p>

            <h2>1. Chọn Nguyên Liệu: "Linh Hồn" Của Nồi Phở</h2>
            <h3>Chọn xương bò</h3>
            <p>Nước dùng ngon bắt đầu từ xương ngon. Hai loại xương "cực phẩm" cho nồi phở là:</p>
            <ul>
                <li><strong>Xương ống (xương sườn):</strong> Chứa nhiều tủy, tạo độ ngọt sâu và béo ngậy. Hãy chọn xương có màu đỏ tươi, không có mùi lạ.</li>
                <li><strong>Xương đuôi:</strong> Tạo độ ngọt thanh và mùi thơm đặc trưng.</li>
            </ul>
            <p>Ngoài ra, bạn cần chuẩn bị thịt bò tái (thăn, bắp) và thịt nạm (gầu, vè) tùy sở thích.</p>

            <h3>Bộ gia vị thảo mộc</h3>
            <p>Hương thơm của phở đến từ sự kết hợp tinh tế của: Quế, hồi, thảo quả, đinh hương, hạt mùi và một chút gừng nướng, hành tím nướng. Tỷ lệ cũng rất quan trọng - quá nhiều hồi sẽ bị hắc, quá nhiều quế sẽ bị cay.</p>

            <h2>2. Quy Trình Sơ Chế Chuẩn Chỉ</h2>
            <h3>Bước 1: Khử mùi xương</h3>
            <p>Ngâm xương trong nước muối loãng pha chút gừng đập dập ít nhất 2 tiếng để sạch máu. Đây là bước quan trọng giúp nước dùng không bị hôi.</p>
            <p>Sau đó, chần xương qua nước sôi khoảng 5-7 phút, rửa sạch lại bằng nước lạnh để loại bỏ hoàn toàn bọt bẩn.</p>

            <h3>Bước 2: Nướng gia vị</h3>
            <p>Gừng và hành tím để nguyên vỏ nướng thơm, sau đó cạo sạch vỏ đen, đập dập. Các loại gia vị khô (quế, hồi...) rang sơ cho dậy mùi thơm rồi cho vào túi lọc.</p>

            <h2>3. Kỹ Thuật Ninh Nước Dùng "Trong Vắt"</h2>
            <p>Đây là công đoạn tốn nhiều thời gian nhất. Một nồi nước dùng đạt chuẩn cần được ninh nhỏ lửa (sôi lăn tăn) trong <strong>ít nhất 8-10 tiếng</strong>.</p>
            <ul>
                <li><strong>Giai đoạn 1:</strong> Đun sôi xương với nước lạnh, hớt bọt liên tục.</li>
                <li><strong>Giai đoạn 2:</strong> Hạ lửa nhỏ liu riu, cho gừng và hành nướng vào. KHÔNG đậy vung kín để nước không bị đục.</li>
                <li><strong>Giai đoạn 3:</strong> Khoảng 1 tiếng trước khi ăn, mới thả túi gia vị vào. Nếu ninh gia vị quá lâu, nước dùng sẽ bị nồng và sậm màu.</li>
            </ul>

            <h2>4. Bí Quyết Nêm Nếm Cân Bằng</h2>
            <p>Sử dụng nước mắm ngon, muối hạt và một chút đường phèn để tạo độ ngọt dịu. Lưu ý nêm nước mắm vào sau cùng để giữ hương thơm.</p>

            <h3>Thưởng thức</h3>
            <p>Bánh phở trần nóng, xếp thịt bò thái mỏng, hành lá, rau thơm. Chan nước dùng thật sôi lên trên. Ăn kèm dấm tỏi, tương ớt và quẩy giòn tan. Chúc bạn thành công!</p>
        `,
        image: "/images/courses/pho-bo.jpg",
        author: "Nguyễn Hữu Thọ",
        authorImage: "/images/instructors/nguyen-huu-tho-v3.jpg",
        date: "2025-01-05",
        category: "Công thức",
        readTime: "10 phút",
        featured: true,
    },
    {
        id: "2",
        slug: "mo-quan-an-can-bao-nhieu-von",
        title: "Mở quán ăn cần bao nhiêu vốn? Bảng dự toán chi tiết 2025",
        excerpt:
            "Phân tích chi tiết các khoản chi phí khi khởi nghiệp kinh doanh F&B. Dự toán vốn cho quán bình dân và quán tầm trung.",
        content: `
            <p class="lead">"Có 100 triệu có mở quán phở được không?" là câu hỏi DuaxCar Kitchen nhận được rất nhiều. Câu trả lời là CÓ, nhưng bạn cần bài toán tài chính rõ ràng để không bị "hụt hơi" giữa đường.</p>

            <h2>1. Chi Phí Cố Định Ban Đầu (Capex)</h2>
            <p>Đây là khoản tiền bạn phải bỏ ra một lần trước khi quán đi vào hoạt động.</p>

            <h3>Thuê mặt bằng</h3>
            <p>Thông thường chủ nhà sẽ yêu cầu cọc 1-3 tháng và đóng tiền nhà 3-6 tháng. Ví dụ, thuê nhà 10 triệu/tháng -> Cần chuẩn bị ngay 40-70 triệu.</p>

            <h3>Cải tạo và Trang trí (Decor)</h3>
            <p>Với quán bình dân:</p>
            <ul>
                <li>Sơn sửa, biển bảng: 5-10 triệu.</li>
                <li>Hệ thống đèn, điện nước: 3-5 triệu.</li>
            </ul>
            <p>Đừng chi quá nhiều cho decor nếu vốn mỏng. Sạch sẽ và thoáng mát là ưu tiên số 1.</p>

            <h3>Mua sắm trang thiết bị</h3>
            <p>Danh sách tối thiểu cần có:</p>
            <ul>
                <li><strong>Bếp:</strong> Nồi nấu phở điện (bộ 2-3 nồi), bàn chặt inox, chậu rửa công nghiệp. (~15-20 triệu)</li>
                <li><strong>Bàn ghế:</strong> 10 bộ bàn ghế (loại gỗ thông hoặc inox). (~10-15 triệu)</li>
                <li><strong>Bát đĩa, dụng cụ:</strong> (~5 triệu)</li>
                <li><strong>Tủ lạnh/Tủ đông:</strong> (~5-7 triệu)</li>
            </ul>

            <h2>2. Chi Phí Vận Hành (Opex) và Vốn Lưu Động</h2>
            <p>Sai lầm lớn nhất của người mới là dồn hết tiền vào sửa quán mà quên mất quỹ dự phòng.</p>

            <h3>Nhập nguyên liệu</h3>
            <p>Cần chuẩn bị vốn xoay vòng cho 3-5 ngày nhập hàng đầu tiên (khoảng 5-10 triệu).</p>

            <h3>Marketing khai trương</h3>
            <p>Băng rôn, tờ rơi, chạy quảng cáo Facebook khu vực lân cận: 2-3 triệu.</p>

            <h3>Quỹ dự phòng rủi ro</h3>
            <p>Hãy luôn giữ lại ít nhất số tiền đủ để trả lương nhân viên và điện nước trong 1-2 tháng đầu khi khách chưa ổn định.</p>

            <h2>3. Tổng Kết Dự Toán Sơ Bộ</h2>
            <ul>
                <li><strong>Mô hình vỉa hè/bình dân:</strong> 60 - 80 triệu.</li>
                <li><strong>Mô hình quán thuê nhà nhỏ:</strong> 120 - 150 triệu.</li>
                <li><strong>Mô hình nhượng quyền/chuyên nghiệp:</strong> 300 - 500 triệu trở lên.</li>
            </ul>
            <p>Lời khuyên: "Lấy công làm lãi" trong giai đoạn đầu. Chủ quán nên là người trực tiếp đứng bếp hoặc chạy bàn để tiết kiệm chi phí nhân sự.</p>
        `,
        image: "/images/categories/category_breakfast_1767962922195.png",
        author: "Phạm Văn Long",
        authorImage: "/images/instructors/pham-van-long-v3.jpg",
        date: "2025-01-03",
        category: "Kinh doanh",
        readTime: "12 phút",
        featured: false,
    },
    {
        id: "3",
        slug: "xu-huong-am-thuc-2025",
        title: "Xu hướng ẩm thực 2025: Cơ hội nào cho món Việt?",
        excerpt:
            "Thực khách năm 2025 tìm kiếm điều gì? Phân tích xu hướng ăn sạch, trải nghiệm văn hóa và sự lên ngôi của Local Food.",
        content: `
            <p class="lead">Năm 2024 đánh dấu sự bùng nổ của Michelin Guide tại Việt Nam. Bước sang 2025, bản đồ ẩm thực sẽ dịch chuyển theo hướng nào?</p>

            <h2>1. "Ăn Sạch, Sống Xanh" - Không Chỉ Là Khẩu Hiệu</h2>
            <p>Sau đại dịch và các vấn đề an toàn thực phẩm, thực khách ngày càng khó tính hơn. Họ sẵn sàng trả giá cao hơn cho:</p>
            <ul>
                <li>Nguyên liệu có nguồn gốc rõ ràng (Farm to Table).</li>
                <li>Quy trình chế biến hạn chế dầu mỡ, mì chính.</li>
                <li>Bao bì thân thiện môi trường.</li>
            </ul>
            <p>Các quán phở, bún chả không dùng mì chính, sử dụng rau sạch đang có lợi thế cạnh tranh rất lớn.</p>

            <h2>2. Trải Nghiệm Văn Hóa Địa Phương (Local Experience)</h2>
            <p>Khách du lịch (và cả người trẻ Gen Z) không chỉ đi ăn để no.</p>
            <h3>Kể chuyện qua món ăn</h3>
            <p>Tại sao bát phở này lại có vị này? Tại sao dùng loại tương này? Chủ quán biết kể câu chuyện về món ăn sẽ giữ chân khách hàng lâu hơn.</p>
            <h3>Không gian hoài cổ (Indochine, Vintage)</h3>
            <p>Xu hướng thiết kế quán ăn theo phong cách bao cấp, hoặc Đông Dương xưa vẫn đang rất thịnh hành vì tính "Instagrammable" (dễ chụp ảnh sống ảo).</p>

            <h2>3. "Bếp Trên Mây" và Bán Hàng Đa Kênh</h2>
            <p>Dù mở quán trực tiếp vẫn là chủ đạo, nhưng không thể bỏ qua kênh online. ShopeeFood, GrabFood, TikTok Shop đang trở thành nguồn thu quan trọng.</p>
            <p>Xu hướng đóng gói món ăn (phở gói, gia vị cô đặc) để bán đi xa cũng đang là mỏ vàng chưa được khai thác hết.</p>

            <h2>4. Kết Luận</h2>
            <p>Cơ hội cho món Việt là rất lớn. Nhưng để thành công, ngon thôi chưa đủ, bạn cần Sạch, Đẹp và có Câu Chuyện.</p>
        `,
        image: "/images/courses/mon-dong-que.jpg",
        author: "Phạm Văn Long",
        authorImage: "/images/instructors/pham-van-long.jpg",
        date: "2025-01-01",
        category: "Xu hướng",
        readTime: "8 phút",
        featured: false,
    },
    {
        id: "4",
        slug: "hoc-vien-thanh-cong-anh-minh",
        title: "Từ nhân viên IT lương nghìn đô đến ông chủ chuỗi Phở",
        excerpt:
            "Câu chuyện đầy cảm hứng của anh Minh - học viên khóa K25. Dám từ bỏ vùng an toàn để theo đuổi đam mê ẩm thực truyền thống.",
        content: `
            <p class="lead">"Nhiều người bảo tôi điên khi bỏ việc lương 30 triệu đi bán phở. Nhưng giờ tôi thấy mình điên vì không làm điều đó sớm hơn."</p>

            <h2>1. Cú Rẽ Ngang Tuổi 30</h2>
            <p>Anh Nguyễn Tuấn Minh (32 tuổi, từng là Leader team IT) chia sẻ về những ngày tháng làm việc 12-14 tiếng với máy tính, sức khỏe đi xuống và không tìm thấy niềm vui.</p>
            <p>Vốn mê nấu ăn, anh thường mày mò nấu phở cuối tuần. Ý định mở quán nhen nhóm nhưng nỗi sợ thất bại luôn kìm hãm.</p>

            <h2>2. Tìm Thầy Học Đạo</h2>
            <p>Quyết định nghỉ việc, anh Minh dành 1 tháng tìm nơi học nghề. "Tôi không muốn mở quán theo kiểu tự phát. Tôi cần quy trình, công thức chuẩn để có thể nhân bản."</p>
            <h3>Cơ duyên với DuaxCar Kitchen</h3>
            <p>Gặp thầy Thọ, anh bị thuyết phục bởi tư duy "Kinh doanh bền vững" chứ không chỉ là dạy nấu ngon. Khóa học 15 ngày không chỉ dạy anh cách ninh xương, mà dạy anh cách tính cost món ăn, cách quản lý nhân sự, cách xử lý khủng hoảng.</p>

            <h2>3. Những Ngày Đầu Gian Khó</h2>
            <p>Quán "Phở Minh" đầu tiên mở tại một ngõ nhỏ Cầu Giấy. Tuần đầu tiên, khách lèo tèo. Anh Minh stress đến mất ngủ.</p>
            <p>Nhớ lời thầy dạy: "Chất lượng là gốc". Anh kiên quyết không dùng phụ gia làm ngọt, giữ nguyên công thức nước dùng ninh 12 tiếng. Dần dần, hữu xạ tự nhiên hương.</p>

            <h2>4. Hái Quả Ngọt</h2>
            <p>Sau 6 tháng, quán bắt đầu quá tải vào giờ cao điểm. Khách hàng quay lại vì "vị ngọt thật, ăn xong không bị tê lưỡi".</p>
            <p>Hiện tại, sau 2 năm, anh Minh chuẩn bị khai trương cơ sở thứ 3. "Cảm ơn DuaxCar Kitchen đã cho tôi cái nghề, và cho tôi tư duy của một người làm chủ thực thụ."</p>
        `,
        image: "/images/courses/bun-cha.jpg",
        author: "DuaxCar Kitchen",
        authorImage: "/images/logo.png",
        date: "2024-12-28",
        category: "Câu chuyện",
        readTime: "10 phút",
        featured: false,
    },
];

// ============================================
// Contact Info
// ============================================
export const contactInfo: ContactInfo = {
    phone: "0859 828 222",
    email: "duaxcar@gmail.com",
    address: "Số 20 TT18, KĐT Văn Phú, Phú La, Hà Đông, Hà Nội",
    workingHours: "8:00 - 20:00 (Thứ 2 - Chủ nhật)",
    companyName: "CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ DUACAR KITCHEN", // Added company name
    mapEmbed:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7074596408!2d105.8246!3d20.997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac5f0e889f67%3A0xcc54c19019c6e1fa!2sDuaxCar%20Kitchen!5e0!3m2!1svi!2s!4v1704798000000!5m2!1svi!2s",
    socials: {
        facebook: "https://facebook.com/duaxcarkitchen",
        youtube: "https://youtube.com/@duaxcarkitchen",
        tiktok: "https://tiktok.com/@duaxcarkitchen",
        zalo: "https://zalo.me/0859828222",
    },
};
