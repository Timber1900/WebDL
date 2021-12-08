import os from 'os';
import { getGithubReleases } from './getGithubReleases';
import https from "https";
import fs from 'fs';

export const downloadFromGithub = async (filePath?, version?, platform = os.platform()) => {
  const fileName = platform == "win32" ? "yt-dlp.exe" : "yt-dlp";
  if(!version)
      version = (await getGithubReleases(1, 1))[0].tag_name;
  if(!filePath)
      filePath = "./" + fileName;
  const fileURL = "https://github.com/yt-dlp/yt-dlp/releases/download/" + version + "/" + fileName;
  return await downloadFile(fileURL, filePath);
}

const downloadFile = async (fileURL, filePath) => {
  console.log({fileURL, filePath});
  //eslint-disable-next-line
  return new Promise(async (resolve, reject) =>
  {
      while(fileURL)
      {
        const response: any = await new Promise((resolveRequest, rejectRequest) =>
          https.get(fileURL, (httpResponse) => {
              httpResponse.on("error", (e) => reject(e));
              resolveRequest(httpResponse);
          }));

          if(response.headers.location)
              fileURL = response.headers.location;
          else
          {
              fileURL = null
              response.pipe(fs.createWriteStream(filePath));
              response.on("error", (e) => reject(e));
              response.on("end", () => response.statusCode == 200 ? resolve(response) : reject(response));
          }
      }
  });

}
