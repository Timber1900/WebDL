import { outerContext } from '../../App';
import { Props } from 'components/Queue/Item';

export const getOtherDiv = (info: any, i: number, url: string): Promise<Props | null> => {
  if (info && info.formats.length > 0) {
    let formats = new Map();
    for (const format of info.formats) {
      if (format.ext === 'mp4' || format.ext === 'webm') {
        if (formats.has(format.format_id)) {
          formats.set(
            format.format_id,
            format.tbr >= formats.get(format.format_id).tbr ? format : formats.get(format.format_id),
          );
        } else {
          formats.set(format.format_id, format);
        }
      }
    }

    let sorted_map = new Map();
    if (!(formats.size > 0)) {
      sorted_map = new Map();
      for (const format of info.formats) {
        sorted_map.set(format.format_id, format.format_id);
      }
    } else {
      const temp_sorted_map = new Map(
        [...formats.entries()].sort(
          (a, b) =>
            -(a[1].height === b[1].height
              ? parseInt(a[1].fps) - parseInt(b[1].fps)
              : parseInt(a[1].height) - parseInt(b[1].height)),
        ),
      );
      sorted_map = new Map([...temp_sorted_map.entries()].map((a) => [a[0], a[1].format_id]));
    }

    return Promise.resolve({
      id: url,
      thumbnail: info.thumbnails?.length ? info.thumbnails[0].url : '',
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
      show: true,
    });
  } else {
    return Promise.resolve(null);
  }
};
