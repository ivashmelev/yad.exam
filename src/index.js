import initMap from "./map"; //Импорт функции initMap из map.js

ymaps.ready(() => { //Запуск функции InitMap после прогрузки DOM
  initMap(ymaps, "map"); //Вызов initMap с парамемтрами ymaps и идентификатором контейнера карты map
  console.log("inited"); //Вывод в консоль сообщения 
});

