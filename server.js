const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/citiesDB', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const citySchema = new mongoose.Schema({
    name: String,
    yearFounded: Number,
    population: Number,
    capital: Boolean
}, { collection: 'cities' });

const City = mongoose.model('City', citySchema);

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Добавление нового города
app.post('/api/city', async (req, res) => {
    try {
        const { name, yearFounded, population, capital } = req.body;
        const newCity = new City({ name, yearFounded, population, capital });
        await newCity.save();
        res.json({ message: 'Город успешно добавлен' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение всех городов
app.get('/api/city/all', async (req, res) => {
    try {
        const cities = await City.find({});
        res.json(cities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение столиц с населением больше заданного
app.get('/api/city/capitals/:population', async (req, res) => {
    try {
        const population = parseInt(req.params.population);
        const capitals = await City.find({ capital: true, population: { $gt: population } });
        res.json(capitals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Обновление информации о городе по ID
app.put('/api/city/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, yearFounded, population, capital } = req.body;
        const updatedCity = await City.findByIdAndUpdate(id, {
            name,
            yearFounded,
            population,
            capital
        }, { new: true });
        if (!updatedCity) {
            return res.status(404).json({ message: 'Город не найден' });
        }
        res.json({ message: 'Информация о городе успешно обновлена', city: updatedCity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удаление города по ID
app.delete('/api/city/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedCity = await City.findByIdAndDelete(id);
        if (!deletedCity) {
            return res.status(404).json({ message: 'Город не найден' });
        }
        res.json({ message: 'Город успешно удален', city: deletedCity });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Удаление всех городов
app.delete('/api/city', async (req, res) => {
    try {
        await City.deleteMany({});
        res.json({ message: 'Все города успешно удалены' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
