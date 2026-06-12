const loader = document.querySelector("#loader");
const scrollProgress = document.querySelector("#scroll-progress");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const showcaseButtons = document.querySelectorAll("[data-showcase]");
const showcasePanels = document.querySelectorAll("[data-showcase-panel]");
const projectOpenButtons = document.querySelectorAll("[data-project-open]");
const projectCards = document.querySelectorAll("[data-project-card]");
const projectSections = document.querySelectorAll(".project-section");
const projectThumbs = document.querySelectorAll("[data-project-thumb]");
const cinematicScenes = document.querySelectorAll(".apple-product-story .scene-panel");
const gallerySection = document.querySelector("#project-gallery");
const galleryCarousel = document.querySelector("#gallery-carousel");
const galleryTitle = document.querySelector("#gallery-title");
const galleryKicker = document.querySelector("#gallery-kicker");
const galleryDescription = document.querySelector("#gallery-description");
const galleryOverview = document.querySelector("#gallery-overview");
const galleryTech = document.querySelector("#gallery-tech");
const galleryResults = document.querySelector("#gallery-results");
const galleryStep = document.querySelector("#gallery-step");
const galleryFeature = document.querySelector("#gallery-feature");
const galleryFeatureDetail = document.querySelector("#gallery-feature-detail");
const galleryPrev = document.querySelector("#gallery-prev");
const galleryNext = document.querySelector("#gallery-next");
const dashnexusImages = [
    "/image/dashnexus-01.jpg",
    "/image/dashnexus-02.jpg",
    "/image/dashnexus-03.jpg",
    "/image/dashnexus-04.jpg",
    "/image/dashnexus-05.jpg",
    "/image/dashnexus-06.jpg"
];

const societyImages = [
    "/image/Society-1.png",
    "/image/Society-2.png",
    "/image/Society-3.png",
    "/image/Society-4.png",
    "/image/Society-5.png",
    "/image/Society-6.png",
    "/image/Society-7.png",
    "/image/Society-8.png",
    "/image/Society-9.png"
];

const travelImages = [
    "/image/travel-01.png",
    "/image/travel-02.png",
    "/image/travel-03.png",
    "/image/travel-04.png",
    "/image/travel-05.png",
    "/image/travel-06.png"
];

const projectImages = {
    dashnexus: dashnexusImages,
    society: societyImages,
    travel: travelImages,
};

const projectGalleryData = {
    dashnexus: {
        kicker: "AI Analytics Product Demo",
        title: "DashNexus AI Analytics Case Study",
        description: "From landing page to management console, DashNexus is presented as a premium AI analytics product with cinematic monitor-led storytelling.",
        overview: "DashNexus turns spreadsheet data into cleaned datasets, chart recommendations, dashboards, analytics summaries, and management-ready reporting views.",
        results: ["75% faster reporting setup", "98% data readiness target", "Hackathon first runner-up recognition"],
        tech: ["Django", "Gemini", "LangChain", "LangGraph", "Plotly", "Scikit-Learn"],
        screens: [
            ["Home Page", "A confident product landing page that positions DashNexus as an AI analytics platform for teams moving from raw files to decisions."],
            ["Upload Dataset", "A guided import flow for CSV and Excel files with immediate context around readiness, schema, and next steps."],
            ["Chart Selection", "A focused chart recommendation experience that helps users select the best visualization for their dataset."],
            ["Dashboard View", "A central workspace for KPIs, generated charts, and the primary insights users need to act quickly."],
            ["Statistics & Analytics Charts", "A deeper analytics layer for trends, segments, statistical summaries, and performance comparisons."],
            ["Management Console", "A control surface for managing analysis sessions, exports, workspace context, and operational product settings."]
        ]
    },
    society: {
        kicker: "Residential SaaS Product Demo",
        title: "Smart Society Management Case Study",
        description: "A full residential SaaS story covering landing, society selection, role dashboards, billing, residents, security, complaints, and responsive theming.",
        overview: "Smart Society Management System centralizes residential operations across societies, admins, residents, security teams, billing, notices, and support workflows.",
        results: ["Multi-role SaaS foundation", "70-75% production-ready platform", "Unified residential operations"],
        tech: ["React", "Vite", "Node.js", "Express", "PostgreSQL", "JWT", "Brevo SMTP"],
        screens: [
            ["Landing Page / Home Page", "A polished entry point that explains the platform, trust signals, and core society operations in one clear story."],
            ["Smart Analytics & AI Command Center", "Real-time analytics for collections, occupancy, complaints, and resident engagement."],
            ["Super Admin Dashboard", "A global control layer for managing societies, administrators, activity, and platform-wide operational health."],
            ["Chairman / Secretary Dashboard", "Role-specific dashboards that surface society-level tasks, approvals, resident updates, and daily management actions."],
            ["Billing & Payments Module", "A billing workspace for dues, invoices, payment visibility, and financial follow-up across flats and residents."],
            ["Flats & Resident Management", "A structured management view for flats, owners, tenants, resident records, documents, and occupancy details."],
            ["Visitor & Security Dashboard", "A security-focused console for visitor logs, entry approvals, staff movement, and gate operations."],
            ["Complaints & Notices Management", "A communication and resolution hub for complaints, announcements, status tracking, and resident updates."],
            ["Theme Settings / Mobile Responsive View", "A responsive, theme-aware experience that keeps the platform usable across desktop, tablet, and mobile workflows."]
        ]
    },
    travel: {
        kicker: "Travel SaaS Product Demo",
        title: "Tour & Travel Platform Case Study",
        description: "A polished travel product presentation covering admin operations, public discovery, destination browsing, callback requests, and contact conversion.",
        overview: "The Tour & Travel Platform combines an elegant customer-facing website with practical admin workflows for destinations, tours, lead capture, and customer communication.",
        results: ["Cleaner tour discovery funnel", "Centralized callback request handling", "Premium travel brand presentation"],
        tech: ["React", "JavaScript", "Node.js", "Admin Dashboard", "Lead Workflow", "Responsive UI"],
        screens: [
            ["Admin Dashboard", "A management workspace for reviewing platform activity, tour operations, requests, and business follow-up."],
            ["Home Page", "A premium travel homepage that introduces destinations, experiences, and calls to action with clear visual hierarchy."],
            ["Tours & Destinations Page", "A browsing experience for travel packages and destinations designed for discovery and comparison."],
            ["Callback Requests Page", "A lead-management view for tracking callback requests, customer interest, and follow-up status."],
            ["Contact Page", "A conversion-focused contact screen that gives customers a simple path to reach the travel team."]
        ]
    }
};

let activeGalleryProject = "society";
let activeGalleryIndex = 0;
let dragStartX = 0;
let isDraggingGallery = false;

window.addEventListener("load", () => {
    window.setTimeout(() => {
        loader.classList.add("is-hidden");
    }, 650);
});

const savedTheme = localStorage.getItem("nexora-theme");
if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeIcon.textContent = "Light";
}

themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-mode");
    localStorage.setItem("nexora-theme", isLight ? "light" : "dark");
    themeIcon.textContent = isLight ? "Light" : "Dark";
});

// Mobile navigation
menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("is-open");
    navLinks.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((link) => {
    link.addEventListener("click", () => {
        menuToggle.classList.remove("is-open");
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

// Scroll-triggered reveal and animated statistics
const animateCounter = (counter) => {
    const target = Number(counter.dataset.count);
    const suffixMap = {
        3: "",
        8: "",
        75: "%",
        98: "%",
        24: "/7",
    };
    const suffix = suffixMap[target] ?? "+";
    const duration = 1100;
    const startTime = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = `${value}${suffix}`;

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    };

    requestAnimationFrame(tick);
};

const createGalleryScreen = (screen, index) => {
    const panel = document.createElement("article");
    panel.className = "gallery-story-row reveal";
    panel.dataset.galleryIndex = String(index);
    panel.innerHTML = `
        <div class="monitor-showcase">
            <div class="desktop-monitor" aria-label="${screen.name} screenshot displayed in desktop monitor mockup">
                <div class="monitor-frame">
                    <div class="monitor-camera"></div>
                    <div class="monitor-screen">
                        <img src="${screen.src}" alt="${screen.name} project screenshot" loading="lazy">
                    </div>
                </div>
                <div class="monitor-neck"></div>
                <div class="monitor-stand"></div>
            </div>
        </div>
        <div class="gallery-feature-card">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <h2>${screen.name}</h2>
            <p>${screen.detail}</p>
        </div>
    `;

    panel.addEventListener("click", () => {
        activeGalleryIndex = index;
        renderGallery();
    });

    attachScreenshotState(panel.querySelector("img"));
    return panel;
};

const getGalleryScreens = (project) => {
    const data = projectGalleryData[project] ?? projectGalleryData.society;
    const images = projectImages[project] ?? societyImages;

    return Array.from({ length: data.screens.length }, (_, index) => {
        const [name, detail] = data.screens[index] ?? [`Feature ${index + 1}`, "A premium product screenshot presented inside a realistic floating monitor mockup."];

        return {
            name,
            detail,
            src: images[index],
        };
    });
};

const attachScreenshotState = (image) => {
    if (!image) {
        return;
    }

    image.addEventListener("error", () => {
        const frame = image.closest(".monitor-screen, .project-thumb-screen");
        const label = image.alt || "project screenshot";
        console.error(`Missing screenshot for ${label}: ${image.getAttribute("src")}`);
        frame?.classList.add("is-missing");
    });

    image.addEventListener("load", () => {
        const frame = image.closest(".monitor-screen, .project-thumb-screen");
        frame?.classList.add("has-image");
    });
};

const renderProjectThumbs = () => {
    projectThumbs.forEach((thumb) => {
        const project = thumb.dataset.projectThumb;
        const image = projectImages[project]?.[0];
        const screen = thumb.querySelector(".project-thumb-screen");

        if (!screen || !image) {
            return;
        }

        screen.innerHTML = `
            <img src="${image}" alt="${project} screenshot preview" loading="lazy">
        `;
        attachScreenshotState(screen.querySelector("img"));
    });
};

const renderGallery = () => {
    if (!galleryCarousel) {
        return;
    }

    const project = projectGalleryData[activeGalleryProject] ?? projectGalleryData.society;
    const screens = getGalleryScreens(activeGalleryProject);

    galleryTitle.textContent = project.title;
    galleryKicker.textContent = project.kicker;
    galleryDescription.textContent = project.description;
    galleryOverview.innerHTML = `<span>Overview</span><p>${project.overview}</p>`;
    galleryTech.innerHTML = project.tech.map((item) => `<span>${item}</span>`).join("");
    galleryResults.innerHTML = project.results.map((item) => `<article>${item}</article>`).join("");

    if (galleryCarousel.children.length !== screens.length || galleryCarousel.dataset.project !== activeGalleryProject) {
        galleryCarousel.innerHTML = "";
        galleryCarousel.dataset.project = activeGalleryProject;
        screens.forEach((screen, index) => {
            const item = createGalleryScreen(screen, index);
            galleryCarousel.appendChild(item);
            revealObserver.observe(item);
        });
    }

    screens.forEach((screen, index) => {
        const item = galleryCarousel.children[index];
        item.classList.toggle("is-active", index === activeGalleryIndex);
    });

    const activeScreen = screens[activeGalleryIndex];
    galleryStep.textContent = `${String(activeGalleryIndex + 1).padStart(2, "0")} / ${String(screens.length).padStart(2, "0")}`;
    galleryFeature.textContent = activeScreen.name;
    galleryFeatureDetail.textContent = activeScreen.detail;
};

const moveGallery = (direction) => {
    const project = projectGalleryData[activeGalleryProject] ?? projectGalleryData.society;
    activeGalleryIndex = (activeGalleryIndex + direction + project.screens.length) % project.screens.length;
    renderGallery();
    galleryCarousel?.children[activeGalleryIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
};

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");

            if (entry.target.querySelectorAll) {
                entry.target.querySelectorAll("[data-count]").forEach((counter) => {
                    if (!counter.dataset.animated) {
                        counter.dataset.animated = "true";
                        animateCounter(counter);
                    }
                });
            }

            revealObserver.unobserve(entry.target);
        });
    },
    {
        threshold: 0.16,
        rootMargin: "0px 0px -42px 0px",
    }
);

revealItems.forEach((item) => revealObserver.observe(item));

// Active navigation state
const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            navItems.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    },
    {
        threshold: 0.52,
    }
);

sections.forEach((section) => sectionObserver.observe(section));

// Interactive project showcase
showcaseButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const target = button.dataset.showcase;

        showcaseButtons.forEach((item) => {
            item.classList.toggle("active", item === button);
        });

        showcasePanels.forEach((panel) => {
            panel.classList.toggle("active", panel.dataset.showcasePanel === target);
        });
    });
});

projectOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const target = button.dataset.projectOpen;

        window.location.hash = `showcase-${target}`;

        projectCards.forEach((card) => {
            card.classList.toggle("is-selected", card.dataset.projectCard === target);
        });
    });
});

projectCards.forEach((card) => {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");

    const openCard = () => {
        const target = card.dataset.projectCard;
        window.location.hash = `showcase-${target}`;
    };

    card.addEventListener("click", (event) => {
        if (event.target.closest("button, a")) {
            return;
        }

        openCard();
    });

    card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openCard();
        }
    });
});

const showProjectRoute = () => {
    const hash = window.location.hash.replace("#", "");
    const legacyProjectMap = {
        "case-dashnexus": "dashnexus",
        "dashnexus": "dashnexus",
        "case-society": "society",
        "society": "society",
        "travel": "travel",
    };
    const legacyProject = Object.entries(legacyProjectMap).find(([prefix]) => hash === prefix || hash.startsWith(`${prefix}-`))?.[1];
    const route = hash.startsWith("showcase-") || legacyProject ? "project-gallery" : hash;
    const activeProject = Array.from(projectSections).find((section) => section.id === route);

    document.body.classList.toggle("case-study-mode", Boolean(activeProject));
    document.body.classList.toggle("gallery-mode", route === "project-gallery");

    if (route === "project-gallery") {
        activeGalleryProject = legacyProject || hash.replace("showcase-", "") || "society";
        activeGalleryIndex = 0;
        renderGallery();
    }

    projectSections.forEach((section) => {
        const isActive = section === activeProject;
        section.hidden = !isActive;
        section.classList.toggle("case-active", isActive);

        if (isActive) {
            section.querySelectorAll(".reveal").forEach((item) => {
                if (route === "project-gallery" && item.classList.contains("gallery-story-row")) {
                    revealObserver.observe(item);
                    return;
                }

                item.classList.add("is-visible");
            });
            section.querySelectorAll("[data-count]").forEach((counter) => {
                if (!counter.dataset.animated) {
                    counter.dataset.animated = "true";
                    animateCounter(counter);
                }
            });

            const anchorTarget = hash !== route ? document.getElementById(hash) : null;
            if (anchorTarget) {
                anchorTarget.scrollIntoView({ behavior: "smooth", block: "start" });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    });

    if (!activeProject) {
        projectSections.forEach((section) => {
            section.hidden = true;
            section.classList.remove("case-active");
        });
    }
};

window.addEventListener("hashchange", showProjectRoute);
showProjectRoute();
renderProjectThumbs();

const updateScrollProgress = () => {
    if (!scrollProgress) {
        return;
    }

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    scrollProgress.style.transform = `scaleX(${Math.min(Math.max(progress, 0), 1)})`;
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

const updateCinematicScenes = () => {
    if (!document.body.classList.contains("case-study-mode")) {
        return;
    }

    const viewportCenter = window.innerHeight / 2;

    cinematicScenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
        const depth = (0.5 - progress) * 120;
        const isCurrent = rect.top < viewportCenter && rect.bottom > viewportCenter;

        scene.style.setProperty("--scene-depth", `${depth}px`);
        scene.classList.toggle("is-current", isCurrent);
    });
};

window.addEventListener("scroll", updateCinematicScenes, { passive: true });
window.addEventListener("resize", updateCinematicScenes);
updateCinematicScenes();

if (galleryPrev && galleryNext && gallerySection) {
    galleryPrev.addEventListener("click", () => moveGallery(-1));
    galleryNext.addEventListener("click", () => moveGallery(1));

    gallerySection.addEventListener("wheel", (event) => {
        if (!document.body.classList.contains("gallery-mode")) {
            return;
        }
    }, { passive: true });

    gallerySection.addEventListener("pointerdown", (event) => {
        if (event.target.closest("[data-back-home]")) {
            return;
        }

        isDraggingGallery = true;
        dragStartX = event.clientX;
        gallerySection.setPointerCapture(event.pointerId);
    });

    gallerySection.addEventListener("pointerup", (event) => {
        if (!isDraggingGallery) {
            return;
        }

        const delta = event.clientX - dragStartX;
        isDraggingGallery = false;

        if (Math.abs(delta) > 34) {
            moveGallery(delta < 0 ? 1 : -1);
        }
    });

    gallerySection.addEventListener("pointercancel", () => {
        isDraggingGallery = false;
    });
}

const isBackHomeButton = (target) => target instanceof Element ? target.closest("[data-back-home]") : null;

const navigateHomeToProjects = () => {
    document.body.classList.remove("case-study-mode", "gallery-mode");
    projectSections.forEach((section) => {
        section.hidden = true;
        section.classList.remove("case-active");
    });

    try {
        history.pushState(null, "", `${window.location.pathname}${window.location.search}`);
        const projectsSection = document.querySelector("#projects");

        if (!projectsSection) {
            window.location.hash = "projects";
            return;
        }

        requestAnimationFrame(() => {
            try {
                projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
            } catch (error) {
                projectsSection.scrollIntoView();
            }
        });
    } catch (error) {
        window.location.hash = "projects";
    }
};

document.addEventListener("pointerdown", (event) => {
    const backLink = isBackHomeButton(event.target);

    if (!backLink) {
        return;
    }

    event.stopPropagation();
}, true);

document.addEventListener("click", (event) => {
    const backLink = isBackHomeButton(event.target);

    if (!backLink) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    navigateHomeToProjects();
}, true);

window.addEventListener("keydown", (event) => {
    if (!document.body.classList.contains("gallery-mode")) {
        return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        moveGallery(1);
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        moveGallery(-1);
    }
});

const openInquiryEmail = (payload) => {
    const lines = [
        `Name: ${payload.name || ""}`,
        `Email: ${payload.email || ""}`,
        `Phone: ${payload.phone || ""}`,
        `Company: ${payload.company || ""}`,
        `Project Type: ${payload.projectType || ""}`,
        `Budget: ${payload.budget || ""}`,
        "",
        "Project Requirement:",
        payload.message || ""
    ];
    const subject = encodeURIComponent(`New project inquiry from ${payload.name || "website visitor"}`);
    const body = encodeURIComponent(lines.join("\n"));

    window.location.href = `mailto:hello@nexoratechnologies.com?subject=${subject}&body=${body}`;
};

contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector("button[type='submit']");
    const payload = Object.fromEntries(new FormData(contactForm).entries());

    formStatus.textContent = "Submitting your inquiry...";
    formStatus.classList.remove("is-error");
    submitButton.disabled = true;

    try {
        const response = await fetch("/api/leads", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const responseText = await response.text();
        let data = {};
        let parsedJson = false;

        if (responseText) {
            try {
                data = JSON.parse(responseText);
                parsedJson = true;
            } catch {
                data = { message: responseText };
            }
        }

        if (!response.ok) {
            if (data.message) {
                throw new Error(data.message);
            }

            if (response.status === 404 || response.status === 405) {
                openInquiryEmail(payload);
                formStatus.textContent = "Your email app is opening with the inquiry details. Please send the email to complete submission.";
                return;
            }

            throw new Error(`Unable to submit inquiry. Server returned ${response.status}.`);
        }

        if (responseText && !parsedJson) {
            throw new Error("The contact API returned an unexpected response. Please try again from the Express server.");
        }

        formStatus.textContent = "Thank you. Nexora Technologies will review your inquiry shortly.";
        contactForm.reset();
    } catch (error) {
        if (error instanceof TypeError) {
            openInquiryEmail(payload);
            formStatus.textContent = "Your email app is opening with the inquiry details. Please send the email to complete submission.";
            return;
        }

        formStatus.textContent = error.message || "Something went wrong. Please email hello@nexoratechnologies.com.";
        formStatus.classList.add("is-error");
    } finally {
        submitButton.disabled = false;
    }
});
