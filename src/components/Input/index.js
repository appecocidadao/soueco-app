import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

import Colors from '~/styles/colors';

function Input({ name, icon, style, ...rest }, ref) {
  const inputRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, registerField, defaultValue, error } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
  }));

  useEffect(() => {
    inputRef.current.value = defaultValue;
    if (defaultValue) {
      setIsFilled(true);
    }
  }, [defaultValue]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      clearValue(ref) {
        ref.value = '';
        ref.clear();
      },
      setValue(ref, value) {
        ref.setNativeProps({ text: value });
        inputRef.current.value = value;
      },
      getValue(ref) {
        return ref.value;
      },
    });
  }, [fieldName, registerField]);
  return (
    // <TextInput
    //   ref={inputRef}
    //   keyboardAppearance="dark"
    //   defaultValue={defaultValue}
    //   placeholderTextColor="#666360"
    //   onChangeText={(value) => {
    //     if (inputRef.current) {
    //       inputRef.current.value = value;
    //     }
    //   }}
    //   {...rest}
    // />

    <Container isFocused={isFocused} style={style} isErrored={!!error}>
      <Icon
        name={icon || 'account'}
        size={20}
        color={isFocused || isFilled ? Colors.main : Colors.grey}
      />
      <TextInput
        ref={inputRef}
        onChangeText={(value) => {
          inputRef.current.value = value;
        }}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        keyboardAppearance="dark"
        placeholderTextColor={Colors.fontLight}
        {...rest}
      />
    </Container>
  );
}
export default forwardRef(Input);
