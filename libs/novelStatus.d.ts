export declare enum NovelStatus {
    ONGOING = "ongoing",
    COMPLETED = "completed",
    ABANDONED = "abandoned",
    HIATUS = "hiatus",
    UNKNOWN = "unknown"
}
export declare class NovelStatusManager {
    static parseStatus(statusText: string): NovelStatus;
}
