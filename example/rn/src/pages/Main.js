import React from 'react';
import { Animated } from 'react-native';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { setEnableDevTool, addDevToolEnableListener, Segment } from 'react-native-dev-tools';
import { useNavigation } from '@react-navigation/core';
import common_styles from '../commons/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBar: {
    position: 'absolute',
    height: 2,
    borderRadius: 2,
    backgroundColor: 'white',
  },
  buttonCloseCross1: {
    width: 15,
    transform: [{ rotate: '45deg' }, { translateX: 0 }, { translateY: -0 }],
  },
  buttonCloseCross2: {
    width: 15,
    transform: [{ rotate: '-45deg' }, { translateX: 0 }, { translateY: 0 }],
  },
  buttonBackCross1: {
    width: 9,
    transform: [{ rotate: '-45deg' }, { translateX: 2 }, { translateY: -2 }],
  },
  buttonBackCross2: {
    width: 9,
    transform: [{ rotate: '45deg' }, { translateX: 2 }, { translateY: 2 }],
  },
});

const ClearIconView = ({ color = 'black' }) => {
  return (
    <View
      style={{
        width: 9,
        height: 9,
        borderBottomColor: color,
        borderBottomWidth: 0.5,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 6,
          height: 7,
          borderRadius: 1.5,
          borderWidth: 0.5,
          borderColor: color,
          position: 'absolute',
          transform: [{ translateX: 1 }, { rotate: '45deg' }, { translateY: 1.5 }],
        }}
      >
        <View style={{ width: 5, height: 0.75, backgroundColor: color, marginTop: 3.5 }} />
      </View>
    </View>
  );
};

const TransformerButton = ({ onPress, isClose }) => {
  const animated = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animated, {
      toValue: isClose ? 0 : 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isClose]);

  const width = animated.interpolate({ inputRange: [0, 1], outputRange: [15, 9] });
  const rotate1 = animated.interpolate({ inputRange: [0, 1], outputRange: ['45deg', '-45deg'] });
  const rotate2 = animated.interpolate({ inputRange: [0, 1], outputRange: ['-45deg', '45deg'] });
  const translateX1 = animated.interpolate({ inputRange: [0, 1], outputRange: [0, 2] });
  const translateX2 = animated.interpolate({ inputRange: [0, 1], outputRange: [0, 2] });
  const translateY1 = animated.interpolate({ inputRange: [0, 1], outputRange: [0, -2] });
  const translateY2 = animated.interpolate({ inputRange: [0, 1], outputRange: [0, 2] });

  return (
    <TouchableOpacity
      hitSlop={{
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
      }}
      style={[styles.button, { backgroundColor: 'red' }]}
      onPress={() => onPress()}
    >
      <Animated.View
        style={[
          styles.buttonBar,
          {
            width,
            transform: [{ rotate: rotate1 }, { translateX: translateX1 }, { translateY: translateY1 }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.buttonBar,
          {
            width,
            transform: [{ rotate: rotate2 }, { translateX: translateX2 }, { translateY: translateY2 }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const Main = () => {
  const navigation = useNavigation();
  const [isEnabledDevTool, setIsEnableDevTool] = React.useState();
  const [isClose, setIsClose] = React.useState(true);
  const [deployment, setDeployment] = React.useState('staging');

  React.useEffect(() => {
    setEnableDevTool(isEnabledDevTool);
    const removeListener = addDevToolEnableListener(enabled => {
      setIsEnableDevTool(enabled);
    });
    return () => {
      removeListener();
    };
  }, [isEnabledDevTool]);

  const handlePress = () => {
    setIsEnableDevTool(!isEnabledDevTool);
  };

  return (
    <View style={styles.container}>
      <Text>Main</Text>

      <TouchableOpacity
        style={common_styles.button}
        onPress={() => {
          console.log('log', { a: { b: 'c' } });
        }}
      >
        <Text>console.log</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={common_styles.button}
        onPress={() => {
          console.warn('warn', { a: { b: 'c' } });
        }}
      >
        <Text>console.warn</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={common_styles.button}
        onPress={() => {
          console.error('error', { a: { b: 'c' } }, { a: { b: 'c' } });
        }}
      >
        <Text>console.error</Text>
      </TouchableOpacity>

      <View style={{ paddingHorizontal: 20, alignSelf: 'stretch', marginBottom: 10 }}>
        <Segment
          items={[
            { label: 'Production', value: 'production' },
            { label: 'Staging', value: 'staging' },
            { label: 'Dev', value: 'dev' },
          ]}
          value={deployment}
          onPress={item => {
            setDeployment(item.value);
          }}
        />
      </View>

      <TouchableOpacity style={common_styles.button} onPress={handlePress}>
        <Text>{isEnabledDevTool ? 'Hide' : 'Show'} DevTools</Text>
      </TouchableOpacity>

      <TouchableOpacity style={common_styles.button} onPress={() => navigation.navigate('AxiosLogSample')}>
        <Text>Axios Logs Sample</Text>
      </TouchableOpacity>

      <TouchableOpacity style={common_styles.button} onPress={() => AsyncStorage.setItem('firstDepthItem', 'asdf')}>
        <Text>Test AsyncStorage Bug</Text>
      </TouchableOpacity>
      {/* <View style={{ transform: [{ scale: 10 }] }}>
        <ClearIconView />
      </View> */}

      {/* <TouchableOpacity
        hitSlop={{
          top: 10,
          left: 10,
          right: 10,
          bottom: 10,
        }}
        style={[styles.button, { backgroundColor: 'red' }]}
        onPress={() => {}}
      >
        <View style={[styles.buttonBar, styles.buttonBackCross1]} />
        <View style={[styles.buttonBar, styles.buttonBackCross2]} />
      </TouchableOpacity>
      <TransformerButton
        onPress={() => {
          setIsClose(!isClose);
        }}
        isClose={isClose}
      /> */}

      <View style={{ transform: [{ scale: 5 }, { translateY: 10 }] }}>
        <View
          style={{
            width: 10,
            height: 10,
            // borderRadius: 5,
            borderBottomColor: 'black',
            borderLeftWidth: 0.5,
            borderTopWidth: 0.5,
            borderTopLeftRadius: 5,
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderBottomEndRadius: 5,
            borderBottomStartRadius: 5,
          }}
        ></View>
      </View>
    </View>
  );
};

export default Main;
