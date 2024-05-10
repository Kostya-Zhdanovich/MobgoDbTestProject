document.addEventListener('DOMContentLoaded', function() {
    // Функция для загрузки информации о городах из базы данных и отображения его в таблице
    function loadCities() {
        fetch('/api/city/all')
            .then(response => response.json())
            .then(data => {
                const cityBody = document.getElementById('cityBody');
                cityBody.innerHTML = ''; // Очищаем таблицу перед обновлением

                data.forEach(city => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${city._id}</td>
                        <td>${city.name}</td>
                        <td>${city.yearFounded}</td>
                        <td>${city.population}</td>
                        <td>${city.capital ? 'Да' : 'Нет'}</td>
                    `;
                    cityBody.appendChild(row);
                });
            })
            .catch(error => console.error('Произошла ошибка при загрузке:', error));
    }

    // Загрузка информации при загрузке страницы
    loadCities();

    // Обработчик события для кнопки "Обновить таблицу"
    document.getElementById('refreshCity').addEventListener('click', function() {
        loadCities();
    });

    // Добавляем обработчик события для формы добавления города
    document.getElementById('addCityForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        const city = {}; // Создание объекта для хранения данных
        formData.forEach((value, key) => {
            city[key] = value; // Заполнение объекта данными из формы
        });

        fetch('/api/city', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(city)
        })
        .then(response => response.json())
        .then(response => {
            loadCities(); // Перезагружаем таблицу после успешного добавления
            this.reset(); // Очищаем форму
            alert(response.message);
        })
        .catch(error => console.error('Произошла ошибка при добавлении города:', error));
    });

    // Добавляем обработчик события для формы редактирования города
    document.getElementById('editCityForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const cityId = formData.get('editCityId');

        const city = {};
        formData.forEach((value, key) => {
            city[key] = value;
        });

        fetch(`/api/city/${cityId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(city)
        })
        .then(response => response.json())
        .then(response => {
            loadCities(); // Перезагружаем таблицу после редактирования
            alert(response.message);
        })
        .catch(error => console.error('Произошла ошибка при редактировании города:', error));

        this.reset();
    });

    // Добавляем обработчик события для формы удаления города
    document.getElementById('deleteCityForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const cityId = formData.get('deleteCityId');

        fetch(`/api/city/${cityId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(response => {
            loadCities(); // Перезагружаем таблицу после удаления
            alert(response.message);
        })
        .catch(error => console.error('Произошла ошибка при удалении города:', error));

        this.reset();
    });

    document.getElementById('showCapitalsForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const minPopulation = document.getElementById('minPopulation').value;
    
        fetch(`/api/city/capitals/${minPopulation}`)
            .then(response => response.json())
            .then(data => {
                let resultHTML = '<h2>Столицы с населением больше указанного:</h2>';
                if (data.length === 0) {
                    resultHTML += '<p>Нет столиц с населением больше указанного значения.</p>';
                } else {
                    resultHTML += '<ul>';
                    data.forEach(city => {
                        resultHTML += `<li>${city.name} (Население: ${city.population})</li>`;
                    });
                    resultHTML += '</ul>';
                }
                document.getElementById('cityResults').innerHTML = resultHTML;
            })
            .catch(error => console.error('Произошла ошибка при запросе на сервер:', error));
    });s
});
