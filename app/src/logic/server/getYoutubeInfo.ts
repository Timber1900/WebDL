import { Props } from '../../components/Queue/Item';

export const getYoutubeDiv = (info: any, i: number, url: string): Promise<Props | null> => {
  if (info && info.formats.length > 0) {
    let formats = new Map();
    for (const format of info.formats) {
      if ((format.container === 'mp4' || format.container === 'webm') && format.hasVideo && !format.hasAudio) {
        if (formats.has(format.qualityLabel)) {
          formats.set(
            format.qualityLabel,
            format.bitrate >= formats.get(format.qualityLabel).bitrate ? format : formats.get(format.qualityLabel),
          );
        } else {
          formats.set(format.qualityLabel, format);
        }
      }
    }
    console.log(formats);

    const temp_sorted_map = new Map(
      [...formats.entries()].sort(
        (a, b) =>
          -(a[1].height === b[1].height
            ? parseInt(a[1].fps) - parseInt(b[1].fps)
            : parseInt(a[1].height) - parseInt(b[1].height)),
      ),
    );

    console.log(temp_sorted_map);

    const sorted_map = new Map([...temp_sorted_map.entries()].map((a) => [a[0], a[1].itag]));

    console.log(sorted_map);

    return Promise.resolve({
      id: info.videoDetails.videoId,
      thumbnail: info.videoDetails.thumbnails[0].url,
      quality: sorted_map,
      title: info.videoDetails.title,
      curQual: sorted_map.entries().next().value[0],
      info,
      i,
      download: true,
      merge: true,
    });
  } else {
    return Promise.resolve(null);
  }
};
