/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const https = require('https');

const getVersion = (page = 1, perPage = 1) => {
  return new Promise((resolve, reject) => {
    const apiURL = `https://api.github.com/repos/Timber1900/WebDL/releases?page=${page}&per_page=${perPage}`;
    https.get(apiURL, { headers: { 'User-Agent': 'node' } }, (response) => {
      let resonseString = '';
      response.setEncoding('utf8');
      response.on('data', (body) => (resonseString += body));
      response.on('error', (e) => reject(e));
      response.on('end', () => (response.statusCode == 200 ? resolve(JSON.parse(resonseString)) : reject(response)));
    });
  });
};

const downloadFromGithub = async (filePath) => {
  const fileName = 'WebDL.exe';
  const version = (await getVersion())[0].tag_name;
  const fileURL = `https://github.com/Timber1900/WebDL/releases/download/${version}/${fileName}`;

  return await downloadFile(fileURL, filePath);
};

const downloadFile = (fileURL, filePath) => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    while (fileURL) {
      let response = await new Promise((resolveRequest, rejectRequest) =>
        https.get(fileURL, (httpResponse) => {
          httpResponse.on('error', (e) => reject(e));
          resolveRequest(httpResponse);
        }),
      );
      if (response.headers.location) fileURL = response.headers.location;
      else {
        fileURL = null;
        response.pipe(fs.createWriteStream(filePath));
        response.on('error', (e) => reject(e));
        response.on('end', () => (response.statusCode == 200 ? resolve(response) : reject(response)));
      }
    }
  });
};
