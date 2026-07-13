const plugin = {
    id: "rncalation",
    name: "RNCALATION",
    site: "https://rncalation.online/",
    version: "1.0.1",
    icon: "https://raw.githubusercontent.com/Chiquil1/Chiquil1.github.io/refs/heads/gh-pages/src/spanish/rncalation/icon.png",
    async popularNovels(pageNo) {
        const url = `${this.site}?page=${pageNo}&sort=popular`;
        const body = await fetch(url).then(res => res.text());
        const $ = cheerio.load(body);
        const novels = [];
        $("div.card, div.novel-item, .flex.flex-col").each((i, el) => {
            const name = $(el).find("h1, h2, .title").text().trim();
            const href = $(el).find("a").attr("href");
            if (name && href) {
                novels.push({ name, path: href.replace(this.site, ""), cover: $(el).find("img").attr("src") || "" });
            }
        });
        return novels;
    },
    async parseNovel(novelPath) {
        const body = await fetch(this.site + novelPath).then(res => res.text());
        const $ = cheerio.load(body);
        return {
            path: novelPath,
            name: $("h1").first().text().trim(),
            summary: $(".synopsis, .description").text().trim(),
            chapters: []
        };
    },
    async parseChapter(chapterPath) {
        const body = await fetch(this.site + chapterPath).then(res => res.text());
        const $ = cheerio.load(body);
        return $(".chapter-content, #contenido-novela").html() || "";
    }
};
module.exports = plugin;
