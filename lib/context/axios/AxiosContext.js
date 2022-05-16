import { __spreadArrays } from "tslib";
import React, { createContext } from 'react';
import { generateUnique } from '../../utils/utils';
var defaultAxiosContext = {
  logs: [],
  clearLogList: function () {},
  linkResponse: function () {}
};
var AxiosContext = createContext(defaultAxiosContext); // for keep logs 

var __logs = [];

var AxiosContextProvider = function (_a) {
  var children = _a.children,
      axiosInstances = _a.axiosInstances;

  var _b = React.useState(__spreadArrays(__logs)),
      logs = _b[0],
      setLogs = _b[1];

  var clearLogList = function () {
    __logs.splice(0, Number.MAX_SAFE_INTEGER);

    setLogs([]);
  };

  var createLog = function (config) {
    config.uid = generateUnique();
    var log = {
      uid: config.uid,
      time: Date.now(),
      config: config,
      method: config === null || config === void 0 ? void 0 : config.method
    };
    console.log("devTools::axios::request[" + config.uid + "] " + log.config.url);

    __logs.unshift(log);

    setLogs(__spreadArrays(__logs));
  };

  var linkResponse = function (response) {
    var log = __logs.find(function (log) {
      return log.uid === (response === null || response === void 0 ? void 0 : response.config.uid);
    });

    if (log) {
      log.isError = false;
      log.elapse = Date.now() - log.time;
      log.status = response.status;
      log.response = response;
      console.log("devTools::axios::response[" + (log === null || log === void 0 ? void 0 : log.uid) + "] " + log.status + " " + log.elapse + "ms ");
      setLogs(__spreadArrays(__logs));
    }
  };

  React.useEffect(function () {
    if (!Array.isArray(axiosInstances)) return;
    var requestInstancesIds = axiosInstances.map(function (instance) {
      return {
        instance: instance,
        interceptorId: instance.interceptors.request.use(function (config) {
          createLog(config);
          return config;
        }, function (error) {
          // TODO : implement cancel token 
          console.log('cancel', error);
          return error;
        })
      };
    });
    var responseInstancesIds = axiosInstances.map(function (instance) {
      return {
        instance: instance,
        interceptorId: instance.interceptors.response.use(function (response) {
          linkResponse(response);
          return response;
        }, function (error) {
          console.log(error);
          linkResponse(error.response);
          return Promise.reject(error);
        })
      };
    });
    return function () {
      requestInstancesIds.map(function (_a) {
        var instance = _a.instance,
            interceptorId = _a.interceptorId;
        instance.interceptors.request.eject(interceptorId);
      });
      responseInstancesIds.map(function (_a) {
        var instance = _a.instance,
            interceptorId = _a.interceptorId;
        instance.interceptors.response.eject(interceptorId);
      });
    };
  }, [axiosInstances]);
  return React.createElement(AxiosContext.Provider, {
    value: {
      logs: logs,
      clearLogList: clearLogList,
      linkResponse: linkResponse
    }
  }, children);
};

export { AxiosContext, AxiosContextProvider };