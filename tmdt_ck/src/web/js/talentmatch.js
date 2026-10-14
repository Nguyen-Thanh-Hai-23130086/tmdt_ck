const jobs = [
    {
        id: "frontend-dev",
        title: "Frontend Developer React",
        company: "NovaTech Solutions",
        type: "Full-time",
        location: "TP.HCM",
        salary: 22000000,
        skills: ["React", "JavaScript", "HTML/CSS"],
        posted: "HÃ´m nay",
        deadline: "30/11/2026",
        sold: 128,
        description: "PhÃ¡t triá»ƒn giao diá»‡n web tuyá»ƒn dá»¥ng, tá»‘i Æ°u tráº£i nghiá»‡m ngÆ°á»i dÃ¹ng vÃ  phá»‘i há»£p cÃ¹ng backend Ä‘á»ƒ tÃ­ch há»£p API.",
        requirements: ["Tá»‘i thiá»ƒu 1 nÄƒm kinh nghiá»‡m React", "Náº¯m vá»¯ng JavaScript ES6+", "Biáº¿t lÃ m responsive UI"],
        benefits: ["LÆ°Æ¡ng thÃ¡ng 13", "Hybrid 3 ngÃ y/tuáº§n", "Review lÆ°Æ¡ng 2 láº§n/nÄƒm"],
        reviews: [
            { name: "Minh Anh", rating: 5, content: "CÃ´ng ty pháº£n há»“i á»©ng tuyá»ƒn nhanh, mÃ´ táº£ cÃ´ng viá»‡c rÃµ rÃ ng." },
            { name: "Quá»‘c Báº£o", rating: 4, content: "Quy trÃ¬nh phá»ng váº¥n gá»n, team ká»¹ thuáº­t thÃ¢n thiá»‡n." }
        ]
    },
    {
        id: "backend-node",
        title: "Backend Node.js Engineer",
        company: "TalentHub Vietnam",
        type: "Full-time",
        location: "HÃ  Ná»™i",
        salary: 28000000,
        skills: ["Node.js", "Express", "PostgreSQL"],
        posted: "2 ngÃ y trÆ°á»›c",
        deadline: "12/12/2026",
        sold: 96,
        description: "XÃ¢y dá»±ng API, tá»‘i Æ°u cÆ¡ sá»Ÿ dá»¯ liá»‡u vÃ  phÃ¡t triá»ƒn cÃ¡c module xÃ¡c thá»±c, phÃ¢n quyá»n, thanh toÃ¡n demo.",
        requirements: ["CÃ³ kinh nghiá»‡m REST API", "Biáº¿t PostgreSQL hoáº·c MySQL", "Æ¯u tiÃªn biáº¿t Prisma"],
        benefits: ["MacBook lÃ m viá»‡c", "Báº£o hiá»ƒm Ä‘áº§y Ä‘á»§", "ÄÃ o táº¡o ká»¹ thuáº­t háº±ng thÃ¡ng"],
        reviews: [
            { name: "Thanh Nam", rating: 5, content: "JD sÃ¡t thá»±c táº¿, má»©c lÆ°Æ¡ng trao Ä‘á»•i minh báº¡ch." }
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
        posted: "1 tuáº§n trÆ°á»›c",
        deadline: "05/12/2026",
        sold: 210,
        description: "Thiáº¿t káº¿ wireframe, prototype vÃ  UI kit cho sáº£n pháº©m web/app trong lÄ©nh vá»±c tuyá»ƒn dá»¥ng.",
        requirements: ["CÃ³ portfolio", "Biáº¿t xÃ¢y dá»±ng design system", "Hiá»ƒu luá»“ng ngÆ°á»i dÃ¹ng"],
        benefits: ["LÃ m viá»‡c remote", "Thanh toÃ¡n theo milestone", "CÃ³ cÆ¡ há»™i há»£p tÃ¡c dÃ i háº¡n"],
        reviews: [
            { name: "HÃ  My", rating: 4, content: "Brief rÃµ rÃ ng, khÃ¡ch hÃ ng pháº£n há»“i lá»‹ch sá»±." }
        ]
    },
    {
        id: "data-analyst",
        title: "Data Analyst Intern",
        company: "Market Insight",
        type: "Internship",
        location: "ÄÃ  Náºµng",
        salary: 6000000,
        skills: ["SQL", "Excel", "Power BI"],
        posted: "3 ngÃ y trÆ°á»›c",
        deadline: "20/11/2026",
        sold: 64,
        description: "Há»— trá»£ tá»•ng há»£p dá»¯ liá»‡u, xÃ¢y dá»±ng dashboard vÃ  phÃ¢n tÃ­ch bÃ¡o cÃ¡o tuyá»ƒn dá»¥ng theo tá»«ng chiáº¿n dá»‹ch.",
        requirements: ["Biáº¿t SQL cÆ¡ báº£n", "ThÃ nh tháº¡o Excel", "TÆ° duy phÃ¢n tÃ­ch tá»‘t"],
        benefits: ["CÃ³ mentor hÆ°á»›ng dáº«n", "Há»— trá»£ dáº¥u thá»±c táº­p", "CÆ¡ há»™i lÃªn chÃ­nh thá»©c"],
        reviews: [
            { name: "Gia Huy", rating: 5, content: "PhÃ¹ há»£p cho sinh viÃªn muá»‘n há»c dá»¯ liá»‡u thá»±c táº¿." }
        ]
    }
];

const candidates = [
    {
        id: "nguyen-minh-anh",
        name: "Nguyá»…n Minh Anh",
        title: "Frontend Developer",
        location: "TP.HCM",
        experience: 2,
        expectedSalary: 20000000,
        skills: ["React", "JavaScript", "HTML/CSS", "Git"],
        status: "Äang tÃ¬m viá»‡c",
        summary: "CÃ³ kinh nghiá»‡m xÃ¢y dá»±ng dashboard, landing page vÃ  há»‡ thá»‘ng quáº£n trá»‹ ná»™i bá»™ báº±ng React.",
        projects: ["Dashboard tuyá»ƒn dá»¥ng", "Trang há»“ sÆ¡ Freelancer", "UI kit ná»™i bá»™"]
    },
    {
        id: "tran-quoc-bao",
        name: "Tráº§n Quá»‘c Báº£o",
        title: "Backend Developer",
        location: "HÃ  Ná»™i",
        experience: 3,
        expectedSalary: 26000000,
        skills: ["Node.js", "Express", "PostgreSQL", "Docker"],
        status: "Sáºµn sÃ ng phá»ng váº¥n",
        summary: "Táº­p trung vÃ o API, xÃ¡c thá»±c, phÃ¢n quyá»n vÃ  tá»‘i Æ°u truy váº¥n cÆ¡ sá»Ÿ dá»¯ liá»‡u.",
        projects: ["API quáº£n lÃ½ Ä‘Æ¡n á»©ng tuyá»ƒn", "Há»‡ thá»‘ng thÃ´ng bÃ¡o", "Module thanh toÃ¡n demo"]
    },
    {
        id: "le-ha-my",
        name: "LÃª HÃ  My",
        title: "UI/UX Designer",
        location: "Remote",
        experience: 4,
        expectedSalary: 18000000,
        skills: ["Figma", "Prototype", "Design System", "User Flow"],
        status: "Nháº­n dá»± Ã¡n freelance",
        summary: "Thiáº¿t káº¿ sáº£n pháº©m SaaS, marketplace vÃ  ná»n táº£ng tuyá»ƒn dá»¥ng vá»›i há»‡ thá»‘ng component rÃµ rÃ ng.",
        projects: ["Talent marketplace", "Mobile banking flow", "Design system tuyá»ƒn dá»¥ng"]
    },
    {
        id: "pham-gia-huy",
        name: "Pháº¡m Gia Huy",
        title: "Data Analyst",
        location: "ÄÃ  Náºµng",
        experience: 1,
        expectedSalary: 12000000,
        skills: ["SQL", "Excel", "Power BI", "Python"],
        status: "Äang tÃ¬m viá»‡c",
        summary: "PhÃ¢n tÃ­ch dá»¯ liá»‡u váº­n hÃ nh, táº¡o dashboard vÃ  bÃ¡o cÃ¡o hiá»‡u suáº¥t chiáº¿n dá»‹ch.",
        projects: ["Dashboard tuyá»ƒn dá»¥ng", "BÃ¡o cÃ¡o funnel á»©ng viÃªn", "PhÃ¢n tÃ­ch dá»¯ liá»‡u bÃ¡n hÃ ng"]
    }
];

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
    return "â˜…".repeat(rating) + "â˜†".repeat(5 - rating);
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
                        <span><strong>Talent<span>Match</span></strong><small>Káº¾T Ná»I TÃ€I NÄ‚NG - KIáº¾N Táº O TÆ¯Æ NG LAI</small></span>
                    </a>
                    <div class="footer-social"><a href="#">f</a><a href="#">in</a><a href="#">â–¶</a><a href="#">â—Ž</a></div>
                </div>
                <div class="footer-col"><h3>DÃ nh cho ngÆ°á»i tÃ¬m viá»‡c</h3><a href="jobs.html">TÃ¬m viá»‡c lÃ m</a><a href="profile.html">Táº¡o há»“ sÆ¡</a><a href="#">HÆ°á»›ng dáº«n</a></div>
                <div class="footer-col"><h3>DÃ nh cho nhÃ  tuyá»ƒn dá»¥ng</h3><a href="#">ÄÄƒng tin tuyá»ƒn dá»¥ng</a><a href="candidates.html">TÃ¬m á»©ng viÃªn</a><a href="#">Báº£ng giÃ¡</a></div>
                <div class="footer-col"><h3>Vá» TalentMatch</h3><a href="#">Giá»›i thiá»‡u</a><a href="#">ChÃ­nh sÃ¡ch báº£o máº­t</a><a href="#">Äiá»u khoáº£n sá»­ dá»¥ng</a></div>
                <div class="footer-col"><h3>Há»— trá»£</h3><a href="#">Trung tÃ¢m trá»£ giÃºp</a><a href="#">CÃ¢u há»i thÆ°á»ng gáº·p</a><a href="#">LiÃªn há»‡</a></div>
                <div class="newsletter"><h3>ÄÄƒng kÃ½ nháº­n tin</h3><form action="#"><input type="email" placeholder="Nháº­p email cá»§a báº¡n"><button type="submit">â†’</button></form><small>Nháº­n tin viá»‡c lÃ m vÃ  cÃ¡c cÆ¡ há»™i má»›i nháº¥t</small></div>
            </div>
            <div class="footer-bottom"><span>Â© 2025 TalentMatch. Táº¥t cáº£ quyá»n Ä‘Æ°á»£c báº£o lÆ°u.</span></div>
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
                <span class="company-logo">${job.company.slice(0, 2).toUpperCase()}</span>
                <div>
                    <h3>${job.title}</h3>
                    <p>${job.company} â€¢ ${job.location} â€¢ ${job.type}</p>
                </div>
            </div>
            <div class="tag-row">${job.skills.map(skill => `<span>${skill}</span>`).join("")}</div>
            <div class="listing-meta">
                <strong>${formatCurrency(job.salary)}</strong>
                <span>ÄÃ£ xem ${job.sold}</span>
            </div>
            <a class="primary-link" href="job-detail.html?id=${job.id}">Xem chi tiáº¿t</a>
        </article>
    `;
}

function candidateCard(candidate) {
    return `
        <article class="listing-card">
            <div class="listing-top">
                <span class="avatar">${candidate.name.split(" ").slice(-1)[0][0]}</span>
                <div>
                    <h3>${candidate.name}</h3>
                    <p>${candidate.title} â€¢ ${candidate.location} â€¢ ${candidate.experience} nÄƒm kinh nghiá»‡m</p>
                </div>
            </div>
            <div class="tag-row">${candidate.skills.map(skill => `<span>${skill}</span>`).join("")}</div>
            <div class="listing-meta">
                <strong>${formatCurrency(candidate.expectedSalary)}</strong>
                <span>${candidate.status}</span>
            </div>
            <a class="primary-link" href="candidate-detail.html?id=${candidate.id}">Xem há»“ sÆ¡</a>
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
    const sort = document.getElementById("jobSort");
    const count = document.getElementById("jobCount");

    function render() {
        let data = jobs.filter(job => {
            const matchKeyword = job.title.toLowerCase().includes(keyword.value.trim().toLowerCase()) ||
                job.company.toLowerCase().includes(keyword.value.trim().toLowerCase());
            const matchSkill = skill.value === "all" || job.skills.includes(skill.value);
            const matchLocation = location.value === "all" || job.location === location.value;
            return matchKeyword && matchSkill && matchLocation;
        });

        if (sort.value === "salaryDesc") data = data.sort((a, b) => b.salary - a.salary);
        if (sort.value === "salaryAsc") data = data.sort((a, b) => a.salary - b.salary);
        if (sort.value === "viewDesc") data = data.sort((a, b) => b.sold - a.sold);

        count.textContent = `${data.length} viá»‡c lÃ m phÃ¹ há»£p`;
        grid.innerHTML = data.length ? data.map(jobCard).join("") : '<div class="empty-state">KhÃ´ng tÃ¬m tháº¥y viá»‡c lÃ m phÃ¹ há»£p.</div>';
    }

    [keyword, skill, location, sort].forEach(control => control.addEventListener("input", render));
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

    function render() {
        let data = candidates.filter(candidate => {
            const matchKeyword = candidate.name.toLowerCase().includes(keyword.value.trim().toLowerCase()) ||
                candidate.title.toLowerCase().includes(keyword.value.trim().toLowerCase());
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

        count.textContent = `${data.length} á»©ng viÃªn phÃ¹ há»£p`;
        grid.innerHTML = data.length ? data.map(candidateCard).join("") : '<div class="empty-state">KhÃ´ng tÃ¬m tháº¥y á»©ng viÃªn phÃ¹ há»£p.</div>';
    }

    [keyword, skill, exp, sort].forEach(control => control.addEventListener("input", render));
    render();
}

function initJobDetailPage() {
    const detail = document.getElementById("jobDetail");
    if (!detail) return;

    const job = jobs.find(item => item.id === getParam("id")) || jobs[0];
    detail.innerHTML = `
        <div class="detail-head">
            <span class="company-logo large">${job.company.slice(0, 2).toUpperCase()}</span>
            <div>
                <p class="eyebrow-mini">${job.company}</p>
                <h1>${job.title}</h1>
                <p>${job.location} â€¢ ${job.type} â€¢ Háº¡n á»©ng tuyá»ƒn ${job.deadline}</p>
            </div>
        </div>
        <div class="tag-row">${job.skills.map(skill => `<span>${skill}</span>`).join("")}</div>
        <div class="detail-grid">
            <section>
                <h2>MÃ´ táº£ cÃ´ng viá»‡c</h2>
                <p>${job.description}</p>
                <h2>YÃªu cáº§u</h2>
                <ul>${job.requirements.map(item => `<li>${item}</li>`).join("")}</ul>
                <h2>Quyá»n lá»£i</h2>
                <ul>${job.benefits.map(item => `<li>${item}</li>`).join("")}</ul>
            </section>
            <aside class="apply-card">
                <strong>${formatCurrency(job.salary)}</strong>
                <p>Má»©c lÆ°Æ¡ng dá»± kiáº¿n</p>
                <button class="primary-button" type="button" id="applyButton">á»¨ng tuyá»ƒn ngay</button>
                <p class="form-message" id="applyMessage"></p>
            </aside>
        </div>
        <section class="reviews-card embedded">
            <div class="section-heading">
                <div>
                    <h2>ÄÃ¡nh giÃ¡ cÃ´ng ty</h2>
                    <p>Nháº­n xÃ©t tá»« á»©ng viÃªn Ä‘Ã£ tá»«ng trao Ä‘á»•i vá»›i cÃ´ng ty.</p>
                </div>
            </div>
            <div class="review-list">
                ${job.reviews.map(review => `
                    <div class="review-item">
                        <strong>${review.name}</strong>
                        <div class="stars">${stars(review.rating)}</div>
                        <p>${review.content}</p>
                    </div>
                `).join("")}
            </div>
        </section>
    `;

    document.getElementById("applyButton").addEventListener("click", () => {
        document.getElementById("applyMessage").textContent = "ÄÃ£ gá»­i há»“ sÆ¡ á»©ng tuyá»ƒn Ä‘áº¿n cÃ´ng ty.";
    });
}

function initCandidateDetailPage() {
    const detail = document.getElementById("candidateDetail");
    if (!detail) return;

    const candidate = candidates.find(item => item.id === getParam("id")) || candidates[0];
    detail.innerHTML = `
        <div class="detail-head">
            <span class="avatar large">${candidate.name.split(" ").slice(-1)[0][0]}</span>
            <div>
                <p class="eyebrow-mini">${candidate.status}</p>
                <h1>${candidate.name}</h1>
                <p>${candidate.title} â€¢ ${candidate.location} â€¢ ${candidate.experience} nÄƒm kinh nghiá»‡m</p>
            </div>
        </div>
        <div class="detail-grid">
            <section>
                <h2>Giá»›i thiá»‡u</h2>
                <p>${candidate.summary}</p>
                <h2>Ká»¹ nÄƒng</h2>
                <div class="tag-row">${candidate.skills.map(skill => `<span>${skill}</span>`).join("")}</div>
                <h2>Dá»± Ã¡n tiÃªu biá»ƒu</h2>
                <ul>${candidate.projects.map(item => `<li>${item}</li>`).join("")}</ul>
            </section>
            <aside class="apply-card">
                <strong>${formatCurrency(candidate.expectedSalary)}</strong>
                <p>Má»©c lÆ°Æ¡ng mong muá»‘n</p>
                <button class="primary-button" type="button" id="inviteButton">Má»i á»©ng tuyá»ƒn</button>
                <p class="form-message" id="inviteMessage"></p>
            </aside>
        </div>
    `;

    document.getElementById("inviteButton").addEventListener("click", () => {
        document.getElementById("inviteMessage").textContent = "ÄÃ£ gá»­i lá»i má»i á»©ng tuyá»ƒn Ä‘áº¿n á»©ng viÃªn.";
    });
}

function initProfilePage() {
    const form = document.getElementById("profileForm");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();
        document.getElementById("profileMessage").textContent = "ÄÃ£ cáº­p nháº­t thÃ´ng tin tÃ i khoáº£n.";
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
