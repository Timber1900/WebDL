import React, { useEffect, useRef, useState } from 'react';
import { Container, OptionOuter, NavButton, NavLabel, NavSpan, BrowseInput } from './style';
import { port } from '../../logic/server/server';
import { path, setPath } from '../../logic/getPath';
import { CheckUpdates } from '../../logic/update';

const selectPort = () => {
  let temp_port: string | null = prompt('Select the default port', port);
  if (!(temp_port && /^[0-9]+$/.test(temp_port))) {
    alert('Port has to be a whole number');
  } else {
    window.localStorage.setItem('port', temp_port);
    chrome.runtime.reload();
  }
};

export let outExt: string;

const Navbar = () => {
  const inputRef = useRef(null);
  const [curPath, setCurPath] = useState(path);
  const [ext, setExt] = useState('v mkv');

  useEffect(() => {
    if (inputRef && inputRef.current) {
      // @ts-ignore: Object is possibly 'null'.
      inputRef.current.nwdirectory = true;
    }
  }, []);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      // @ts-ignore: Object is possibly 'null'.
      inputRef.current.nwworkingdir = curPath;
    }
  }, [curPath]);

  useEffect(() => {
    outExt = ext;
  }, [ext]);

  const check = async () => {
    window.localStorage.setItem('ytdl-lastcheck', '0');
    window.localStorage.setItem('webdl-lastcheck', '0');

    console.log(await CheckUpdates());
  };

  return (
    <Container>
      <OptionOuter>
        <NavSpan>
          <NavLabel>Select folder</NavLabel>
          <NavButton
            onClick={() => {
              if (inputRef && inputRef.current) {
                // @ts-ignore: Object is possibly 'null'.
                inputRef.current.click();
              }
            }}
          >
            Browse
          </NavButton>
          <BrowseInput
            type="file"
            ref={inputRef}
            onChange={(e) => {
              setPath(e.target.value);
              setCurPath(e.target.value);
            }}
          />
        </NavSpan>
        <NavSpan>
          <NavLabel>Change port</NavLabel>
          <NavButton onClick={selectPort}>Change</NavButton>
        </NavSpan>
        <NavSpan>
          <NavLabel>Check for updates</NavLabel>
          <NavButton onClick={check}>Check</NavButton>
        </NavSpan>
        <NavSpan>
          <NavLabel>Filetype:</NavLabel>
          <select defaultValue={ext} onChange={(e) => setExt(e.target.value)}>
            <optgroup label="Video">
              <option value="v mkv">mkv</option>
              <option value="v mp4">mp4</option>
              <option value="v avi">avi</option>
              <option value="v webm">webm</option>
            </optgroup>
            <optgroup label="Audio">
              <option value="a mp3">mp3</option>
              <option value="a m4a">m4a</option>
              <option value="a ogg">ogg</option>
              <option value="a wav">wav</option>
            </optgroup>
          </select>
        </NavSpan>
      </OptionOuter>
    </Container>
  );
};

export default Navbar;
