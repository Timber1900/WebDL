import React, { FC } from 'react';
import { Outer } from './style';

export type Props = {
  quality: Map<string, any>;
  curQual: string;
  setQual: (newQual: string) => void;
};

const Quality: FC<Props> = (props: Props) => {
  const options: any = [];
  props.quality.forEach((value, key) => {
    options.push(key);
  });
  return (
    <Outer>
      <label>Quality</label>
      <select
        onChange={(e) => {
          props.setQual(e.target.value);
        }}
        defaultValue={props.curQual}
      >
        {options.map((val: string, i: number) => {
          return (
            <option value={val} key={i}>
              {val}
            </option>
          );
        })}
      </select>
    </Outer>
  );
};

export default Quality;
