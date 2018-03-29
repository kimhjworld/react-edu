import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

/*ie 하위버전 가능하게해라. */
import Promise from 'promise-polyfill';
// To add to window
if (!window.Promise) {
  window.Promise = Promise;
}


const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
