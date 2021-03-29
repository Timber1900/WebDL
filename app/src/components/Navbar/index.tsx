import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Container,
  OptionOuter,
  NavButton,
  NavLabel,
  NavSpan,
  BrowseInput,
  NavInput,
  NavSpanTypeTwo,
  NavSpanTypeThree,
  ExperimentalSpan,
} from './style';
import { port } from 'logic/server/server';
import { path, setPath } from 'logic/getPath';
import { CheckUpdates } from 'logic/update';
import { InfoQueueContext } from 'contexts/InfoQueueContext';
import Pulldown from 'components/Pulldown';

const selectPort = () => {
  let temp_port: string | null = prompt('Select the default port', port);
  if (!(temp_port && /^[0-9]+$/.test(temp_port))) {
    alert('Port has to be a whole number');
  } else {
    window.localStorage.setItem('port', temp_port);
    chrome.runtime.reload();
  }
};

const Navbar = () => {
  const inputRef = useRef(null);
  const [curPath, setCurPath] = useState(path);
  const {
    curExt,
    updateExt,
    curCustomExt,
    updateCurCustomExt,
    curConcurrentDownload,
    updateConcurrentDownload,
  } = useContext(InfoQueueContext);
  const [experimental, setExperimental] = useState(false);

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
          <NavLabel>Check for updates:</NavLabel>
          <NavButton onClick={check}>Check</NavButton>
        </NavSpan>
        <NavSpan>
          <NavLabel>Filetype:</NavLabel>
          <select defaultValue={curExt} onChange={(e) => updateExt(e.target.value)}>
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
            <option value="custom">Other...</option>
          </select>
        </NavSpan>
        {(() => {
          if (curExt === 'custom') {
            return (
              <NavSpanTypeTwo>
                <NavLabel>Type:</NavLabel>
                <select
                  defaultValue={(curCustomExt ?? 'v').split(' ')[0]}
                  onChange={(val: React.ChangeEvent<HTMLSelectElement>) => {
                    const extension = val.target.parentNode.querySelector('input').value;
                    const type = val.target.value;
                    updateCurCustomExt(`${type} ${extension}`);
                  }}
                >
                  <option value="v">Video</option>
                  <option value="a">Audio</option>
                </select>
                <NavInput
                  type="text"
                  placeholder="ext..."
                  defaultValue={(curCustomExt ?? 'v').split(' ')[1]}
                  onChange={(val: React.ChangeEvent<HTMLInputElement>) => {
                    const type = val.target.parentNode.querySelector('select').value;
                    const extension = val.target.value;
                    updateCurCustomExt(`${type} ${extension}`);
                  }}
                />
              </NavSpanTypeTwo>
            );
          }
        })()}
        <NavSpanTypeThree
          open={experimental}
          onClick={() => {
            console.log(experimental);
            setExperimental(!experimental);
          }}
        >
          <Pulldown />
          <NavLabel>Experimental</NavLabel>
        </NavSpanTypeThree>
        {(() => {
          if (experimental) {
            return (
              <ExperimentalSpan>
                <NavLabel>Concurrent downloads:</NavLabel>
                <NavInput
                  type="number"
                  placeholder="1"
                  defaultValue={curConcurrentDownload}
                  min="1"
                  onChange={(val: React.ChangeEvent<HTMLInputElement>) => {
                    if (val.target.valueAsNumber < 1) val.target.value = '1';
                    updateConcurrentDownload(val.target.valueAsNumber);
                  }}
                />
              </ExperimentalSpan>
            );
          }
        })()}
      </OptionOuter>
    </Container>
  );
};

export default Navbar;
