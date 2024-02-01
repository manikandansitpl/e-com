import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux';
import store from './redux/store.js';
import ContextWrapper from './utils/Context.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextWrapper>
      <App />
      </ContextWrapper>
    </Provider>
  </React.StrictMode>,
)
