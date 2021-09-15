import * as React from 'react';
interface Props {
  id: string,
  value: number,
  disabled?: boolean
}

const ProgressBar = ({id, value, disabled}: Props) => {
  return(
    <div className={`relative w-full h-4 mx-2 my-2  ${disabled ? "opacity-60" : "opacity-100"} bg-gray-300 dark:bg-gray-700 rounded-lg shadow-sm`} id={id}>
      <div className="absolute top-0 bottom-0 left-0 z-0 duration-200 bg-blue-500 rounded-lg shadow-md dark:bg-blue-700 transition-width" style={{'width': `${(value*100 > 100 ? 100 : value*100) < 0 ? 0 : (value*100 > 100 ? 100 : value*100)}%`}}>
      </div>
    </div>
  );
};

export default ProgressBar;
