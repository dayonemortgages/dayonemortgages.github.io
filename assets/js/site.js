(function () {
    const includeTargets = [
        { selector: "#site-header", url: "/partials/header.html" },
        { selector: "#site-footer", url: "/partials/footer.html" }
    ];

    const ready = Promise.all(includeTargets.map(async ({ selector, url }) => {
        const target = document.querySelector(selector);
        if (!target) return;

        const response = await fetch(url, { cache: "no-cache" });
        if (!response.ok) throw new Error(`Unable to load ${url}`);
        target.innerHTML = await response.text();
    })).catch((error) => {
        console.error(error);
    });

    ready.then(() => {
        initNavigation();
        initCurrentYear();
        initFadeInSections();
        initTestimonials();
        initW3FormsForm();
    });

    function initNavigation() {
        const button = document.getElementById("mobile-menu-button");
        const menu = document.getElementById("mobile-menu");
        const currentPath = normalizePath(window.location.pathname);

        document.querySelectorAll("[data-nav-link]").forEach((link) => {
            const linkPath = normalizePath(new URL(link.getAttribute("href"), window.location.origin).pathname);
            if (linkPath === currentPath) {
                link.setAttribute("aria-current", "page");
            }
        });

        document.querySelectorAll("[data-team-lang-link]").forEach((link) => {
            const linkPath = normalizePath(new URL(link.getAttribute("href"), window.location.origin).pathname);
            if (linkPath === currentPath) {
                link.setAttribute("aria-current", "page");
            }
        });

        if (!button || !menu) return;

        button.addEventListener("click", () => {
            const isOpen = button.getAttribute("aria-expanded") === "true";
            button.setAttribute("aria-expanded", String(!isOpen));
            menu.classList.toggle("is-open", !isOpen);
            document.body.classList.toggle("menu-open", !isOpen);
        });

        menu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                button.setAttribute("aria-expanded", "false");
                menu.classList.remove("is-open");
                document.body.classList.remove("menu-open");
            });
        });
    }

    function normalizePath(path) {
        if (path === "/" || path === "") return "/";
        return path.replace(/\/+$/, "");
    }

    function initCurrentYear() {
        document.querySelectorAll("[data-current-year]").forEach((node) => {
            node.textContent = String(new Date().getFullYear());
        });
    }

    function initFadeInSections() {
        const sections = document.querySelectorAll(".fade-in-section");
        if (!sections.length) return;

        if (!("IntersectionObserver" in window)) {
            sections.forEach((section) => section.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        sections.forEach((section) => observer.observe(section));
    }

    function initTestimonials() {
        const shell = document.querySelector("[data-testimonials]");
        if (!shell) return;

        const track = shell.querySelector("[data-testimonial-track]");
        const cards = Array.from(shell.querySelectorAll("[data-testimonial-card]"));
        const prev = shell.querySelector("[data-testimonial-prev]");
        const next = shell.querySelector("[data-testimonial-next]");
        const dotsRoot = shell.querySelector("[data-testimonial-dots]");
        let index = 0;

        if (!track || cards.length < 2 || !dotsRoot) return;

        cards.forEach((_, dotIndex) => {
            const dot = document.createElement("button");
            dot.className = "slider-dot";
            dot.type = "button";
            dot.setAttribute("aria-label", `Show slide ${dotIndex + 1}`);
            dot.addEventListener("click", () => update(dotIndex));
            dotsRoot.append(dot);
        });

        prev?.addEventListener("click", () => update(index - 1));
        next?.addEventListener("click", () => update(index + 1));

        update(0);

        function update(nextIndex) {
            index = (nextIndex + cards.length) % cards.length;
            track.style.transform = `translateX(-${index * 100}%)`;
            cards.forEach((card, cardIndex) => {
                card.setAttribute("aria-hidden", String(cardIndex !== index));
            });
            Array.from(dotsRoot.children).forEach((dot, dotIndex) => {
                dot.setAttribute("aria-current", String(dotIndex === index));
            });
        }
    }

    function initW3FormsForm() {
        const form = document.querySelector("[data-w3forms-form]");
        if (!form) return;

        const status = form.querySelector("[data-form-status]");

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (form.elements.website?.value || form.elements.botcheck?.checked) {
                setFormStatus(status, "Thanks. Your enquiry has been received.", "success");
                return;
            }

            setFormStatus(status, "Sending your enquiry...", "pending");

            try {
                const response = await fetch(form.action, {
                    method: "POST",
                    headers: {
                        Accept: "application/json"
                    },
                    body: new FormData(form)
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Unable to send enquiry.");
                }

                form.reset();
                setFormStatus(status, "Thanks. Your enquiry has been sent.", "success");
            } catch (error) {
                setFormStatus(status, "Sorry, your enquiry could not be sent. Please email Ben directly.", "error");
            }
        });
    }

    function setFormStatus(status, message, state) {
        if (!status) return;
        status.textContent = message;
        status.dataset.state = state;
    }
})();
