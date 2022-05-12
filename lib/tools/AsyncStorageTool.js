import { __assign, __awaiter, __generator, __spreadArrays } from "tslib";
import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../components/Button';
import ResizeableView from '../components/ResizeableView';
import { ToolContext } from '../context/toolManager/ToolContext';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateUnique } from '../utils/utils';
import { useASStoredState } from '../utils/ASStore';
import ClearIconView from '../components/ClearIconView';
import DevTreeView from 'react-native-dev-treeview';
import Clipboard from "@react-native-clipboard/clipboard";
var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'white'
  },
  logItem: {
    flexDirection: 'row',
    marginHorizontal: 3,
    marginVertical: 5
  },
  log: {
    color: '#ffffff',
    marginHorizontal: 5,
    fontSize: 8,
    backgroundColor: 'transparent'
  },
  query: {
    color: '#ffffff',
    marginHorizontal: 5,
    fontSize: 8,
    backgroundColor: 'transparent'
  },
  logStatus: {
    margin: 5,
    height: 30,
    width: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  headerExtra: {
    flexDirection: 'row'
  }
});

var AsyncStorageToolView = function (_a) {
  var fontSize = _a.fontSize;

  var _b = React.useState(),
      data = _b[0],
      setData = _b[1];

  var loadAllAsyncStorage = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var keys, data;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4
            /*yield*/
            , AsyncStorage.getAllKeys()];

          case 1:
            keys = _a.sent();
            return [4
            /*yield*/
            , AsyncStorage.multiGet(__spreadArrays(keys))];

          case 2:
            data = _a.sent();
            setData(data.reduce(function (p, _a) {
              var _b, _c;

              var k = _a[0],
                  v = _a[1];
              if (!v) return __assign(__assign({}, p), (_b = {}, _b[k] = v, _b)); // return { ...p, [k]: JSON.parse(v) };
              // console.log( k, v, JSON.parse( v ));

              var parsed = v;

              try {
                parsed = JSON.parse(v);
              } catch (e) {
                parsed = v;
              } finally {
                return __assign(__assign({}, p), (_c = {}, _c[k] = parsed, _c));
              }
            }, {}));
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  React.useEffect(function () {
    loadAllAsyncStorage();
  }, []);
  if (!data) return null;
  return React.createElement(ScrollView, {
    style: {
      flex: 1
    }
  }, React.createElement(ScrollView, {
    horizontal: true
  }, React.createElement(DevTreeView, {
    key: "" + fontSize,
    fontSize: fontSize,
    autoExtendRoot: true,
    data: data,
    onCopy: Clipboard.setString
  })));
};

var AsyncStorageTool = function () {
  var _a = useContext(ToolContext).asyncStorage,
      _b = _a === void 0 ? [] : _a,
      isShow = _b[0],
      setShow = _b[1];

  var _c = React.useState(generateUnique()),
      uid = _c[0],
      setUid = _c[1];

  var _d = useASStoredState('AsyncStorage_FontSize', 14),
      fontSize = _d[0],
      setFontSize = _d[1];

  if (!isShow) return null;

  var refresh = function () {
    setUid(generateUnique());
  };

  var removeAll = function () {
    return __awaiter(void 0, void 0, void 0, function () {
      var _a, _b;

      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            _b = (_a = AsyncStorage).multiRemove;
            return [4
            /*yield*/
            , AsyncStorage.getAllKeys()];

          case 1:
            return [4
            /*yield*/
            , _b.apply(_a, [_c.sent()])];

          case 2:
            _c.sent();

            refresh();
            return [2
            /*return*/
            ];
        }
      });
    });
  };

  var fontSizeUp = function () {
    setFontSize(function (prev) {
      return Math.min(24, prev + 1);
    });
  };

  var fontSizeDown = function () {
    setFontSize(function (prev) {
      return Math.max(7, prev - 1);
    });
  };

  return React.createElement(ResizeableView, {
    title: 'AsyncStorage',
    onClose: function () {
      return setShow(false);
    },
    renderHeaderExtra: function () {
      return React.createElement(View, {
        style: styles.headerExtra
      }, React.createElement(Button, {
        onPress: fontSizeUp
      }, "+"), React.createElement(Button, {
        onPress: fontSizeDown
      }, "-"), React.createElement(Button, {
        onPress: refresh
      }, "R"), React.createElement(Button, {
        onPress: removeAll
      }, React.createElement(ClearIconView, null)));
    }
  }, React.createElement(AsyncStorageToolView, {
    key: uid,
    fontSize: fontSize
  }));
};

export default AsyncStorageTool;