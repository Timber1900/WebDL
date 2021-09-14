import { outerContext } from '../../Components/Layout';
import { Props } from '../../Components/Item';

export const getOtherDiv = (info: any, i: number, url: string): Promise<Props | null> => {
  if (info && info.formats.length > 0) {
    const formats = new Map();
    for (const format of info.formats) {
      if ((format.ext === 'mp4' || format.ext === 'webm') && (format.vcodec ?? 'none') !== 'none' && (format.acodec ?? 'none') === 'none') {
        console.log(format);
        if (formats.has(format.format_note)) {
          formats.set(
            format.format_note,
            format.tbr >= formats.get(format.format_note).tbr ? format : formats.get(format.format_note),
          );
        } else {
          formats.set(format.format_note, format);
        }
      }
    }
    console.log(formats);
    let sorted_map = new Map();
    if (formats.size === 0) {
      sorted_map = new Map();
      for (const format of info.formats) {
        if((format.vcodec ?? 'none') !== 'none' && (format.acodec ?? 'none') !== 'none') {
          sorted_map.set(format.height.toString(), format);
        }
      }
      console.log(sorted_map);
    } else {
      sorted_map = new Map(
        Array.from(formats).sort(
          (a, b) =>
            -(a[1].height === b[1].height
              ? parseInt(a[1].fps) - parseInt(b[1].fps)
              : parseInt(a[1].height) - parseInt(b[1].height)),
        ),
      );
    }

    return Promise.resolve({
      id: url,
      thumbnail: info.thumbnails?.length ? info.thumbnails[info.thumbnails?.length - 1].url : '',
      quality: sorted_map,
      title: info.title,
      curQual: sorted_map.entries().next().value[0],
      info,
      i,
      download: true,
      merge: false,
      ext: outerContext.curExt,
      duration: info.duration ?? 0,
      clips: [],
      captions: [],
      show: true
    });
  } else {
    return Promise.resolve(null);
  }
};
