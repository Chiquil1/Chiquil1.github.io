"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        // Corregido: Selector actualizado con '/cap/' basado en la respuesta real de la web
        $('a[href*="/cap/"]').each((index, element) => {
            let chapterName = $(element).text().trim();
            const chapterHref = $(element).attr('href') || '';
            // Omitimos los botones genéricos de la cabecera como "Comenzar lectura" o "Capítulo X" resumido
            if (chapterHref && !chapterName.toLowerCase().includes('comenzar') && chapterName.includes('\n')) {
                // Limpiamos los textos extras como "GRATIS" o fechas que se cuelan por el diseño estructurado de la web
                chapterName = chapterName.split('\n')[0].trim();
                chapters.push({
                    name: chapterName,
                    path: chapterHref.replace(this.site, ''),
                    releaseTime: '',
                    chapterNumber: chapters.length + 1,
                });
            }
        });
        // Invertimos la lista para que el Capítulo 1 aparezca en la parte superior en la app
        novel.chapters = chapters.reverse();
        return novel;
    }
    async parseChapter(chapterPath) {
        const body = await (0, fetch_1.fetchText)(this.site + chapterPath);
        const $ = (0, cheerio_1.load)(body);
        // Extrae el contenido html limpio del contenedor del texto
        const chapterText = $('.chapter-content, #contenido-novela, .text-content').html() || '';
        return chapterText;
    }
    async searchNovels(searchTerm, pageNo) {
        const url = `${this.site}/?search=${encodeURIComponent(searchTerm)}&page=${pageNo}`;
        const body = await (0, fetch_1.fetchText)(url);
        const $ = (0, cheerio_1.load)(body);
        const novels = [];
        $('div.card, .search-result').each((index, element) => {
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
