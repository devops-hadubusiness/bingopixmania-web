export const DATES_PATTERNS = {
  'dd/MM HH:mm': {
    pattern: 'dd/MM HH:mm',
    regex: (timestamp: string) => timestamp.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?Z/, '$3/$2 $4:$5')
  }
}
