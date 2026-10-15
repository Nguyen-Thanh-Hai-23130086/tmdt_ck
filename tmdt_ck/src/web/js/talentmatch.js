const jobs = [
    {
        id: "frontend-dev",
        title: "Frontend Developer React",
        company: "NovaTech Solutions",
        type: "Full-time",
        location: "TP.HCM",
        salary: 22000000,
        skills: ["React", "JavaScript", "HTML/CSS"],
        posted: "Hôm nay",
        deadline: "30/11/2026",
        sold: 128,
        description: "Phát triển giao diện web tuyển dụng, tối ưu trải nghiệm người dùng và phối hợp cùng backend để tích hợp API.",
        requirements: ["Tối thiểu 1 năm kinh nghiệm React", "Nắm vững JavaScript ES6+", "Biết làm responsive UI"],
        benefits: ["Lương tháng 13", "Hybrid 3 ngày/tuần", "Review lương 2 lần/năm"],
        reviews: [
            { name: "Minh Anh", rating: 5, content: "Công ty phản hồi ứng tuyển nhanh, mô tả công việc rõ ràng." },
            { name: "Quốc Bảo", rating: 4, content: "Quy trình phỏng vấn gọn, team kỹ thuật thân thiện." }
        ]
    },
    {
        id: "backend-node",
        title: "Backend Node.js Engineer",
        company: "TalentHub Vietnam",
        type: "Full-time",
        location: "Hà Nội",
        salary: 28000000,
        skills: ["Node.js", "Express", "PostgreSQL"],
        posted: "2 ngày trước",
        deadline: "12/12/2026",
        sold: 96,
        description: "Xây dựng API, tối ưu cơ sở dữ liệu và phát triển các module xác thực, phân quyền, thanh toán demo.",
        requirements: ["Có kinh nghiệm REST API", "Biết PostgreSQL hoặc MySQL", "Ưu tiên biết Prisma"],
        benefits: ["MacBook làm việc", "Bảo hiểm đầy đủ", "Đào tạo kỹ thuật hằng tháng"],
        reviews: [
            { name: "Thanh Nam", rating: 5, content: "JD sát thực tế, mức lương trao đổi minh bạch." }
        ]
    },
    {
        id: "uiux-designer",
        title: "UI/UX Designer",
        company: "Creative Lab",
        type: "Freelance",
        location: "Remote",
        salary: 15000000,
        skills: ["Figma", "Design System", "Prototype"],
        posted: "1 tuần trước",
        deadline: "05/12/2026",
        sold: 210,
        description: "Thiết kế wireframe, prototype và UI kit cho sản phẩm web/app trong lĩnh vực tuyển dụng.",
        requirements: ["Có portfolio", "Biết xây dựng design system", "Hiểu luồng người dùng"],
        benefits: ["Làm việc remote", "Thanh toán theo milestone", "Có cơ hội hợp tác dài hạn"],
        reviews: [
            { name: "Hà My", rating: 4, content: "Brief rõ ràng, khách hàng phản hồi lịch sự." }
        ]
    },
    {
        id: "data-analyst",
        title: "Data Analyst Intern",
        company: "Market Insight",
        type: "Internship",
        location: "Đà Nẵng",
        salary: 6000000,
        skills: ["SQL", "Excel", "Power BI"],
        posted: "3 ngày trước",
        deadline: "20/11/2026",
        sold: 64,
        description: "Hỗ trợ tổng hợp dữ liệu, xây dựng dashboard và phân tích báo cáo tuyển dụng theo từng chiến dịch.",
        requirements: ["Biết SQL cơ bản", "Thành thạo Excel", "Tư duy phân tích tốt"],
        benefits: ["Có mentor hướng dẫn", "Hỗ trợ dấu thực tập", "Cơ hội lên chính thức"],
        reviews: [
            { name: "Gia Huy", rating: 5, content: "Phù hợp cho sinh viên muốn học dữ liệu thực tế." }
        ]
    }
];

const candidates = [
    {
        id: "nguyen-minh-anh",
        name: "Nguyễn Minh Anh",
        title: "Frontend Developer",
        location: "TP.HCM",
        experience: 2,
        expectedSalary: 20000000,
        skills: ["React", "JavaScript", "HTML/CSS", "Git"],
        status: "Đang tìm việc",
        summary: "Có kinh nghiệm xây dựng dashboard, landing page và hệ thống quản trị nội bộ bằng React.",
        projects: ["Dashboard tuyển dụng", "Trang hồ sơ Freelancer", "UI kit nội bộ"]
    },
    {
        id: "tran-quoc-bao",
        name: "Trần Quốc Bảo",
        title: "Backend Developer",
        location: "Hà Nội",
        experience: 3,
        expectedSalary: 26000000,
        skills: ["Node.js", "Express", "PostgreSQL", "Docker"],
        status: "Sẵn sàng phỏng vấn",
        summary: "Tập trung vào API, xác thực, phân quyền và tối ưu truy vấn cơ sở dữ liệu.",
        projects: ["API quản lý đơn ứng tuyển", "Hệ thống thông báo", "Module thanh toán demo"]
    },
    {
        id: "le-ha-my",
        name: "Lê Hà My",
        title: "UI/UX Designer",
        location: "Remote",
        experience: 4,
        expectedSalary: 18000000,
        skills: ["Figma", "Prototype", "Design System", "User Flow"],
        status: "Nhận dự án freelance",
        summary: "Thiết kế sản phẩm SaaS, marketplace và nền tảng tuyển dụng với hệ thống component rõ ràng.",
        projects: ["Talent marketplace", "Mobile banking flow", "Design system tuyển dụng"]
    },
    {
        id: "pham-gia-huy",
        name: "Phạm Gia Huy",
        title: "Data Analyst",
        location: "Đà Nẵng",
        experience: 1,
        expectedSalary: 12000000,
        skills: ["SQL", "Excel", "Power BI", "Python"],
        status: "Đang tìm việc",
        summary: "Phân tích dữ liệu vận hành, tạo dashboard và báo cáo hiệu suất chiến dịch.",
        projects: ["Dashboard tuyển dụng", "Báo cáo funnel ứng viên", "Phân tích dữ liệu bán hàng"]
    }
];

function safe(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function formatCurrency(value) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
    }).format(value);
}

function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

function stars(rating) {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function initAvatarMenu() {
    const avatarButton = document.getElementById("avatarButton");
    const avatarMenu = document.getElementById("avatarMenu");
    if (!avatarButton || !avatarMenu) return;

    avatarButton.addEventListener("click", () => {
        avatarMenu.classList.toggle("open");
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".avatar-area")) {
            avatarMenu.classList.remove("open");
        }
    });
}

function injectFooter() {
    if (document.querySelector(".footer")) return;

    document.body.insertAdjacentHTML("beforeend", `
        <footer class="footer">
            <div class="footer-content">
                <div class="footer-brand">
                    <a href="home.html" class="brand brand-footer">
                        <span class="brand-symbol"><i></i><i></i><i></i><i></i></span>
                        <span><strong>Talent<span>Match</span></strong><small>KẾT NỐI TÀI NĂNG - KIẾN TẠO TƯƠNG LAI</small></span>
                    </a>
                    <div class="footer-social"><a href="#">f</a><a href="#">in</a><a href="#">▶</a><a href="#">◎</a></div>
                </div>
                <div class="footer-col"><h3>Dành cho người tìm việc</h3><a href="jobs.html">Tìm việc làm</a><a href="profile.html">Tạo hồ sơ</a><a href="#">Hướng dẫn</a></div>
                <div class="footer-col"><h3>Dành cho nhà tuyển dụng</h3><a href="#">Đăng tin tuyển dụng</a><a href="candidates.html">Tìm ứng viên</a><a href="#">Bảng giá</a></div>
                <div class="footer-col"><h3>Về TalentMatch</h3><a href="#">Giới thiệu</a><a href="#">Chính sách bảo mật</a><a href="#">Điều khoản sử dụng</a></div>
                <div class="footer-col"><h3>Hỗ trợ</h3><a href="#">Trung tâm trợ giúp</a><a href="#">Câu hỏi thường gặp</a><a href="#">Liên hệ</a></div>
                <div class="newsletter"><h3>Đăng ký nhận tin</h3><form action="#"><input type="email" placeholder="Nhập email của bạn"><button type="submit">→</button></form><small>Nhận tin việc làm và các cơ hội mới nhất</small></div>
            </div>
            <div class="footer-bottom"><span>© 2025 TalentMatch. Tất cả quyền được bảo lưu.</span></div>
        </footer>
    `);
}

function renderHome() {
    const jobWrap = document.getElementById("homeJobs");
    const candidateWrap = document.getElementById("homeCandidates");
    if (!jobWrap || !candidateWrap) return;

    jobWrap.innerHTML = jobs.slice(0, 3).map(jobCard).join("");
    candidateWrap.innerHTML = candidates.slice(0, 3).map(candidateCard).join("");
}

function jobCard(job) {
    return `
        <article class="listing-card">
            <div class="listing-top">
                <span class="company-logo">${safe(job.company.slice(0, 2).toUpperCase())}</span>
                <div>
                    <h3>${safe(job.title)}</h3>
                    <p>${safe(job.company)} • ${safe(job.location)} • ${safe(job.type)}</p>
                </div>
            </div>
            <div class="tag-row">${job.skills.map(skill => `<span>${safe(skill)}</span>`).join("")}</div>
            <div class="listing-meta">
                <strong>${safe(formatCurrency(job.salary))}</strong>
                <span>Đã xem ${safe(job.sold)}</span>
            </div>
            <a class="primary-link" href="job-detail.html?id=${encodeURIComponent(job.id)}">Xem chi tiết</a>
        </article>
    `;
}

function candidateCard(candidate) {
    return `
        <article class="listing-card">
            <div class="listing-top">
                <span class="avatar">${safe(candidate.name.split(" ").slice(-1)[0][0])}</span>
                <div>
                    <h3>${safe(candidate.name)}</h3>
                    <p>${safe(candidate.title)} • ${safe(candidate.location)} • ${safe(candidate.experience)} năm kinh nghiệm</p>
                </div>
            </div>
            <div class="tag-row">${candidate.skills.map(skill => `<span>${safe(skill)}</span>`).join("")}</div>
            <div class="listing-meta">
                <strong>${safe(formatCurrency(candidate.expectedSalary))}</strong>
                <span>${safe(candidate.status)}</span>
            </div>
            <a class="primary-link" href="candidate-detail.html?id=${encodeURIComponent(candidate.id)}">Xem hồ sơ</a>
        </article>
    `;
}

function filterBySkill(items, skill) {
    if (skill === "all") return items;
    return items.filter(item => item.skills.includes(skill));
}

function initJobsPage() {
    const grid = document.getElementById("jobsGrid");
    if (!grid) return;

    const keyword = document.getElementById("jobKeyword");
    const skill = document.getElementById("jobSkill");
    const location = document.getElementById("jobLocation");
    const budget = document.getElementById("jobBudget");
    const sort = document.getElementById("jobSort");
    const count = document.getElementById("jobCount");

    const initialQuery = new URLSearchParams(window.location.search).get('q');
    if (initialQuery && !grid.dataset.tmQueryApplied) {keyword.value=initialQuery.slice(0,160);grid.dataset.tmQueryApplied='1';}
    function render() {
        let data = jobs.filter(job => {
            const matchKeyword = job.title.toLowerCase().includes(keyword.value.trim().toLowerCase()) ||
                job.company.toLowerCase().includes(keyword.value.trim().toLowerCase()) || job.skills.some(s=>s.toLowerCase().includes(keyword.value.trim().toLowerCase()));
            const matchSkill = skill.value === "all" || job.skills.includes(skill.value);
            const matchLocation = location.value === "all" || job.location === location.value;
            const matchBudget = !budget || budget.value === 'all' || Number(job.salary) <= Number(budget.value);
            return matchKeyword && matchSkill && matchLocation && matchBudget;
        });

        if (sort.value === "salaryDesc") data = data.sort((a, b) => b.salary - a.salary);
        if (sort.value === "salaryAsc") data = data.sort((a, b) => a.salary - b.salary);
        if (sort.value === "viewDesc") data = data.sort((a, b) => b.sold - a.sold);

        count.textContent = `${data.length} việc làm phù hợp`;
        grid.innerHTML = data.length ? data.map(jobCard).join("") : '<div class="empty-state">Không tìm thấy việc làm phù hợp.</div>';
    }

    if (!grid.dataset.tmBound) { [keyword, skill, location, budget, sort].filter(Boolean).forEach(control => control.addEventListener("input", render)); grid.dataset.tmBound = "1"; }
    render();
}

function initCandidatesPage() {
    const grid = document.getElementById("candidatesGrid");
    if (!grid) return;

    const keyword = document.getElementById("candidateKeyword");
    const skill = document.getElementById("candidateSkill");
    const exp = document.getElementById("candidateExp");
    const sort = document.getElementById("candidateSort");
    const count = document.getElementById("candidateCount");

    const initialQuery = new URLSearchParams(window.location.search).get('q');
    if (initialQuery && !grid.dataset.tmQueryApplied) {keyword.value=initialQuery.slice(0,160);grid.dataset.tmQueryApplied='1';}
    function render() {
        let data = candidates.filter(candidate => {
            const matchKeyword = candidate.name.toLowerCase().includes(keyword.value.trim().toLowerCase()) ||
                candidate.title.toLowerCase().includes(keyword.value.trim().toLowerCase()) || candidate.skills.some(s=>s.toLowerCase().includes(keyword.value.trim().toLowerCase()));
            const matchSkill = skill.value === "all" || candidate.skills.includes(skill.value);
            let matchExp = true;
            if (exp.value === "junior") matchExp = candidate.experience <= 1;
            if (exp.value === "middle") matchExp = candidate.experience >= 2 && candidate.experience <= 3;
            if (exp.value === "senior") matchExp = candidate.experience >= 4;
            return matchKeyword && matchSkill && matchExp;
        });

        if (sort.value === "salaryAsc") data = data.sort((a, b) => a.expectedSalary - b.expectedSalary);
        if (sort.value === "salaryDesc") data = data.sort((a, b) => b.expectedSalary - a.expectedSalary);
        if (sort.value === "expDesc") data = data.sort((a, b) => b.experience - a.experience);

        count.textContent = `${data.length} ứng viên phù hợp`;
        grid.innerHTML = data.length ? data.map(candidateCard).join("") : '<div class="empty-state">Không tìm thấy ứng viên phù hợp.</div>';
    }

    if (!grid.dataset.tmBound) { [keyword, skill, exp, sort].forEach(control => control.addEventListener("input", render)); grid.dataset.tmBound = "1"; }
    render();
}

function initJobDetailPage() {
    const detail = document.getElementById("jobDetail");
    if (!detail) return;

    const job = jobs.find(item => item.id === getParam("id")) ;
    if (!job) { detail.innerHTML = '<div class="empty-state"><h2>Không tìm thấy công việc</h2><p>Liên kết có thể đã thay đổi.</p><a class="primary-link" href="jobs.html">Trở lại danh sách</a></div>'; return; }
    detail.innerHTML = `
        <div class="detail-head">
            <span class="company-logo large">${safe(job.company.slice(0, 2).toUpperCase())}</span>
            <div>
                <p class="eyebrow-mini">${safe(job.company)}</p>
                <h1>${safe(job.title)}</h1>
                <p>${safe(job.location)} • ${safe(job.type)} • Hạn ứng tuyển ${safe(job.deadline)}</p>
            </div>
        </div>
        <div class="tag-row">${job.skills.map(skill => `<span>${safe(skill)}</span>`).join("")}</div>
        <div class="detail-grid">
            <section>
                <h2>Mô tả công việc</h2>
                <p>${safe(job.description)}</p>
                <h2>Yêu cầu</h2>
                <ul>${job.requirements.map(item => `<li>${safe(item)}</li>`).join("")}</ul>
                <h2>Quyền lợi</h2>
                <ul>${job.benefits.map(item => `<li>${safe(item)}</li>`).join("")}</ul>
            </section>
            <aside class="apply-card">
                <strong>${safe(formatCurrency(job.salary))}</strong>
                <p>Mức lương dự kiến</p>
                <button class="primary-button" type="button" id="applyButton">Ứng tuyển ngay</button>
                <p class="form-message" id="applyMessage"></p>
            </aside>
        </div>
        <section class="reviews-card embedded">
            <div class="section-heading">
                <div>
                    <h2>Đánh giá công ty</h2>
                    <p>Nhận xét từ ứng viên đã từng trao đổi với công ty.</p>
                </div>
            </div>
            <div class="review-list">
                ${job.reviews.map(review => `
                    <div class="review-item">
                        <strong>${safe(review.name)}</strong>
                        <div class="stars">${stars(review.rating)}</div>
                        <p>${safe(review.content)}</p>
                    </div>
                `).join("")}
            </div>
        </section>
    `;

    document.getElementById("applyButton").addEventListener("click", () => { window.location.href = "workspace.html?view=applications&job=" + encodeURIComponent(job.id); });
}

function initCandidateDetailPage() {
    const detail = document.getElementById("candidateDetail");
    if (!detail) return;

    const candidate = candidates.find(item => item.id === getParam("id")) ;
    if (!candidate) { detail.innerHTML = '<div class="empty-state"><h2>Không tìm thấy Freelancer</h2><p>Hồ sơ không tồn tại.</p><a class="primary-link" href="candidates.html">Trở lại danh sách</a></div>'; return; }
    detail.innerHTML = `
        <div class="detail-head">
            <span class="avatar large">${safe(candidate.name.split(" ").slice(-1)[0][0])}</span>
            <div>
                <p class="eyebrow-mini">${safe(candidate.status)}</p>
                <h1>${safe(candidate.name)}</h1>
                <p>${safe(candidate.title)} • ${safe(candidate.location)} • ${safe(candidate.experience)} năm kinh nghiệm</p>
            </div>
        </div>
        <div class="detail-grid">
            <section>
                <h2>Giới thiệu</h2>
                <p>${safe(candidate.summary)}</p>
                <h2>Kỹ năng</h2>
                <div class="tag-row">${candidate.skills.map(skill => `<span>${safe(skill)}</span>`).join("")}</div>
                <h2>Dự án tiêu biểu</h2>
                <ul>${candidate.projects.map(item => `<li>${safe(item)}</li>`).join("")}</ul>
            </section>
            <aside class="apply-card">
                <strong>${safe(formatCurrency(candidate.expectedSalary))}</strong>
                <p>Mức lương mong muốn</p>
                <button class="primary-button" type="button" id="inviteButton">Mời ứng tuyển</button>
                <p class="form-message" id="inviteMessage"></p>
            </aside>
        </div>
    `;

    document.getElementById("inviteButton").addEventListener("click", () => { window.location.href = "workspace.html?view=invitations&candidate=" + encodeURIComponent(candidate.id); });
}

function initProfilePage() {
    const form = document.getElementById("profileForm");
    if (!form) return;
    try { const saved=JSON.parse(localStorage.getItem('tm_legacy_profile')||'null');if(saved)Object.entries(saved).forEach(([key,value])=>{const field=form.querySelector('[id="'+key+'"]');if(field)field.value=value;});}catch{}
    form.addEventListener("submit", async event => {
        event.preventDefault();
        const data=Object.fromEntries([...form.querySelectorAll('input,textarea')].map(input=>[input.id,input.value]));
        const message=document.getElementById("profileMessage");
        try {
            const logged=await fetch('../api/auth/me',{credentials:'same-origin'});
            if(logged.ok){const body=new URLSearchParams({name:data.fullName,headline:data.headline,skills:data.skills,bio:data.bio,portfolio:''});const result=await fetch('../api/profile',{method:'POST',credentials:'same-origin',headers:{'X-TM-Request':'1','Content-Type':'application/x-www-form-urlencoded'},body});if(!result.ok)throw Error('MySQL chưa thể cập nhật hồ sơ');message.textContent='Đã lưu hồ sơ trong MySQL.';return;}
        } catch(error){if(!error.message.includes('Failed to fetch')&&!error.message.includes('NetworkError')){message.textContent=error.message;return;}}
        localStorage.setItem('tm_legacy_profile',JSON.stringify(data));
        message.textContent='Đã lưu hồ sơ vào trình duyệt (chế độ demo, không phải MySQL).';
    });
}

initAvatarMenu();
injectFooter();
renderHome();
initJobsPage();
initCandidatesPage();
initJobDetailPage();
initCandidateDetailPage();
initProfilePage();
