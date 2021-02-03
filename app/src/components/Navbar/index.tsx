import React, { useEffect, useRef } from 'react';
import { Container, OptionOuter, NavButton, NavLabel, NavSpan, BrowseInput } from './style';
import fs from 'fs';
import { join } from 'path';
import OS from 'os';

let port: string;

try {
  const data = fs.readFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'port.json')).toString();
  port = JSON.parse(data).port;
} catch (error) {
  port = '1234';
  fs.mkdir(join(OS.homedir(), 'AppData', 'Roaming', '.webdl'), () => {});
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'port.json'), JSON.stringify({ port }));
}

const selectPort = () => {
  let temp_port: string | null = prompt('Select the default port', port);
  if (temp_port && /^[0-9]+$/.test(temp_port)) {
    port = temp_port;
  } else {
    alert('Port has to be a whole number');
  }
  fs.writeFileSync(join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'port.json'), JSON.stringify({ port }));
  chrome.runtime.reload();
};

const Navbar = () => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      // @ts-ignore: Object is possibly 'null'.
      inputRef.current.nwdirectory = true;
    }
  }, []);

  const selectFolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    fs.writeFileSync(
      join(OS.homedir(), 'AppData', 'Roaming', '.webdl', 'path.json'),
      JSON.stringify({ path: e.target.value }),
    );
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
          <BrowseInput type="file" ref={inputRef} onChange={(e) => selectFolder(e)} />
        </NavSpan>
        <NavSpan>
          <NavLabel>Change port</NavLabel>
          <NavButton onClick={selectPort}>Change</NavButton>
        </NavSpan>
      </OptionOuter>
    </Container>
  );
};

export default Navbar;
