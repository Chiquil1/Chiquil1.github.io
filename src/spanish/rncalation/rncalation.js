"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const fetch_1 = require("@libs/fetch");
const cheerio_1 = require("cheerio");
const defaultCover_1 = require("@libs/defaultCover");
class RncalationPlugin {
    constructor() {
        this.id = 'rncalation';
        this.name = 'RNCALATION';
        this.icon = 'src/spanish/rncalation/icon.png';
        this.site = 'https://rncalation.online';
        this.version = '1.0.0';
        this.filters = undefined;
        this.webStorageUtilized = true;
        this.resolveUrl = (path, isNovel) => this.site + path;
    }
    async popularNovels(pageNo, { showLatestNovels }) {
        const url = showLatestNovels
            ? `${this.site}/?page=${pageNo}&sort=latest`
            : `${this.site}/?page=${pageNo}&sort=popular`;
        const body = await (0, fetch_1.fetchText)(url);
        const $ = (0, cheerio_1.load)(body);
        const novels = [];
        $('div.card, div.novel-item, .flex.flex-col').each((index, element) => {
            const type = $(element).find('.text-sm, .badge, span').text().trim();
            if (type.toLowerCase().includes('novel') || $(element).text().toLowerCase().includes('novela')) {
                const name = $(element).find('h1, h2, .title').text().trim();
                const href = $(element).find('a').attr('href') || '';
                const cover = $(element).find('img').attr('src') || defaultCover_1.defaultCover;
                if (name && href) {
                    novels.push({
                        name,
                        path: href.replace(this.site, ''),
                        cover,
                    });
                }
            }
        });
        return novels;
    }
    async parseNovel(novelPath) {
        const body = await (0, fetch_1.fetchText)(this.site + novelPath);
        const $ = (0, cheerio_1.load)(body);
        const novel = {
            path: novelPath,
            name: $('h1').first().text().trim() || 'Novela sin título',
            cover: $('.comic-cover img, .cover-container img, img.comic-cover__img').first().attr('src') || defaultCover_1.defaultCover,
            summary: $('.comic-description, .synopsis, .description, #sinopsis, p').first().text().trim(),
        };
        const chapters = [];
        $('a[href*="/cap/"]').each((index, element) => {
            let chapterName = $(element).text().trim();
            const chapterHref = $(element).attr('href') || '';
            if (chapterHref && !chapterName.toLowerCase().includes('comenzar')) {
                if (chapterName.includes(', ')) {
                    chapterName = chapterName.split(', ')[0].trim();
                }
                chapters.push({
                    name: chapterName,
                    path: chapterHref.replace(this.site, ''),
                    releaseTime: '',
                    chapterNumber: chapters.length + 1,
                });
            }
        });
        novel.chapters = chapters.reverse();
        return novel;
    }
    async parseChapter(chapterPath) {
        const body = await (0, fetch_1.fetchText)(this.site + chapterPath);
        const $ = (0, cheerio_1.load)(body);
        const chapterText = $('.chapter-content, #contenido-novela, .text-content').html() || '';
        return chapterText;
    }
    async searchNovels(searchTerm, pageNo) {
        const url = `${this.site}/?search=${encodeURIComponent(searchTerm)}&page=${pageNo}`;
        const body = await (0, fetch_1.fetchText)(url);
        const $ = (0, cheerio_1.load)(body);
        const novels = [];
        $('div.card, div.novel-item, .flex.flex-col').each((index, element) => {
            const name = $(element).find('h1, h2, .title').text().trim();
            const href = $(element).find('a').attr('href') || '';
            const cover = $(element).find('img').attr('src') || defaultCover_1.defaultCover;
            if (name && href) {
                novels.push({ name, path: href.replace(this.site, ''), cover });
            }
        });
        return novels;
    }
}
exports.default = new RncalationPlugin();
