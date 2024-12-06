export function parseDuration(duration: string): number {
    const regex = /(\d+)([smhdw])/;  
    const match = duration.match(regex);
  
    if (!match) {
      throw new Error("Invalid duration format. Expected format like '10m', '2h', '1d'.");
    }
  
    const value = parseInt(match[1], 10);
    const unit = match[2];
  
    switch (unit) {
      case 's': // seconds
        return value * 1000; // Convert to milliseconds
      case 'm': // minutes
        return value * 60 * 1000; // Convert to milliseconds
      case 'h': // hours
        return value * 60 * 60 * 1000; // Convert to milliseconds
      case 'd': // days
        return value * 24 * 60 * 60 * 1000; // Convert to milliseconds
      case 'w': // weeks
        return value * 7 * 24 * 60 * 60 * 1000; // Convert to milliseconds
      default:
        throw new Error("Invalid time unit. Supported units are: s, m, h, d, w.");
    }
  }
   
  export function addDurationToNow(duration: string): Date {
    const currentTime = new Date(); 
    const durationInMilliseconds = parseDuration(duration);  
  
    currentTime.setTime(currentTime.getTime() + durationInMilliseconds);  
    return currentTime;  
  }
  
  export function parseDurationToSeconds(duration: string): number {
    const durationInMilliseconds = parseDuration(duration);
    return Math.floor(durationInMilliseconds / 1000); 
  }