export const getYoutubeCookies = (cookie: string) => {
  return cookie.replace(/\t/g, ' ')
  .split('\n')
  .map((cookie) => cookie.split(' '))
  .map((cookie) => cookie.splice(cookie.length - 2, 2))
  .filter((cookie) => cookie[0] === cookie[0].toUpperCase() && cookie[0] !== "#" && cookie[0])
  .reduce((acc: string, cookie) => `${acc}${cookie[0]}=${cookie[1]};`, "");
}
