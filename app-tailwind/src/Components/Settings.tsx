interface Props {
  className?: string;
}

const getDarkOption = (): 'system' | 'dark' | 'light'  => {
  return (localStorage.getItem('theme') ?? 'system') as 'system' | 'dark' | 'light'
}

const setDarkOption = (option: 'system' | 'dark' | 'light') => {
  localStorage.setItem('theme', option)
  const sytemOption = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  switch (option === 'system' ? sytemOption : option) {
    case 'dark':
      document.documentElement.classList.add('dark');
      break;
    case 'light':
      document.documentElement.classList.remove('dark')
      break;
    default:
      console.error(`WTF! Option was ${option}`)
      break;
  }
}

export const setDarkMode = () => {
  const option = getDarkOption();
  const sytemOption = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  switch (option === 'system' ? sytemOption : option) {
    case 'dark':
      document.documentElement.classList.add('dark');
      break;
    case 'light':
      document.documentElement.classList.remove('dark')
      break;
    default:
      console.error(`WTF! Option was ${option}`)
      break;
  }
}

const Settings = ({className}: Props) => {
  return (
    <div className={`${className ?? ''} absolute inset-x-1/4 inset-y-24 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col items-start gap-4 text-black dark:text-white text-base font-medium`}>
      <h1 className="text-xl font-bold">{"Appearence:"}</h1>
      <span>
        <label htmlFor='dark' className="mr-4">Dark mode: </label>
        <select name='dark' id='dark' defaultValue={getDarkOption()} onChange={(e) => {setDarkOption(e.target.value as 'system' | 'dark' | 'light')}} className="bg-gray-100 rounded-md shadow-sm w-max dark:bg-gray-700 focus:outline-none">
          <option value='system'>Follow system</option>
          <option value='dark'>Dark</option>
          <option value='light'>Light</option>
        </select>
      </span>
    </div>
  )
}

export default Settings;
