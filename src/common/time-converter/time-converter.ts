export class TimeConverter {
  static getSecondsInDays(days: number = 1) {
    const secondsInDay = 60 * 60 * 24;
    return secondsInDay * days;
  }

  static getSecondsInMinutes(minutes: number = 1) {
    const secondsInMinute = 60;
    return secondsInMinute * minutes;
  }

  static getMillisecondsInDays(days: number = 1) {
    return this.getSecondsInDays(days) * 1000;
  }

  static getMillisecondsInMinutes(minutes: number = 1) {
    return this.getSecondsInMinutes(minutes) * 1000;
  }
}
