import { __assign } from "tslib";
import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import ASGesutreResponder from '../useASGesutreResponder';
import { useTools } from '../../context/toolManager/ToolContext'; // const HandleWidth = 20;

var HandleOuterHeight = 55;
var HandleHeight = 35;
var styles = StyleSheet.create({
  handle: {
    position: 'absolute',
    top: '50%',
    marginTop: -HandleOuterHeight / 2,
    width: 35,
    height: HandleOuterHeight,
    justifyContent: 'center',
    alignItems: 'flex-end',
    zIndex: Number.MAX_SAFE_INTEGER - 1,
    overflow: 'hidden'
  },
  handleRight: {
    right: 0,
    alignItems: 'flex-end'
  },
  handleLeft: {
    left: 0,
    alignItems: 'flex-start'
  },
  handleInner: {
    width: HandleHeight,
    height: HandleHeight,
    marginRight: -20,
    borderRadius: HandleHeight / 2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    shadowColor: 'black',
    shadowRadius: 5,
    shadowOpacity: 0.2,
    elevation: 10
  },
  handleInnerRight: {
    paddingRight: 21.5,
    paddingLeft: 7,
    marginLeft: 0,
    marginRight: -20,
    shadowOffset: {
      width: -2,
      height: 0
    }
  },
  handleInnerLeft: {
    paddingLeft: 21.5,
    paddingRight: 7,
    marginRight: 0,
    marginLeft: -20,
    shadowOffset: {
      width: 2,
      height: 0
    }
  },
  handleBar: {
    height: 13,
    width: 2,
    borderRadius: 1,
    backgroundColor: '#eaeaea'
  }
});

var ToolHandle = function (_a) {
  var isRight = _a.isRight,
      onPress = _a.onPress,
      backgroundColor = _a.backgroundColor,
      translateX = _a.translateX;
  var handle = ASGesutreResponder({
    key: 'Handle',
    initialValue: {
      x: 0,
      y: 0
    },
    onPress: onPress
  });
  var pallete = useTools().pallete;
  return React.createElement(Animated.View, {
    style: [styles.handle, isRight ? styles.handleRight : styles.handleLeft, {
      transform: [{
        translateY: handle.pan.y
      }, {
        translateX: translateX
      }]
    }]
  }, React.createElement(View, __assign({
    style: [styles.handleInner, isRight ? styles.handleInnerRight : styles.handleInnerLeft, {
      backgroundColor: pallete.mainBg
    }, {
      backgroundColor: backgroundColor
    }]
  }, handle.responder), React.createElement(View, {
    style: [styles.handleBar, {
      backgroundColor: pallete.line
    }]
  }), React.createElement(View, {
    style: [styles.handleBar, {
      backgroundColor: pallete.line
    }]
  })));
};

export default ToolHandle;