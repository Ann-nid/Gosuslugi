import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000';

function App() {

  //память сайта, хранилища (массивы)
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [cities, setCities] = useState([]);

  // Поля формы
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('1'); // По умолчанию ставим ID первого города

  useEffect(() => {   //срабатывает при открытии вкладки в браузере
    loadData();
  }, []);

  const loadData = () => {    //запросы на бэкэнд и сохранение в память
    axios.get(`${API_URL}/users`).then(res => setUsers(res.data)).catch(err => console.error(err));
    axios.get(`${API_URL}/requests`).then(res => setRequests(res.data)).catch(err => console.error(err));
    axios.get(`${API_URL}/cities`)
      .then(res => {
        setCities(res.data);
        if (res.data.length > 0) {
          const firstCity = res.data[0];
          const firstId = firstCity.id || firstCity.city_id || firstCity.cityId;
          if (firstId) setSelectedCityId(firstId);
        }
      })
      .catch(err => console.error(err));
  };

  const handleAddUser = (e) => {   //собирает данные из полей ввода
    e.preventDefault();
    if (!fullName || !email || !selectedCityId) return alert('Заполните все поля!');
    
    axios.post(`${API_URL}/users`, {    //отправляет запрос на сервер
      fullName, 
      email, 
      phone: "+7 (999) 000-00-00", 
      cityId: Number(selectedCityId) 
    })
      .then(() => {            //если все ок --> очищение полей и обновление списка
        setFullName('');
        setEmail('');
        loadData();
      })
      .catch(err => {          //если сработает триггер
        console.error(err);
        alert('Ошибка при добавлении пользователя.');
      });
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm('Удалить гражданина и его заявки?')) return;
    axios.delete(`${API_URL}/users/${id}`)
      .then(() => loadData())
      .catch(err => console.error(err));
  };

  const handleChangeStatus = (requestId, currentStatus) => {
    const newStatus = prompt('Введите новый статус:', currentStatus);
    if (!newStatus) return;
    const comment = prompt('Комментарий ведомства:');
    
    axios.put(`${API_URL}/requests/${requestId}/status`, { status: newStatus, comment })
      .then(() => loadData())
      .catch(err => console.error(err));
  };

  //Превращение ID города в название
  const getCityName = (cityIdField) => {
    const cId = Number(cityIdField);
    
    //Поиск в бд
    if (cities && cities.length > 0) {
      const found = cities.find(c => Number(c.id) === cId || Number(c.city_id) === cId || Number(c.cityId) === cId);
      if (found) {
        const name = found.name || found.cityName || found.cityname || found.title;
        if (name) return name;
      }
    }
    
    //Подмена если не нашлось
    if (cId === 1) return "Москва";
    if (cId === 2) return "Санкт-Петербург";
    if (cId === 3) return "Казань";
    
    return `Город №${cId}`;
  };

  return (
    <div className="page-wrapper">
      <h1>Панель Управления СУБД (Госуслуги)</h1>

      <h3>Внесение записи о гражданине:</h3>
      <form onSubmit={handleAddUser}>
        <input 
          type="text" 
          placeholder="ФИО гражданина" 
          value={fullName} 
          onChange={(e) => setFullName(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        
        <select 
          value={selectedCityId} 
          onChange={(e) => setSelectedCityId(e.target.value)}
          className="city-select"
        >
          {/* Если база пуста, показываем дефолтные варианты для выбора */}
          {cities.length === 0 ? (
            <>
              <option value="1">Москва</option>
              <option value="2">Санкт-Петербург</option>
              <option value="3">Казань</option>
            </>
          ) : (
            cities.map(city => {
              const cId = city.id || city.city_id || city.cityId;
              const cName = city.name || city.cityName || city.cityname || city.title;
              return (
                <option key={cId} value={cId}>
                  {cName || `Город №${cId}`}
                </option>
              );
            })
          )}
        </select>

        <button type="submit">Добавить в базу</button>
      </form>

    
      <h2>Реестр граждан</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>ФИО</th>
            <th>Email</th>
            <th>Город проживания</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => {
            const rawCityId = user.cityId || user.city_id || user.cityId;
            return (
              <tr key={user.id}>
                <td><b>{user.id}</b></td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td><span className="status-badge">{getCityName(rawCityId)}</span></td>
                <td>
                  <button className="btn-delete" onClick={() => handleDeleteUser(user.id)}>Удалить</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      
      <h2>Реестр заявок на услуги</h2>
      <table>
        <thead>
          <tr>
            <th>ID Заявки</th>
            <th>ID Гражданина</th>
            <th>Название услуги</th>
            <th>Статус</th>
            <th>Комментарий</th>
            <th>Действие</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td><b>{req.id}</b></td>
              <td>{req.userId || req.user_id}</td>
              <td>
                {(() => {
                  const sId = Number(req.serviceId || req.service_id);
                  if (sId === 1) return "Выдача паспорта гражданина РФ";
                  if (sId === 2) return "Регистрация транспортного средства";
                  if (sId === 3) return "Запись на прием к врачу";
                  if (sId === 4) return "Оформление загранпаспорта";
                  return `Услуга №${sId}`;
                })()}
              </td>
              <td><span className="status-badge">{req.status}</span></td>
              <td><i>{req.comment || '—'}</i></td>
              <td>
                <button className="btn-status" onClick={() => handleChangeStatus(req.id, req.status)}>Статус</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;