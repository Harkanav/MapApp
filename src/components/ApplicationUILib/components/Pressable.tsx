import React from 'react';
import {Pressable as RNPressable} from 'react-native';
import {TextProps} from 'react-native-ui-lib';

const Pressable = ({style, children, ...restProps}: TextProps) => {
  return (
    <RNPressable
      style={({pressed}) => [
        {
          opacity: pressed ? 0.5 : 1.0,
        },
        style,
      ]}
      {...restProps}>
      {children}
    </RNPressable>
  );
};

export default Pressable;
