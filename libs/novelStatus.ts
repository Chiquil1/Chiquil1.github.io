export enum NovelStatus {
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
  HIATUS = 'hiatus',
  UNKNOWN = 'unknown'
}

export class NovelStatusManager {
  static parseStatus(statusText: string): NovelStatus {
    const text = statusText.toLowerCase().trim();
    
    if (text.includes('ongoing') || text.includes('en curso')) {
      return NovelStatus.ONGOING;
    } else if (text.includes('completed') || text.includes('completado') || text.includes('finalizado')) {
      return NovelStatus.COMPLETED;
    } else if (text.includes('abandoned') || text.includes('abandonado')) {
      return NovelStatus.ABANDONED;
    } else if (text.includes('hiatus') || text.includes('pausa')) {
      return NovelStatus.HIATUS;
    }
    
    return NovelStatus.UNKNOWN;
  }
}