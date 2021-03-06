import { outExt } from '../../components/Navbar';
import { Props } from '../../components/Queue/Item';
import ytdl from 'ytdl-core';

export const getYoutubeDiv = (info: ytdl.videoInfo, i: number, url: string): Promise<Props | null> => {
  if (info && info.formats.length > 0) {
    let formats = new Map<string, ytdl.videoFormat>();
    for (const format of info.formats) {
      if ((format.container === 'mp4' || format.container === 'webm') && format.hasVideo && !format.hasAudio) {
        if (formats.has(format.qualityLabel)) {
          formats.set(
            format.qualityLabel,
            (format.averageBitrate ?? 0) >= ((formats.get(format.qualityLabel) ?? format).averageBitrate ?? 0)
              ? format
              : formats.get(format.qualityLabel) ?? format,
          );
        } else {
          formats.set(format.qualityLabel, format);
        }
      }
    }
    const temp_sorted_map = new Map(
      [...formats.entries()].sort(
        (a, b) =>
          -(a[1].height === b[1].height
            ? (a[1].fps ?? 30) - (b[1].fps ?? 30)
            : (a[1].height ?? 0) - (b[1].height ?? 0)),
      ),
    );

    const sorted_map = new Map([...temp_sorted_map.entries()].map((a) => [a[0], a[1].itag]));

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
      ext: outExt,
      duration: parseInt(info.videoDetails.lengthSeconds),
      clips: [],
    });
  } else {
    return Promise.resolve(null);
  }
};
