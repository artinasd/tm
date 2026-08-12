import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux"
import ReduxStore from "./Redux/ReduxStore.js";

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <Provider store={ReduxStore}>
            <App />
        </Provider>
  </StrictMode>,
)
