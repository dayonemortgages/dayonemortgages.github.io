(function () {
    const root = document.querySelector("[data-team-page]");
    if (!root) return;

    const grid = root.querySelector("[data-team-grid]");
    const profiles = window.DayOneTeamProfiles || [];
    const language = root.dataset.lang || "en";

    if (!grid || !profiles.length) return;

    grid.innerHTML = profiles.map((profile) => renderProfile(profile, language)).join("");

    function renderProfile(profile, languageCode) {
        const content = profile.content[languageCode] || profile.content.en;
        const displayName = content.alternateName ? `${content.name} (a.k.a ${content.alternateName})` : content.name;
        const paragraphs = content.paragraphs.map((paragraph) => `<p class="person-bio">${escapeHtml(paragraph)}</p>`).join("");
        const image = profile.image ? `
            <img class="person-photo-image" src="${escapeAttribute(profile.image)}" alt="${escapeAttribute(displayName)}" loading="lazy">
        ` : `
            <div class="person-photo-slot-text">Photo placeholder</div>
        `;

        return `
            <article class="card person-card">
                <div class="person-layout">
                    <div class="person-photo">
                        <div class="person-photo-slot">
                            ${image}
                        </div>
                    </div>
                    <div class="person-copy">
                        <div class="person-heading">
                            <h2>${escapeHtml(displayName)}</h2>
                            <p class="person-kicker">${escapeHtml(content.role)}</p>
                        </div>
                        ${paragraphs}
                        <div class="person-links">
                            <a class="person-link-chip" href="mailto:${escapeAttribute(profile.email)}">
                                <span>Email</span>
                                <strong>${escapeHtml(profile.email)}</strong>
                            </a>
                            <a class="person-link-chip" href="tel:${escapeAttribute(profile.phoneHref)}">
                                <span>Phone</span>
                                <strong>${escapeHtml(profile.phone)}</strong>
                            </a>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }

    function escapeAttribute(value) {
        return escapeHtml(value).replaceAll("`", "&#96;");
    }
})();
