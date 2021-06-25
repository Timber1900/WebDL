import { testVideos } from '../temp.test'
import Item from './Item'

const Main = () => {
  return(
    <div className="flex flex-col items-center justify-start overflow-y-scroll bg-gray-200 dark:bg-gray-700">
      {testVideos.map(({animate, clips, curQual, download, duration, ext, i, id, info, merge, quality, show, thumbnail, title}) => (
        <Item clips={clips} curQual={curQual} download={download} duration={duration} ext={ext} i={i} id={id} info={info} merge={merge} show={show} thumbnail={thumbnail} title={title} />
      ))}

    </div>
  )
}

export default Main

