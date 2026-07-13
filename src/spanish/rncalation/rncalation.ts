// @ts-nocheck
import { fetchText } from "@libs/fetch";
import { load } from "cheerio";
import { defaultCover } from "@libs/defaultCover";

class RncalationPlugin {
    id = 'rncalation';
    name = 'RNCALATION';
    icon = 'src/spanish/rncalation/icon.png';
    site = 'https://rncalation.online';
    version = '1.0.0';
    filters = undefined;
    webStorageUtilized = true;

    async popularNovels(pageNo: number, { showLatestNovels }: { showLatestNovels: boolean }) {
        const url = showLatestNovels
            ? `${this.site}/?page=${pageNo}&sort=latest`
            : `${this.site}/?page=${pageNo}&sort=popular`;

        const body = await fetchText(url);
        const $ = load(body);
        const novels: any[] = [];

        $('div.card, div.novel-item, .flex.flex-col').each((index, element) => {
            const type = $(element).find('.text-sm, .badge, span').text().trim();
            if (type.toLowerCase().includes('novel') || $(element).text().toLowerCase().includes('novela')) {
                const name = $(element).find('h1, h2, .title').text().trim();
                const href = $(element).find('a').attr('href') || '';
                const cover = $(element).find('img').attr('src') || defaultCover;
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

    async parseNovel(novelPath: string) {
        const body = await fetchText(this.site + novelPath);
        const $ = load(body);
        
        const novel: any = {
            path: novelPath,
            name: $('h1').first().text().trim() || 'Novela sin título',
            cover: $('.comic-cover img, .cover-container img, img.comic-cover__img').first().attr('src') || defaultCover,
            summary: $('.comic-description, .synopsis, .description, #sinopsis, p').first().text().trim(),
        };

        const chapters: any[] = [];
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

    async parseChapter(chapterPath: string): Promise<string> {
        const body = await fetchText(this.site + chapterPath);
        const $ = load(body);
        const chapterText = $('.chapter-content, #contenido-novela, .text-content').html() || '';
        return chapterText;
    }

    async searchNovels(searchTerm: string, pageNo: number): Promise<any[]> {
        const url = `${this.site}/?search=${encodeURIComponent(searchTerm)}&page=${pageNo}`;
        const body = await fetchText(url);
        const $ = load(body);
        const novels: any[] = [];

        $('div.card, div.novel-item, .flex.flex-col').each((index, element) => {
            const name = $(element).find('h1, h2, .title').text().trim();
            const href = $(element).find('a').attr('href') || '';
            const cover = $(element).find('img').attr('src') || defaultCover;
            if (name && href) {
                novels.push({ name, path: href.replace(this.site, ''), cover });
            }
        });
        return novels;
    }

    resolveUrl = (path: string, isNovel?: boolean) => this.site + path;
}

export default new RncalationPlugin();