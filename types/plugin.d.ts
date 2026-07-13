export declare namespace Plugin {
    interface PluginBase {
        id: string;
        name: string;
        icon: string;
        site: string;
        version: string;
        filters?: any;
        webStorageUtilized?: boolean;
        popularNovels(pageNo: number, options: PopularNovelsOptions<any>): Promise<NovelItem[]>;
        parseNovel(novelPath: string): Promise<SourceNovel>;
        parseChapter(chapterPath: string): Promise<string>;
        searchNovels(searchTerm: string, pageNo: number): Promise<NovelItem[]>;
        resolveUrl(path: string, isNovel?: boolean): string;
    }
    interface PopularNovelsOptions<T> {
        showLatestNovels?: boolean;
        filters?: T;
    }
    interface NovelItem {
        name: string;
        path: string;
        cover?: string;
    }
    interface SourceNovel {
        path: string;
        name: string;
        cover?: string;
        summary?: string;
        chapters?: ChapterItem[];
    }
    interface ChapterItem {
        name: string;
        path: string;
        releaseTime?: string;
        chapterNumber?: number;
    }
}
