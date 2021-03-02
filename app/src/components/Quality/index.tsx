import React, { FC } from 'react';
import { Outer } from './style';

export type Props = {
  quality: Map<string, any>;
  setQual: React.Dispatch<React.SetStateAction<string>>;
};

const Trim: FC<Props> = (props: Props) => {
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

export default Trim;
