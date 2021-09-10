interface Props {
  id: string,
  value: number
}

const VerticalProgressBar = ({id, value}: Props) => {
  return(
    <div className="relative w-4 min-w-4 h-full mx-2 my-2 bg-gray-300 rounded-lg shadow-sm dark:bg-gray-700" id={id}>
      <div className="w-4 absolute bottom-0 right-0 left-0 z-0 duration-200 bg-blue-500 rounded-lg shadow-md dark:bg-blue-700 transition-width" style={{'height': `${(value*100 > 100 ? 100 : value*100) < 0 ? 0 : (value*100 > 100 ? 100 : value*100)}%`}}>
      </div>
    </div>
  )
}

export default VerticalProgressBar;
