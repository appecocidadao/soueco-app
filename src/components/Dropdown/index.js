import React, { useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { useField } from '@unform/core';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '~/styles/colors';

// import { Container } from './styles';

const pickerSelectStyles = ({ error = false } = {}) =>
  StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      // paddingVertical: 12,
      paddingHorizontal: 48,
      // borderWidth: 1,
      // borderColor: 'gray',
      // borderRadius: 4,
      // color: 'black',
      // paddingRight: 30, // to ensure the text is never behind the icon
      backgroundColor: Colors.soft,
      height: 48,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: error ? '#c53030' : Colors.border,
      padding: 10,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 1.2,
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  });
const Dropdown = ({ name, options, placeholder, icon }) => {
  const selectRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: (ref: any) => {
        // if (ref.state.selectedItem.value === undefined) {
        //   return '';
        // }
        return ref.state.selectedItem.value;
      },
    });
  }, [fieldName, registerField]);

  return (
    <RNPickerSelect
      // defaultValue={defaultValue}
      ref={selectRef}
      placeholder={{
        label: placeholder,
        value: null,
        color: '#9EA0A4',
      }}
      style={{
        ...pickerSelectStyles({ error }),
        iconContainer: {
          // top: 10,
          // right: 8,
          flexDirection: 'row',
          backgroundColor: 'transparent',
          width: '100%',
          justifyContent: 'space-between',
          padding: 8,
        },

        placeholder: { color: Colors.fontLight },
      }}
      onValueChange={(value) => {}}
      // value={defaultValue}
      Icon={() => {
        return (
          <>
            <Icon
              name={icon}
              size={24}
              style={{ paddingTop: 4, paddingHorizontal: 6 }}
              color={
                selectRef.current?.state.selectedItem.value
                  ? Colors.main
                  : Colors.fontLight
              }
            />
            <Icon
              name={
                selectRef.current?.state.showPicker ? 'menu-up' : 'menu-down'
              }
              size={32}
              color={Colors.main}
            />
          </>
        );
      }}
      items={options}
    />
  );
};

export default Dropdown;
