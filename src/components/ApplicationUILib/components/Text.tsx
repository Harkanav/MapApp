import React from 'react';
import {StyleSheet, Text as RNText} from 'react-native';
import {TextProps} from 'react-native-ui-lib';

const Text = ({style, children, ...restProps}: TextProps) => {
  return (
    <RNText style={[style, styles.defaultStyle]} {...restProps}>
      {children}
    </RNText>
  );
};

export default Text;

const styles = StyleSheet.create({
  defaultStyle: {
    fontFamily: 'Montserrat-SemiBold',
  },
});
