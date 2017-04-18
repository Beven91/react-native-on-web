import React from 'react';

var emptyFunction = function() {};

function StatusBar() {
  return null;
}

StatusBar.setBarStyle = emptyFunction;
StatusBar.setHidden = emptyFunction;
StatusBar.setNetworkActivityIndicatorVisible = emptyFunction;
StatusBar.setBackgroundColor = emptyFunction;
StatusBar.setTranslucent = emptyFunction;
StatusBar.isReactNativeComponent = true;
StatusBar.currentHeight  =0;

export default StatusBar;