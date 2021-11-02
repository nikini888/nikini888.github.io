const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connect error:'));
db.once('open', () => {
    console.log('Connect Database!')
})

const sample = function (array) {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const randomNum = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20 + 10);
        const camp = new Campground({
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[randomNum].longitude,
                    cities[randomNum].latitude
                ]
            },
            title: `${sample(descriptors)} ${sample(places)} `,
            author: "614f310934fed721481334ac",
            description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi quidem tempore, esse eaque totam omnis est, doloremque nesciunt corporis quis voluptas odio maxime iure sed libero. Vel, recusandae cupiditate! Saepe?",
            price,
            images: [{
                url: 'https://res.cloudinary.com/nikini888/image/upload/v1633174281/yelpcamp/w0tef2rn157ltdbdr4qp.jpg',
                fileName: 'yelpcamp/w0tef2rn157ltdbdr4qp'
            },
            ]
        });
        await camp.save();

    };
}
// const sample = array => array[Math.floor(Math.random() * array.length)];


// const seedDB = async () => {
//     await Campground.deleteMany({});
//     for (let i = 0; i < 50; i++) {
//         const random1000 = Math.floor(Math.random() * 1000);
//         const camp = new Campground({
//             location: `${cities[random1000].city}, ${cities[random1000].state}`,
//             title: `${sample(descriptors)} ${sample(places)}`
//         })
//         await camp.save();
//     }
// }

seedDb().then(() => {
    mongoose.connection.close();
})