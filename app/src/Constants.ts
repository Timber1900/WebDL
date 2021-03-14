export enum Duration {
  MILLISECONDS = 1,
  SECONDS = 1000 * MILLISECONDS,
  MINUTES = 60 * SECONDS,
  HOURS = 60 * MINUTES,
  DAY = 24 * HOURS,
}

export enum Status {
  SUCCESS = 0,
  PASS = 1,
  ERR = 2,
}
