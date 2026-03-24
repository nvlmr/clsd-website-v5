import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import {
  Search, X, BookOpen, FileText, User, Calendar, ExternalLink,
  Download, Globe, Copy, Check, AlertCircle, RefreshCw, Sparkles,
  GraduationCap, Library, Newspaper, ChevronLeft, ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;
const LAKE_KEYWORDS = ["lake", "lakes", "limnology", "freshwater", "lacustrine", "reservoir", "pond"];

function SearchEngine() {
  const [searchQuery, setSearchQuery]       = useState("");
  const [searchResults, setSearchResults]   = useState([]);
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [savedSearches, setSavedSearches]   = useState([]);
  const [isFocused, setIsFocused]           = useState(false);
  const [crawlStats, setCrawlStats]         = useState({ total: 0, sources: [] });
  const [expandedAbstract, setExpandedAbstract] = useState(null);
  const [copiedId, setCopiedId]             = useState(null);
  const [currentPage, setCurrentPage]       = useState(1);

  const searchInputRef    = useRef(null);
  const abortControllerRef = useRef(null);
  const resultsRef        = useRef(null);

  // ── Lake query builder ──────────────────────────────────────────────────────
  const buildLakeQuery = (userQuery) => {
    const q = userQuery.trim().toLowerCase();
    return LAKE_KEYWORDS.some((kw) => q.includes(kw))
      ? userQuery.trim()
      : `${userQuery.trim()} lake`;
  };

  // ── Safe fetch with timeout ─────────────────────────────────────────────────
  const safeFetch = async (url, signal, timeoutMs = 12000) => {
    const ctrl = new AbortController();
    const tid  = setTimeout(() => ctrl.abort(), timeoutMs);
    signal?.addEventListener("abort", () => ctrl.abort());
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(tid);
      return res;
    } catch (e) {
      clearTimeout(tid);
      throw e;
    }
  };

  // ── CrossRef ────────────────────────────────────────────────────────────────
  const fetchFromCrossref = async (query, signal) => {
    const lakeQuery = buildLakeQuery(query);
    const url =
      `https://api.crossref.org/works` +
      `?query=${encodeURIComponent(lakeQuery)}` +
      `&filter=type:journal-article&rows=25&sort=relevance` +
      `&select=DOI,title,author,abstract,container-title,published,is-referenced-by-count,link,URL,type,subject`;
    const res = await safeFetch(url, signal);
    if (!res.ok) throw new Error(`CrossRef ${res.status}`);
    const json = await res.json();
    return (json?.message?.items ?? []).map((item) => ({
      id:          item.DOI ?? `crossref-${Math.random()}`,
      title:       item.title?.[0] ?? "Untitled",
      authors:     item.author?.map((a) => [a.given, a.family].filter(Boolean).join(" ")).join(", ") ?? "Unknown",
      abstract:    item.abstract ? item.abstract.replace(/<[^>]*>/g, "") : "No abstract available",
      publication: item["container-title"]?.[0] ?? "Unknown Journal",
      year:        item.published?.["date-parts"]?.[0]?.[0]?.toString() ?? item["published-print"]?.["date-parts"]?.[0]?.[0]?.toString() ?? "Unknown",
      doi:         item.DOI,
      url:         item.URL ?? (item.DOI ? `https://doi.org/${item.DOI}` : "#"),
      type:        "Research Article",
      citations:   item["is-referenced-by-count"] ?? 0,
      source:      "CrossRef",
      pdfUrl:      item.link?.find((l) => l["content-type"] === "application/pdf" || l["intended-application"] === "text-mining")?.URL ?? null,
      keywords:    item.subject ?? [],
    }));
  };

  // ── OpenAlex ────────────────────────────────────────────────────────────────
  const fetchFromOpenAlex = async (query, signal) => {
    const lakeQuery = buildLakeQuery(query);
    const url =
      `https://api.openalex.org/works` +
      `?search=${encodeURIComponent(lakeQuery)}` +
      `&filter=type:article&per-page=25&sort=relevance_score:desc` +
      `&select=id,title,authorships,abstract_inverted_index,primary_location,publication_year,doi,cited_by_count,keywords,type,open_access`;
    const res = await safeFetch(url, signal);
    if (!res.ok) throw new Error(`OpenAlex ${res.status}`);
    const json = await res.json();
    return (json?.results ?? []).map((item) => {
      let abstract = "No abstract available";
      if (item.abstract_inverted_index) {
        try {
          const wordPos = [];
          for (const [word, positions] of Object.entries(item.abstract_inverted_index))
            positions.forEach((pos) => wordPos.push({ word, pos }));
          wordPos.sort((a, b) => a.pos - b.pos);
          abstract = wordPos.map((wp) => wp.word).join(" ");
        } catch (_) {}
      }
      const doiRaw = item.doi?.replace("https://doi.org/", "");
      return {
        id:          item.id ?? `openalex-${Math.random()}`,
        title:       item.title ?? "Untitled",
        authors:     item.authorships?.map((a) => a.author?.display_name).filter(Boolean).join(", ") ?? "Unknown",
        abstract,
        publication: item.primary_location?.source?.display_name ?? "Unknown Journal",
        year:        item.publication_year?.toString() ?? "Unknown",
        doi:         doiRaw,
        url:         item.primary_location?.landing_page_url ?? item.open_access?.oa_url ?? (doiRaw ? `https://doi.org/${doiRaw}` : "#"),
        type:        "Research Article",
        citations:   item.cited_by_count ?? 0,
        source:      "OpenAlex",
        pdfUrl:      item.primary_location?.pdf_url ?? item.open_access?.oa_url ?? null,
        keywords:    item.keywords?.map((k) => k.keyword) ?? [],
      };
    });
  };

  // ── Semantic Scholar ─────────────────────────────────────────────────────────
  const fetchFromSemanticScholar = async (query, signal) => {
    const lakeQuery = buildLakeQuery(query);
    const url =
      `https://api.semanticscholar.org/graph/v1/paper/search` +
      `?query=${encodeURIComponent(lakeQuery)}&limit=25` +
      `&fields=title,authors,year,abstract,venue,citationCount,openAccessPdf,url,externalIds,fieldsOfStudy`;
    const res = await safeFetch(url, signal);
    if (!res.ok) throw new Error(`SemanticScholar ${res.status}`);
    const json = await res.json();
    return (json?.data ?? []).map((item) => ({
      id:          item.paperId ?? `semantic-${Math.random()}`,
      title:       item.title ?? "Untitled",
      authors:     item.authors?.map((a) => a.name).filter(Boolean).join(", ") ?? "Unknown",
      abstract:    item.abstract ?? "No abstract available",
      publication: item.venue ?? "Unknown",
      year:        item.year?.toString() ?? "Unknown",
      doi:         item.externalIds?.DOI,
      url:         item.url ?? (item.externalIds?.DOI ? `https://doi.org/${item.externalIds.DOI}` : "#"),
      type:        "Research Paper",
      citations:   item.citationCount ?? 0,
      source:      "Semantic Scholar",
      pdfUrl:      item.openAccessPdf?.url ?? null,
      keywords:    item.fieldsOfStudy ?? [],
    }));
  };

  // ── arXiv ────────────────────────────────────────────────────────────────────
  const fetchFromArXiv = async (query, signal) => {
    const lakeQuery = buildLakeQuery(query);
    const url =
      `https://export.arxiv.org/api/query` +
      `?search_query=all:${encodeURIComponent(lakeQuery)}&start=0&max_results=25&sortBy=relevance`;
    const res = await safeFetch(url, signal);
    if (!res.ok) throw new Error(`arXiv ${res.status}`);
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    return Array.from(xml.getElementsByTagName("entry")).map((entry) => {
      const id = entry.getElementsByTagName("id")[0]?.textContent?.trim() ?? "";
      const pdfLink = Array.from(entry.getElementsByTagName("link")).find(
        (l) => l.getAttribute("title") === "pdf" || l.getAttribute("type") === "application/pdf"
      );
      const categories = Array.from(entry.getElementsByTagName("category")).map((c) => c.getAttribute("term") ?? "");
      const pubRaw = entry.getElementsByTagName("published")[0]?.textContent ?? "";
      return {
        id:          id || `arxiv-${Math.random()}`,
        title:       entry.getElementsByTagName("title")[0]?.textContent?.replace(/\n/g, " ").trim() ?? "Untitled",
        authors:     Array.from(entry.getElementsByTagName("author")).map((a) => a.getElementsByTagName("name")[0]?.textContent).filter(Boolean).join(", "),
        abstract:    entry.getElementsByTagName("summary")[0]?.textContent?.replace(/\n/g, " ").trim() ?? "No abstract available",
        year:        pubRaw ? new Date(pubRaw).getFullYear().toString() : "Unknown",
        publication: "arXiv Preprint",
        url:         id,
        doi:         null,
        type:        "Preprint",
        citations:   0,
        source:      "arXiv",
        pdfUrl:      pdfLink ? pdfLink.getAttribute("href") : null,
        keywords:    categories,
      };
    });
  };

  // ── Europe PMC ───────────────────────────────────────────────────────────────
  const fetchFromEuropePMC = async (query, signal) => {
    const lakeQuery = buildLakeQuery(query);
    const url =
      `https://www.ebi.ac.uk/europepmc/webservices/rest/search` +
      `?query=${encodeURIComponent(lakeQuery)}&format=json&pageSize=25&resultType=core&sort=RELEVANCE`;
    const res = await safeFetch(url, signal);
    if (!res.ok) throw new Error(`EuropePMC ${res.status}`);
    const json = await res.json();
    return (json?.resultList?.result ?? []).map((item) => ({
      id:          item.id ?? `epmc-${Math.random()}`,
      title:       item.title ?? "Untitled",
      authors:     item.authorList?.author?.map((a) => a.fullName ?? `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim()).filter(Boolean).join(", ") ?? item.authorString ?? "Unknown",
      abstract:    item.abstractText ?? "No abstract available",
      publication: item.journalTitle ?? "Unknown",
      year:        item.pubYear?.toString() ?? "Unknown",
      doi:         item.doi,
      url:         item.doi ? `https://doi.org/${item.doi}` : item.fullTextUrlList?.fullTextUrl?.[0]?.url ?? "#",
      type:        "Research Article",
      citations:   item.citedByCount ?? 0,
      source:      "Europe PMC",
      pdfUrl:      item.fullTextUrlList?.fullTextUrl?.find((u) => u.documentStyle === "pdf")?.url ?? null,
      keywords:    item.keywordList?.keyword ?? [],
    }));
  };

  // ── DOAJ ─────────────────────────────────────────────────────────────────────
  const fetchFromDOAJ = async (query, signal) => {
    const lakeQuery = buildLakeQuery(query);
    const url = `https://doaj.org/api/search/articles/${encodeURIComponent(lakeQuery)}?pageSize=25&sort=score`;
    const res = await safeFetch(url, signal);
    if (!res.ok) throw new Error(`DOAJ ${res.status}`);
    const json = await res.json();
    return (json?.results ?? []).map((item) => {
      const bib     = item.bibjson ?? {};
      const doi     = bib.identifier?.find((id) => id.type === "doi")?.id;
      const pdfLink = bib.link?.find((l) => l.type === "fulltext" && l.url?.endsWith(".pdf"))?.url;
      const fullLink = bib.link?.find((l) => l.type === "fulltext")?.url ?? (doi ? `https://doi.org/${doi}` : "#");
      return {
        id:          item.id ?? `doaj-${Math.random()}`,
        title:       bib.title ?? "Untitled",
        authors:     bib.author?.map((a) => a.name).filter(Boolean).join(", ") ?? "Unknown",
        abstract:    bib.abstract ?? "No abstract available",
        publication: bib.journal?.title ?? "Unknown",
        year:        bib.year?.toString() ?? "Unknown",
        doi,
        url:         fullLink,
        type:        "Research Article (Open Access)",
        citations:   0,
        source:      "DOAJ",
        pdfUrl:      pdfLink ?? null,
        keywords:    bib.keywords ?? [],
      };
    });
  };

  // ── Dedup ─────────────────────────────────────────────────────────────────────
  const isSimilarTitle = (t1, t2) => {
    const words1 = t1.split(/\s+/).filter((w) => w.length > 4);
    const words2 = t2.split(/\s+/).filter((w) => w.length > 4);
    if (words1.length < 3 || words2.length < 3) return t1 === t2;
    const set2   = new Set(words2);
    const common = words1.filter((w) => set2.has(w));
    return common.length / Math.min(words1.length, words2.length) > 0.65;
  };

  const deduplicateResults = (results) => {
    const seen = new Map();
    return results.filter((result) => {
      const title = result.title?.toLowerCase().trim() ?? "";
      if (!title || title === "untitled") return true;
      for (const existingTitle of seen.keys())
        if (isSimilarTitle(title, existingTitle)) return false;
      seen.set(title, true);
      return true;
    });
  };

  // ── Rank ──────────────────────────────────────────────────────────────────────
  const rankResults = (results, query) => {
    const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
    return [...results].sort((a, b) => {
      const score = (item) => {
        let s = 0;
        const titleL    = item.title?.toLowerCase()    ?? "";
        const abstractL = item.abstract?.toLowerCase() ?? "";
        terms.forEach((t) => { if (titleL.includes(t)) s += 15; if (abstractL.includes(t)) s += 5; });
        LAKE_KEYWORDS.forEach((kw) => { if (titleL.includes(kw)) s += 20; });
        s += Math.min((item.citations ?? 0) * 0.05, 30);
        s += ((parseInt(item.year) || 2000) - 2000) * 0.3;
        return s;
      };
      return score(b) - score(a);
    });
  };

  // ── Lake relevance filter ─────────────────────────────────────────────────────
  const filterLakeResults = (results, query) => {
    const q = query.toLowerCase();
    if (LAKE_KEYWORDS.some((kw) => q.includes(kw))) return results;
    return results.filter((r) => {
      const combined = `${r.title ?? ""} ${r.abstract ?? ""} ${(r.keywords ?? []).join(" ")}`.toLowerCase();
      return LAKE_KEYWORDS.some((kw) => combined.includes(kw));
    });
  };

  // ── Source registry ───────────────────────────────────────────────────────────
  const ALL_SOURCES = [
    { name: "CrossRef",         fetcher: fetchFromCrossref },
    { name: "OpenAlex",         fetcher: fetchFromOpenAlex },
    { name: "Semantic Scholar", fetcher: fetchFromSemanticScholar },
    { name: "arXiv",            fetcher: fetchFromArXiv },
    { name: "Europe PMC",       fetcher: fetchFromEuropePMC },
    { name: "DOAJ",             fetcher: fetchFromDOAJ },
  ];

  // ── Main search ───────────────────────────────────────────────────────────────
  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const { signal } = controller;

    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setSearchResults([]);
    setCrawlStats({ total: 0, sources: [] });
    setCurrentPage(1);
    setExpandedAbstract(null);

    const sourceStats = [];

    const fetchSource = async (src) => {
      if (signal.aborted) return [];
      try {
        const results      = await src.fetcher(searchQuery, signal);
        const lakeFiltered = filterLakeResults(results, searchQuery);
        sourceStats.push({ source: src.name, count: lakeFiltered.length, success: true });
        return lakeFiltered;
      } catch (err) {
        if (signal.aborted) return [];
        sourceStats.push({ source: src.name, count: 0, success: false, error: err.message });
        return [];
      }
    };

    const chunks     = await Promise.all(ALL_SOURCES.map(fetchSource));
    if (signal.aborted) return;

    const allResults = chunks.flat();
    const unique     = deduplicateResults(allResults);
    const ranked     = rankResults(unique, searchQuery);

    setSearchResults(ranked);
    setCrawlStats({ total: ranked.length, sources: sourceStats });

    if (ranked.length === 0)
      setError("No lake research results found. Try broader terms like 'lake ecology', 'freshwater biodiversity', or 'limnology'.");

    saveSearch(searchQuery);
    setLoading(false);

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  // ── Misc ──────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("lakeResearchSearches");
    if (saved) setSavedSearches(JSON.parse(saved));
  }, []);

  const saveSearch = (query) => {
    const updated = [query, ...savedSearches.filter((q) => q !== query)].slice(0, 10);
    setSavedSearches(updated);
    localStorage.setItem("lakeResearchSearches", JSON.stringify(updated));
  };

  const handleNewSearch = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setSearchPerformed(false);
    setSearchResults([]);
    setSearchQuery("");
    setError(null);
    setCrawlStats({ total: 0, sources: [] });
    setCurrentPage(1);
    setExpandedAbstract(null);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ── Pagination helpers ────────────────────────────────────────────────────────
  const totalPages       = Math.ceil(searchResults.length / ITEMS_PER_PAGE);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    setExpandedAbstract(null);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4)            return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  // ── Source icon map ───────────────────────────────────────────────────────────
  const SourceIcon = ({ source }) => {
    const icons = {
      "CrossRef":         <BookOpen className="w-3 h-3" />,
      "OpenAlex":         <Library className="w-3 h-3" />,
      "Semantic Scholar": <GraduationCap className="w-3 h-3" />,
      "arXiv":            <Newspaper className="w-3 h-3" />,
      "Europe PMC":       <FileText className="w-3 h-3" />,
      "DOAJ":             <Globe className="w-3 h-3" />,
    };
    return icons[source] ?? <Sparkles className="w-3 h-3" />;
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col font-sans">
      <NavBar />

      <main className="flex-1 mt-18">

        {/* ══════════════════════════ HERO ══════════════════════════════════════ */}
        {!searchPerformed && (
          <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
              <div className="text-center space-y-6 mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Library className="w-6 h-6 text-blue-500" />
                  <span className="text-blue-600 font-semibold">Lake Research Database</span>
                </div>
                <h1 className="text-5xl sm:text-7xl font-bold">
                  <span className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 bg-clip-text text-transparent">
                    Lake Science Search
                  </span>
                </h1>
                <p className="text-gray-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                  Search millions of lake research papers, theses, and scientific publications.
                </p>
              </div>

              {/* Search box */}
              <div className="relative transform transition-all duration-500 hover:scale-[1.02]">
                <div className={`bg-white/90 backdrop-blur-xl rounded-3xl border border-blue-100 shadow-2xl overflow-hidden transition-all ${isFocused ? "ring-4 ring-blue-500/20 border-transparent" : ""}`}>
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="relative flex-1">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full pl-6 pr-4 py-6 bg-transparent text-gray-800 text-xl focus:outline-none"
                        placeholder="Search lake research papers, theses, studies..."
                      />
                    </div>
                    <div className="flex items-center gap-1 pr-3">
                      {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery("")} className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                      <button type="submit" disabled={loading} className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading
                          ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                          : <Search className="w-6 h-6" />}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════ RESULTS ═══════════════════════════════════ */}
        {searchPerformed && (
          <div ref={resultsRef} className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8">

            {/* Compact search bar */}
            <div className="mb-8 mt-25">
              <div className="bg-white rounded-2xl border border-blue-100 shadow-lg overflow-hidden">
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-6 pr-4 py-4 bg-transparent text-gray-800 text-lg focus:outline-none"
                      placeholder="Refine your search..."
                    />
                  </div>
                  <div className="flex items-center gap-1 pr-3">
                    {searchQuery && (
                      <button type="button" onClick={() => setSearchQuery("")} className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <button type="submit" disabled={loading} className="p-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading
                        ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <Search className="w-5 h-5" />}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-xl font-semibold">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
                      Searching databases…
                    </span>
                  ) : (
                    <span className="bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                      Found {searchResults.length} lake research {searchResults.length === 1 ? "paper" : "papers"}
                    </span>
                  )}
                </h2>

                {/* Per-source badges */}
                {crawlStats.sources?.length > 0 && !loading && (
                  <div className="flex flex-wrap gap-2">
                    {crawlStats.sources.map((stat, i) => (
                      <div
                        key={i}
                        title={stat.error}
                        className={`text-xs px-2 py-1 rounded-full ${stat.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {stat.source}: {stat.count}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleNewSearch}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all shadow-sm hover:shadow-md"
              >
                <Search className="w-4 h-4" />
                New Search
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-amber-50/90 border-l-4 border-amber-500 text-amber-800 rounded-xl flex items-center gap-3 shadow-md">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-sm flex-1">{error}</p>
                <button onClick={handleSearch} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors text-sm">
                  Retry
                </button>
              </div>
            )}

            {/* Loading spinner */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                  <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Searching Academic Databases</h3>
                <p className="text-gray-500">Querying CrossRef, OpenAlex, Semantic Scholar, arXiv, Europe PMC, and DOAJ…</p>
              </div>
            )}

            {/* ── Cards ── */}
            {!loading && (
              <>
                <div className="space-y-4">
                  {paginatedResults.length > 0 ? (
                    paginatedResults.map((result, index) => {
                      const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index;
                      return (
                        <article
                          key={result.id || globalIndex}
                          className="group bg-white p-6 rounded-xl border border-slate-100 shadow-md hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                        >
                          <div className="flex flex-col gap-3">

                            {/* Title + action buttons */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <a
                                  href={result.url || result.pdfUrl || (result.doi ? `https://doi.org/${result.doi}` : "#")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xl font-bold text-blue-700 group-hover:text-blue-800 leading-tight hover:underline"
                                >
                                  {result.title || "Untitled"}
                                </a>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full flex items-center gap-1">
                                    <SourceIcon source={result.source} />
                                    {result.source}
                                  </span>
                                  {result.type && (
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{result.type}</span>
                                  )}
                                  {result.doi && (
                                    <span className="text-xs text-gray-400">DOI: {result.doi.substring(0, 20)}…</span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {result.pdfUrl && (
                                  <a href={result.pdfUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download PDF">
                                    <Download className="w-4 h-4" />
                                  </a>
                                )}
                                <button
                                  onClick={() => copyToClipboard(`${result.title} - ${result.authors} (${result.year}). ${result.publication}. DOI: ${result.doi || "N/A"}`, result.id || globalIndex)}
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Copy citation"
                                >
                                  {copiedId === (result.id || globalIndex)
                                    ? <Check className="w-4 h-4 text-green-500" />
                                    : <Copy className="w-4 h-4" />}
                                </button>
                                <a
                                  href={`https://scholar.google.com/scholar?q=${encodeURIComponent(result.title || "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Search on Google Scholar"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </div>

                            {/* Authors */}
                            {result.authors && result.authors !== "Unknown" && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <User className="w-4 h-4 flex-shrink-0" />
                                <span className="line-clamp-1">{result.authors}</span>
                              </div>
                            )}

                            {/* Meta */}
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                              {result.publication && result.publication !== "Unknown" && (
                                <span className="flex items-center gap-1 text-gray-600">
                                  <BookOpen className="w-4 h-4" />
                                  <span className="line-clamp-1">{result.publication}</span>
                                </span>
                              )}
                              {result.year && result.year !== "Unknown" && (
                                <span className="flex items-center gap-1 text-gray-600">
                                  <Calendar className="w-4 h-4" />
                                  {result.year}
                                </span>
                              )}
                              {result.citations > 0 && (
                                <span className="flex items-center gap-1 text-green-600">
                                  <span className="font-medium">{result.citations}</span> citations
                                </span>
                              )}
                            </div>

                            {/* Abstract */}
                            {result.abstract && result.abstract !== "No abstract available" && (
                              <div className="mt-2">
                                <p className={`text-gray-600 text-sm leading-relaxed ${expandedAbstract === globalIndex ? "" : "line-clamp-3"}`}>
                                  {result.abstract.replace(/<[^>]*>/g, "")}
                                </p>
                                {result.abstract.length > 300 && (
                                  <button
                                    onClick={() => setExpandedAbstract(expandedAbstract === globalIndex ? null : globalIndex)}
                                    className="text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium"
                                  >
                                    {expandedAbstract === globalIndex ? "Show less" : "Show more"}
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Keywords */}
                            {result.keywords && result.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {result.keywords.slice(0, 5).map((keyword, i) => (
                                  <span
                                    key={i}
                                    onClick={() => setSearchQuery(keyword)}
                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Links */}
                            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
                              {result.doi && (
                                <a href={`https://doi.org/${result.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600">
                                  <ExternalLink className="w-3 h-3" />
                                  View Publisher
                                </a>
                              )}
                              {result.url && result.url !== `https://doi.org/${result.doi}` && (
                                <a href={result.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600">
                                  <ExternalLink className="w-3 h-3" />
                                  View Source
                                </a>
                              )}
                              {result.pdfUrl && (
                                <a href={result.pdfUrl} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                                  <FileText className="w-3.5 h-3.5" />
                                  Download PDF
                                </a>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    !error && (
                      <div className="text-center py-12">
                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                          <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
                        <p className="text-gray-500">Try different keywords or a broader term</p>
                      </div>
                    )
                  )}
                </div>

                {/* ── Pagination controls ── */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2">
                      {/* Prev */}
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-sm"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                      </button>

                      {/* Page numbers */}
                      {getPageNumbers().map((page, i) =>
                        page === "..." ? (
                          <span key={`ellipsis-${i}`} className="px-2 py-2 text-gray-400 text-sm select-none">…</span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`min-w-[40px] px-3 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${
                              currentPage === page
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md"
                                : "border border-blue-200 text-blue-700 bg-white hover:bg-blue-50"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      {/* Next */}
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-sm"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-400">
                      Page {currentPage} of {totalPages} — {searchResults.length} results total
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default SearchEngine;