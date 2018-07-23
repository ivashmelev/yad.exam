import { loadList, loadDetails } from './api';//Импорт функции loadList и loadDetails из api.js
import { getDetailsContentLayout } from './details';//Импорт функции getDetailsContentLayout из details.js
import { createFilterControl } from './filter';//Импорт функции createFilterControl из filter.js

export default function initMap(ymaps, containerId) {//Обьявление функции initMap c параметрами ymaps и containerId | default написано мной для исправления исключения Object is not a function
  const myMap = new ymaps.Map(containerId, {//Объявление константы как объекта класса Map для создания карты
    center: [55.76, 37.64],//Координаты центра карты
    controls: [],//Создание карты без элементов управления
    zoom: 10//Коэффициент масштабирования
  });

  const objectManager = new ymaps.ObjectManager({//Инструмент для добавления большого числа объектов на карту
    clusterize: true,//Флаг, показывающий, нужно ли кластеризовать объекты. *https://habr.com/post/101338/
    gridSize: 64,//Размер ячейки кластеризатора, заданный пользователем.
    clusterIconLayout: 'default#pieChart',//Макет метки кластера
    clusterDisableClickZoom: false,//Флаг, запрещающий увеличение коэффициента масштабирования карты при клике на кластер
    geoObjectOpenBalloonOnClick: false,//Определяет показывать ли балун при щелчке на геообъекте.
    geoObjectHideIconOnBalloonOpen: false,//Скрывать иконку при открытии балуна.
    geoObjectBalloonContentLayout: getDetailsContentLayout(ymaps)//Макет для содержимого балуна|| Значение функция из detail.js 
  });

  objectManager.clusters.options.set('preset', 'islands#greenClusterIcons');//Устанавливает коллекции кластеров предустановленные опции islands#greenClusterIcons

  loadList().then(data => {//
    objectManager.add(data);
  });

  // details
  objectManager.objects.events.add('click', event => {
    const objectId = event.get('objectId');
    const obj = objectManager.objects.getById(objectId);

    objectManager.objects.balloon.open(objectId);

    if (!obj.properties.details) {
      loadDetails(objectId).then(data => {
        obj.properties.details = data;
        objectManager.objects.balloon.setData(obj);
      });
    }
  });

  // filters
  const listBoxControl = createFilterControl(ymaps);
  myMap.controls.add(listBoxControl);

  var filterMonitor = new ymaps.Monitor(listBoxControl.state);
  filterMonitor.add('filters', filters => {
    objectManager.setFilter(
      obj => filters[obj.isActive ? 'active' : 'defective']
    );
  });
}
