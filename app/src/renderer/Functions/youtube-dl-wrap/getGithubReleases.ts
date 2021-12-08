import https from "https";

export const getGithubReleases = (page = 1, perPage = 1) => {
  return new Promise( (resolve, reject) =>
  {
      const apiURL = "https://api.github.com/repos/yt-dlp/yt-dlp/releases?page=" + page + "&per_page=" + perPage;
      https.get(apiURL, { headers: { "User-Agent": "node" } }, (response) =>
      {
          let resonseString = "";
          response.setEncoding("utf8");
          response.on("data", (body) => resonseString += body);
          response.on("error", (e) => reject(e));
          response.on("end", () => response.statusCode == 200 ? resolve(
            JSON.parse(resonseString)) : reject(response));
      });
  });
}
