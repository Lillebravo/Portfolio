const uiTranslations = {
  sv: {
    brandSubtitle: "Anteckningar från bygget",
    portfolioLink: "Portfolio",
    articlesLink: "Artiklar",
    eyebrow: "UTVECKLING · AUTOMATISERING · DIGITAL AFFÄR",
    heading: "Praktiska tankar om teknik som ska fungera i verkligheten.",
    intro: "Här skriver jag om besluten bakom snabba webbplatser, smartare arbetsflöden och lösningar som är möjliga att förvalta även efter lanseringen.",
    writtenBy: "Skrivet av",
    authorRole: "Fullstackutvecklare och grundare av ScaleWeb Solutions",
    collection: "SAMLINGEN",
    latest: "Senaste artiklarna",
    all: "Alla",
    readArticle: "Läs artikeln",
    minRead: "min läsning",
    empty: "Inga artiklar matchar filtret.",
    back: "Alla artiklar",
    shareLabel: "Dela artikeln",
    copyLink: "Kopiera länk",
    copied: "Länken är kopierad.",
    discussion: "DISKUSSION",
    comments: "Kommentarer",
    localNotice: "Kommentarer sparas endast i den här webbläsaren.",
    nameLabel: "Namn",
    emailLabel: "E-post (visas inte)",
    commentLabel: "Kommentar",
    publish: "Publicera kommentar",
    commentSaved: "Kommentaren har sparats på den här enheten.",
    noComments: "Bli den första att lämna en kommentar.",
    deleteComment: "Ta bort",
    footerText: "Teknik, affär och det praktiska arbetet däremellan.",
    themeLabel: "Växla färgtema",
    languageLabel: "Byt till engelska",
    filterLabel: "Filtrera artiklar",
    pageTitle: "Anteckningar från bygget | Jerry Lundahl"
  },
  en: {
    brandSubtitle: "Notes from the build",
    portfolioLink: "Portfolio",
    articlesLink: "Articles",
    eyebrow: "DEVELOPMENT · AUTOMATION · DIGITAL BUSINESS",
    heading: "Practical thoughts on technology built to work in the real world.",
    intro: "I write about the decisions behind fast websites, smarter workflows, and solutions that remain manageable after launch.",
    writtenBy: "Written by",
    authorRole: "Full-stack developer and founder of ScaleWeb Solutions",
    collection: "THE COLLECTION",
    latest: "Latest articles",
    all: "All",
    readArticle: "Read article",
    minRead: "min read",
    empty: "No articles match this filter.",
    back: "All articles",
    shareLabel: "Share article",
    copyLink: "Copy link",
    copied: "Link copied.",
    discussion: "DISCUSSION",
    comments: "Comments",
    localNotice: "Comments are stored only in this browser.",
    nameLabel: "Name",
    emailLabel: "Email (not displayed)",
    commentLabel: "Comment",
    publish: "Post comment",
    commentSaved: "Your comment was saved on this device.",
    noComments: "Be the first to leave a comment.",
    deleteComment: "Delete",
    footerText: "Technology, business, and the practical work in between.",
    themeLabel: "Toggle color theme",
    languageLabel: "Switch to Swedish",
    filterLabel: "Filter articles",
    pageTitle: "Notes from the build | Jerry Lundahl"
  }
};

const articleIds = ["article1", "article2", "article3"];
const articleDates = {
  article1: "2026-08-25",
  article2: "2026-08-18",
  article3: "2026-08-11"
};
const state = {
  language: localStorage.getItem("language") || "sv",
  translations: {},
  filter: "all",
  activeArticle: null
};

const elements = {};

async function loadTranslations(language) {
  if (state.translations[language]) return;
  const response = await fetch(`../lang/${language}.json`);
  if (!response.ok) throw new Error(`Could not load ${language} translations.`);
  state.translations[language] = await response.json();
}

function ui(key) {
  return uiTranslations[state.language][key];
}

function articleValue(articleId, field) {
  return state.translations[state.language]?.[`${articleId}.${field}`] || "";
}

function getReadingMinutes(articleId) {
  const text = articleValue(articleId, "body").replace(/<[^>]+>/g, " ").trim();
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
}

function getPublishedDate(articleId) {
  return new Intl.DateTimeFormat(state.language === "sv" ? "sv-SE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${articleDates[articleId]}T00:00:00Z`));
}

function applyTheme() {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = savedTheme ? savedTheme === "dark" : prefersDark;
  document.body.classList.toggle("dark-mode", isDark);
  elements.themeToggle.textContent = isDark ? "☀" : "☾";
  elements.themeToggle.setAttribute("aria-label", ui("themeLabel"));
  elements.themeToggle.title = ui("themeLabel");
}

function applyInterfaceLanguage() {
  document.documentElement.lang = state.language;
  document.title = ui("pageTitle");
  document.querySelectorAll("[data-ui]").forEach((element) => {
    const value = ui(element.dataset.ui);
    if (value) element.textContent = value;
  });
  elements.languageToggle.textContent = state.language === "sv" ? "EN" : "SV";
  elements.languageToggle.setAttribute("aria-label", ui("languageLabel"));
  elements.categoryFilters.setAttribute("aria-label", ui("filterLabel"));
  applyTheme();
  renderFilters();
  renderPosts();
  if (state.activeArticle) renderArticle(state.activeArticle);
}

function getCategories() {
  return articleIds.map((id) => articleValue(id, "meta"));
}

function renderFilters() {
  const categories = getCategories();
  elements.categoryFilters.replaceChildren();
  ["all", ...articleIds].forEach((filterId, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-button";
    button.dataset.filter = filterId;
    button.setAttribute("aria-pressed", String(state.filter === filterId));
    button.textContent = filterId === "all" ? ui("all") : categories[index - 1];
    button.addEventListener("click", () => {
      state.filter = filterId;
      renderFilters();
      renderPosts();
    });
    elements.categoryFilters.append(button);
  });
}

function createPostCard(articleId, index) {
  const card = document.createElement("article");
  card.className = "post-card";
  card.dataset.number = String(index + 1).padStart(2, "0");

  const category = document.createElement("p");
  category.className = "post-category";
  category.textContent = articleValue(articleId, "meta");

  const title = document.createElement("h3");
  title.textContent = articleValue(articleId, "title");

  const summary = document.createElement("p");
  summary.className = "post-summary";
  summary.textContent = articleValue(articleId, "copy");

  const footer = document.createElement("div");
  footer.className = "post-footer";

  const readingTime = document.createElement("span");
  readingTime.textContent = `${getPublishedDate(articleId)} · ${getReadingMinutes(articleId)} ${ui("minRead")}`;

  const openButton = document.createElement("button");
  openButton.type = "button";
  openButton.className = "post-open";
  openButton.textContent = `${ui("readArticle")} →`;
  openButton.addEventListener("click", () => openArticle(articleId));

  footer.append(readingTime, openButton);
  card.append(category, title, summary, footer);
  return card;
}

function renderPosts() {
  elements.postGrid.replaceChildren();
  const visibleIds = state.filter === "all" ? articleIds : [state.filter];
  visibleIds.forEach((articleId) => {
    elements.postGrid.append(createPostCard(articleId, articleIds.indexOf(articleId)));
  });
  elements.emptyState.hidden = visibleIds.length > 0;
}

function openArticle(articleId, updateHash = true) {
  if (!articleIds.includes(articleId)) return;
  state.activeArticle = articleId;
  renderArticle(articleId);
  elements.blogHome.hidden = true;
  elements.blogIndex.hidden = true;
  elements.readingView.hidden = false;
  if (updateHash) history.pushState({ articleId }, "", `#${articleId}`);
  window.scrollTo({ top: 0, behavior: "instant" });
}

function closeArticle(updateHistory = true) {
  state.activeArticle = null;
  elements.readingView.hidden = true;
  elements.blogHome.hidden = false;
  elements.blogIndex.hidden = false;
  elements.readingProgress.style.width = "0";
  if (updateHistory) history.pushState({}, "", window.location.pathname);
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderArticle(articleId) {
  elements.readingCategory.textContent = articleValue(articleId, "meta");
  elements.readingTitle.textContent = articleValue(articleId, "title");
  elements.readingDeck.textContent = articleValue(articleId, "copy");
  elements.readingMeta.textContent = `${getPublishedDate(articleId)} · ${getReadingMinutes(articleId)} ${ui("minRead")}`;
  elements.articleCopy.innerHTML = articleValue(articleId, "body");
  elements.copyStatus.textContent = "";
  renderComments();
}

function commentsKey() {
  return `blog-comments-${state.activeArticle}`;
}

function getComments() {
  try {
    return JSON.parse(localStorage.getItem(commentsKey())) || [];
  } catch {
    return [];
  }
}

function saveComments(comments) {
  localStorage.setItem(commentsKey(), JSON.stringify(comments));
}

function renderComments() {
  const comments = getComments();
  elements.commentCount.textContent = comments.length;
  elements.commentList.replaceChildren();

  if (!comments.length) {
    const empty = document.createElement("p");
    empty.className = "no-comments";
    empty.textContent = ui("noComments");
    elements.commentList.append(empty);
    return;
  }

  comments.slice().reverse().forEach((comment) => {
    const item = document.createElement("article");
    item.className = "comment-item";

    const avatar = document.createElement("span");
    avatar.className = "comment-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = comment.name.trim().charAt(0).toUpperCase();

    const content = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = comment.name;
    const time = document.createElement("time");
    time.dateTime = comment.createdAt;
    time.textContent = new Intl.DateTimeFormat(state.language === "sv" ? "sv-SE" : "en-GB", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date(comment.createdAt));
    const text = document.createElement("p");
    text.textContent = comment.text;
    content.append(name, time, text);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "comment-delete";
    deleteButton.textContent = ui("deleteComment");
    deleteButton.addEventListener("click", () => {
      saveComments(getComments().filter((item) => item.id !== comment.id));
      renderComments();
    });

    item.append(avatar, content, deleteButton);
    elements.commentList.append(item);
  });
}

function updateReadingProgress() {
  if (!state.activeArticle) return;
  const articleTop = elements.readingView.offsetTop;
  const articleHeight = elements.readingView.scrollHeight - window.innerHeight;
  const progress = Math.min(1, Math.max(0, (window.scrollY - articleTop) / articleHeight));
  elements.readingProgress.style.width = `${progress * 100}%`;
}

function cacheElements() {
  [
    "readingProgress", "themeToggle", "languageToggle", "categoryFilters", "postGrid", "emptyState",
    "blogHome", "blogIndex", "readingView", "backToBlog", "readingCategory", "readingTitle",
    "readingDeck", "readingMeta", "articleCopy", "copyLinkButton", "copyStatus", "commentForm",
    "commentName", "commentEmail", "commentText", "commentCharacters", "commentStatus",
    "commentCount", "commentList"
  ].forEach((id) => {
    elements[id] = document.getElementById(id);
  });
}

function bindEvents() {
  elements.themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    applyTheme();
  });

  elements.languageToggle.addEventListener("click", async () => {
    state.language = state.language === "sv" ? "en" : "sv";
    await loadTranslations(state.language);
    localStorage.setItem("language", state.language);
    applyInterfaceLanguage();
  });

  elements.backToBlog.addEventListener("click", () => closeArticle());
  window.addEventListener("popstate", () => {
    const articleId = window.location.hash.slice(1);
    articleIds.includes(articleId) ? openArticle(articleId, false) : closeArticle(false);
  });
  window.addEventListener("scroll", updateReadingProgress, { passive: true });

  elements.copyLinkButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(window.location.href);
    elements.copyStatus.textContent = ui("copied");
  });

  elements.commentText.addEventListener("input", () => {
    elements.commentCharacters.textContent = elements.commentText.value.length;
  });

  elements.commentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const comments = getComments();
    comments.push({
      id: crypto.randomUUID(),
      name: elements.commentName.value.trim(),
      email: elements.commentEmail.value.trim(),
      text: elements.commentText.value.trim(),
      createdAt: new Date().toISOString()
    });
    saveComments(comments);
    elements.commentForm.reset();
    elements.commentCharacters.textContent = "0";
    elements.commentStatus.textContent = ui("commentSaved");
    renderComments();
  });
}

async function initializeBlog() {
  cacheElements();
  await loadTranslations(state.language);
  bindEvents();
  applyInterfaceLanguage();
  const articleId = window.location.hash.slice(1);
  if (articleIds.includes(articleId)) openArticle(articleId, false);
}

initializeBlog().catch((error) => {
  console.error("Could not initialize the blog.", error);
});
