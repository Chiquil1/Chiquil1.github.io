"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NovelStatusManager = exports.NovelStatus = void 0;
var NovelStatus;
(function (NovelStatus) {
    NovelStatus["ONGOING"] = "ongoing";
    NovelStatus["COMPLETED"] = "completed";
    NovelStatus["ABANDONED"] = "abandoned";
    NovelStatus["HIATUS"] = "hiatus";
    NovelStatus["UNKNOWN"] = "unknown";
})(NovelStatus || (exports.NovelStatus = NovelStatus = {}));
class NovelStatusManager {
    static parseStatus(statusText) {
        const text = statusText.toLowerCase().trim();
        if (text.includes('ongoing') || text.includes('en curso')) {
            return NovelStatus.ONGOING;
        }
        else if (text.includes('completed') || text.includes('completado') || text.includes('finalizado')) {
            return NovelStatus.COMPLETED;
        }
        else if (text.includes('abandoned') || text.includes('abandonado')) {
            return NovelStatus.ABANDONED;
        }
        else if (text.includes('hiatus') || text.includes('pausa')) {
            return NovelStatus.HIATUS;
        }
        return NovelStatus.UNKNOWN;
    }
}
exports.NovelStatusManager = NovelStatusManager;
