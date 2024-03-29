import ytdl from 'ytdl-core';
import { outerContext } from '../../Components/Layout';
import { Props } from '../../Components/Item';

export const getYoutubeDiv = (info: ytdl.videoInfo, i: number): Promise<Props | null> => {
  if (info && info.formats.length > 0) {
    const formats = new Map<string, ytdl.videoFormat>();
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
    const sorted_map = new Map<string, any>(
      Array.from(formats).sort(
        (a, b) =>
          -(a[1].height === b[1].height
            ? (a[1].fps ?? 30) - (b[1].fps ?? 30)
            : (a[1].height ?? 0) - (b[1].height ?? 0)),
      ),
    );

    return Promise.resolve({
      id: info.videoDetails.video_url,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1].url,
      quality: sorted_map,
      title: info.videoDetails.title,
      curQual: sorted_map.entries().next().value[0],
      ext: outerContext.curExt,
      duration: parseInt(info.videoDetails.lengthSeconds),
      download: true,
      merge: true,
      show: true,
      open: null,
      clips: [],
      captions: [],
      info,
      i
    });
  } else {
    return Promise.resolve(null);
  }
};
