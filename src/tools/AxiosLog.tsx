import React, { useContext } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';

import Button from '../components/Button';
import { AxiosContext } from '../context/axios/AxiosContext';
import ResizeableView from '../components/ResizeableView';
import { IAxiosLog } from '../context/@types/axios';
import { ToolContext } from '../context/toolManager/ToolContext';
import { ScrollView } from 'react-native-gesture-handler';
import { useASStoredState } from '../utils/ASStore';
import ClearIconView from '../components/ClearIconView';
import DevTreeView from 'react-native-dev-treeview';
import Clipboard from "@react-native-clipboard/clipboard";
const Scenes = require('react-native-scenes').default;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff88',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#fafafa',
  },
  logItem: {
    flexDirection: 'row',
    marginHorizontal: 3,
    marginVertical: 5,
  },
  log: {
    color: '#333',
    marginHorizontal: 5,
    fontSize: 6,
    backgroundColor: 'transparent'
  },
  query: {
    color: '#666',
    marginHorizontal: 5,
    fontSize: 8,
    backgroundColor: 'transparent'
  },
  logStatusText: {
    color: 'white',
  },
  logStatus: {
    margin: 5,
    height: 30,
    minWidth: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  headerExtra: {
    flexDirection: 'row',
  },
  elapse: {
    color: '#ccc',
  }
});

const AxiosLogFontSizeContext = React.createContext<{ fontSize: number }>({
  fontSize: 14
});

const AxiosLogDetail = ({ log, ...etc }: { log: IAxiosLog, pop: Function }) => {
  const { } = etc;
  const { fontSize } = React.useContext(AxiosLogFontSizeContext);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <Text> - Request</Text>
        <ScrollView style={{ width: '100%', backgroundColor: '#333' }} horizontal >
          <DevTreeView autoExtendRoot={true} fontSize={fontSize} data={{ ...log.config }} onCopy={Clipboard.setString} />
        </ScrollView>
        <Text> - Response</Text>
        <ScrollView style={{ width: '100%', backgroundColor: '#333' }} horizontal >
          <DevTreeView autoExtendRoot={true} fontSize={fontSize} data={{ ...log.response }} onCopy={Clipboard.setString}/>
        </ScrollView>
        <Text> - All</Text>
        <ScrollView style={{ width: '100%', backgroundColor: '#333' }} horizontal >
          <DevTreeView autoExtendRoot={true} fontSize={fontSize} data={{ ...log }} onCopy={Clipboard.setString}/>
        </ScrollView>
      </ScrollView>
    </View>
  )
}

const colorForStatus = (status: number | undefined): string | undefined => {
  if (typeof status === 'undefined') return;
  else if (status >= 200 && status < 400) return '#229922';
  else if (status >= 400 && status < 500) return '#c82';
  else if (status >= 500) return '#C33';
  return;
}

const AxiosLogItem = ({ log, push }: { log: IAxiosLog, push: Function }) => {
  const { fontSize } = React.useContext(AxiosLogFontSizeContext);
  return (
    <TouchableOpacity style={styles.logItem} onPress={() => {
      push({
        component: AxiosLogDetail,
        barHidden: true,
        passProps: {
          log
        }
      })
    }}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        {log.response ? (
          <View style={[styles.logStatus, { backgroundColor: colorForStatus(log.status) }]}>
            {<Text style={[styles.logStatusText, { fontSize: fontSize * 0.6 }]} allowFontScaling={false} >{log?.method?.toUpperCase?.()}</Text>}
            <Text style={[styles.logStatusText, { fontSize: fontSize * 0.6 }]} allowFontScaling={false}>{log.status}</Text>
          </View>
        ) : (
          <View style={[styles.logStatus, { borderRadius: 0, }]}>
            {<Text style={[styles.log, { fontSize: fontSize * 0.6 }]} allowFontScaling={false}>{log?.method?.toUpperCase?.()}</Text>}
            <ActivityIndicator size="small" color="white" />
          </View>
        )}
      </View>
      <View style={{ justifyContent: 'center' }}>
        <Text style={[styles.log, { fontSize }]} selectable={true}>
          {log.config.url}
          {!!log.elapse && <Text style={[styles.elapse, { fontSize }, log.elapse > 1000 && { color: '#c00' }]} selectable={true}>
            {' '}{log.elapse}ms
          </Text>}
        </Text>
        <Text style={[styles.query, { fontSize }]} selectable={true}>
          {JSON.stringify(log?.config?.params)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const AxiosLogList = (props: any) => {
  const { push } = props;
  const { logs } = useContext(AxiosContext);
  return (
    <FlatList
      style={{ flex: 1 }}
      data={logs}
      keyExtractor={(item: IAxiosLog, _: number) => item.uid as string}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      renderItem={({ item }) => (
        <AxiosLogItem log={item} push={push} />
      )}
    />
  )
};

const AxoisLog = (): JSX.Element | null => {
  const { clearLogList } = useContext(AxiosContext);
  const { axiosLog: [isShow, setShow] = [] } = useContext(ToolContext);
  const scenesRef = React.useRef<any>();
  const [routeIndex, setRouteIndex] = React.useState<number>(0);
  const [fontSize, setFontSize] = useASStoredState('axios_log_fontSize', 10);
  const [logCount, setLogCount] = useASStoredState('axios_log_count', 100);

  if (!isShow) return null;
  const { logs } = useContext(AxiosContext);

  const fontSizeUp = () => setFontSize(prev => Math.min(24, prev + 1));
  const fontSizeDown = () => setFontSize(prev => Math.max(7, prev - 1));
  const innerTools = (extra: any) => {
    return (
      <View style={styles.headerExtra}>
        <Button onPress={fontSizeUp}>+</Button>
        <Button onPress={fontSizeDown}>-</Button>
        <Button onPress={() => {
          setLogCount(prev => (prev) % 500 + 100);
        }}>{`${logCount}`}</Button>
        <Button onPress={clearLogList} >
          <ClearIconView />
        </Button>

        {extra}
      </View>
    )
  }

  return (
    <ResizeableView
      title={'AxiosLog'}
      onClose={() => {
        if (routeIndex == 0) setShow(false);
        scenesRef.current?.pop?.();
      }}
      isClose={routeIndex == 0}
      renderHeaderExtra={innerTools}
      renderFooter={() => {
        return innerTools(
          <View style={{ justifyContent: 'center', paddingHorizontal: 3 }}>
            <Text style={{ fontSize, color: 'white' }}>{logs.length} logs</Text>
          </View>
        )
      }}
    >
      <AxiosLogFontSizeContext.Provider value={{ fontSize }}>
        <Scenes
          ref={scenesRef}
          style={styles.container}
          route={{ component: AxiosLogList, barHidden: true }}
          routeWillChange={(index: number) => setRouteIndex(index)}
        />
      </AxiosLogFontSizeContext.Provider>
    </ResizeableView >
  );
};

export default AxoisLog;
