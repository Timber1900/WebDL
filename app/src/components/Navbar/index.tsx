import React, { useEffect, useRef, useState } from 'react';
import { Container, OptionOuter, NavButton, NavLabel, NavSpan, BrowseInput } from './style';
import fs from 'fs';
import { join } from 'path';
import OS from 'os';
import { port } from '../../logic/server/server';
import { path, setPath } from '../../logic/getPath';

const selectPort = () => {
  let temp_port: string | null = prompt('Select the default port', port);
  if (!(temp_port && /^[0-9]+$/.test(temp_port))) {
    alert('Port has to be a whole number');
  } else {
    fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'port.json'), JSON.stringify({ port }));
    chrome.runtime.reload();
  }
};

export let outExt: string;

const Navbar = () => {
  const inputRef = useRef(null);
  const [curPath, setCurPath] = useState(path);
  const [ext, setExt] = useState('-3');

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
          <NavLabel>Filetype:</NavLabel>
          <select defaultValue={ext} onChange={(e) => setExt(e.target.value)}>
            <optgroup label="Video">
              <option value={-3}>mkv</option>
              <option value={-2}>mp4</option>
              <option value={-1} disabled={true}>
                webm
              </option>
            </optgroup>
            <optgroup label="Audio">
              <option value={1} disabled={true}>
                mp3
              </option>
              <option value={2}>m4a</option>
            </optgroup>
          </select>
        </NavSpan>
      </OptionOuter>
    </Container>
  );
};

export default Navbar;
