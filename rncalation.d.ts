import { Plugin } from '@/types/plugin';
import { Filters } from '@libs/filterInputs';
declare class RncalationPlugin implements Plugin.PluginBase {
    id: string;
    name: string;
    icon: string;
    site: string;
    version: string;
    filters: Filters | undefined;
    webStorageUtilized: boolean;
    popularNovels(pageNo: number, { showLatestNovels }: Plugin.PopularNovelsOptions<typeof this.filters>): Promise<Plugin.NovelItem[]>;
    parseNovel(novelPath: string): Promise<Plugin.SourceNovel>;
    parseChapter(chapterPath: string): Promise<string>;
    searchNovels(searchTerm: string, pageNo: number): Promise<Plugin.NovelItem[]>;
    resolveUrl: (path: string, isNovel?: boolean) => string;
}
declare const _default: RncalationPlugin;
export default _default;
