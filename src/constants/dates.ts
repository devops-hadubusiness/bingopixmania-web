export const DATES_PATTERNS: { [key: string]: (timestamp: string) => string } = {
  'dd/MM/yyyy': (timestamp: string) => timestamp.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?Z/, '$3/$2/$1'),
  'dd/MM HH:mm': (timestamp: string) => timestamp.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?Z/, '$3/$2 $4:$5'),
  'dd/MM/yyyy HH:mm': (timestamp: string) => timestamp.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?Z/, '$3/$2/$1 $4:$5'),
  'dd/MM/yyyy HH:mm:ss': (timestamp: string) => timestamp.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?Z/, '$3/$2/$1 $4:$5:$6'),
  'yyyy-MM-dd HH:mm:ss': (timestamp: string) => timestamp.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?Z/, '$3/$2/$1 $4:$5:$6'),
  'HH:mm:ss': (timestamp: string) => timestamp.replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?Z/, '$4:$5:$6')
}
