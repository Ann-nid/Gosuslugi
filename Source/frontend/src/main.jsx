import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>  //проверка на ошибки
    <App />  //запуск интерфейса из файла app.jsx 
  </StrictMode>,
)
