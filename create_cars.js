const mongoose = require('mongoose');
const Car = require('./models/Car');

mongoose.connect('mongodb://localhost:27017/EcoCovoit', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const cars = [
  { model: 'Peugeot 208', plate: 'AB-123-CD', seats: 5, horsepower: 100, engine: 'Essence', image: 'https://www.largus.fr/images/2023-09/Peugeot-e-208-restylee-2023-015.jpg' },
  { model: 'Renault Clio', plate: 'DE-456-FG', seats: 5, horsepower: 90, engine: 'Diesel', image: 'https://p.turbosquid.com/ts-thumb/te/dHnqkQ/xc/1200x1200/jpg/1640696457/600x600/fit_q87/4a8025881962c2d5e3237aba78f1ab8dfce9166e/1200x1200.jpg' },
  { model: 'Toyota Prius', plate: 'GH-789-HI', seats: 5, horsepower: 122, engine: 'Hybride', image: 'https://p.turbosquid.com/ts-thumb/he/KopJSn/1rvYRzdL/2019_toyota_prius_0000/jpg/1594135901/600x600/fit_q87/1b6fb65bb921667826e446cd284158bc9e96aaec/2019_toyota_prius_0000.jpg' },
  { model: 'Tesla Model 3', plate: 'JK-101-LM', seats: 5, horsepower: 283, engine: 'Électrique', image: 'https://3dnews.ru/assets/external/illustrations/2023/03/16/1083498/sm.GUID0DD.800.jpg' },
  { model: 'Ford Mustang', plate: 'NO-112-PQ', seats: 4, horsepower: 310, engine: 'Essence', image: 'https://p.turbosquid.com/ts-thumb/zd/7Y1TqP/93/fmgt_2023_01/jpg/1667217076/600x600/fit_q87/667c72917452842cc32fe61ce04e367fcd68ab75/fmgt_2023_01.jpg' },
  { model: 'Volkswagen Golf', plate: 'RS-345-TU', seats: 5, horsepower: 110, engine: 'Diesel', image: 'https://p.turbosquid.com/ts-thumb/1D/SolkUB/1AzPLjpL/f/jpg/1584876778/600x600/fit_q87/439144c408a9ec7f1c39d6e37efa4751a9170ab4/f.jpg' },
  { model: 'BMW 330e', plate: 'VW-678-XY', seats: 5, horsepower: 292, engine: 'Hybride', image: 'https://www.bmwlevis.com/images/ckfinder/BMW%20330e%202022%20-%205_1.jpg' },
  { model: 'Audi e-tron', plate: 'ZA-901-BC', seats: 5, horsepower: 402, engine: 'Électrique', image: 'https://p.turbosquid.com/ts-thumb/CT/sGhocV/Gb/2022_audi_etron_gt_0000/jpg/1623657341/600x600/fit_q87/1b3934c7b8e43cbae6d00f74f8dd1b3dd72b1849/2022_audi_etron_gt_0000.jpg' },
  { model: 'Fiat 500', plate: 'CD-234-DE', seats: 4, horsepower: 69, engine: 'Essence', image: 'https://p.turbosquid.com/ts-thumb/Rk/X1gBRc/xvk8aLgm/fiat500_laprima_2021_01/jpg/1593049955/600x600/fit_q87/68580a9cc64362ed495d8a18a02f40c7201638d2/fiat500_laprima_2021_01.jpg' },
  { model: 'Citroën C4', plate: 'EF-567-FG', seats: 5, horsepower: 130, engine: 'Diesel', image: 'https://www.moteurnature.com/zvisu/1813/79/Citroen-C4.jpg' },
  { model: 'Kia Niro', plate: 'GH-890-HI', seats: 5, horsepower: 141, engine: 'Hybride', image: 'https://www.kia.com/content/dam/kwcms/kme/global/en/assets/360vr/niro-ev-sx-my24/ud-clear-white/17_alloy_wheel/kia-niro-ev-sx-my23-udclearwhite-17_0000.jpg' },
  { model: 'Nissan Leaf', plate: 'IJ-123-JK', seats: 5, horsepower: 150, engine: 'Électrique', image: 'https://media.sketchfab.com/models/44c1adc081b04051abba11bdb77c1075/thumbnails/8443af7b5d2440c882754db2b00fcff0/b8e2502f0e5d4529b63b38899b232a4b.jpeg' },
  { model: 'Mercedes Classe A', plate: 'KL-456-LM', seats: 5, horsepower: 136, engine: 'Essence', image: 'https://cdn.drivek.com/configurator-imgs/cars/fr/Original/MERCEDES/A-CLASS/41348_HATCHBACK-5-DOORS/mercedes-benz-classe-a-hb-front-view.jpg' },
  { model: 'Opel Corsa', plate: 'MN-789-NO', seats: 5, horsepower: 75, engine: 'Diesel', image: 'https://images.caradisiac.com/logos-ref/modele/modele--opel-corsa-5/S0-modele--opel-corsa-5.jpg' },
  { model: 'Hyundai Ioniq', plate: 'OP-012-PQ', seats: 5, horsepower: 141, engine: 'Hybride', image: 'https://cdn.3dmodels.org/wp-content/uploads/Hyundai/243_Hyundai_Ioniq_Mk1f_AE_hybrid_2019/Hyundai_Ioniq_Mk1f_AE_hybrid_2019_1000_0001.jpg' },
  { model: 'Porsche Taycan', plate: 'QR-345-RS', seats: 4, horsepower: 571, engine: 'Électrique', image: 'https://p.turbosquid.com/ts-thumb/8P/UcyonB/xO/porsche_taycan_4s_cross_turismo_2021_0000/jpg/1616251095/600x600/fit_q87/cba37ce26adf629602829d6b19ecab5bebb44968/porsche_taycan_4s_cross_turismo_2021_0000.jpg' },
  { model: 'Seat Ibiza', plate: 'TU-678-VW', seats: 5, horsepower: 80, engine: 'Essence', image: 'https://www.turbo.fr/sites/default/files/migration/model/field_image/000000008645876.jpg' },
  { model: 'Skoda Octavia', plate: 'XY-901-ZA', seats: 5, horsepower: 150, engine: 'Diesel', image: 'https://p.turbosquid.com/ts-thumb/59/u8WEJH/e5/skodaoctaviacombi20201/jpg/1624454596/600x600/fit_q87/aa8189e31f3628420fda9b1751d5940122888c41/skodaoctaviacombi20201.jpg' },
  { model: 'Volvo XC40 Recharge', plate: 'BC-234-CD', seats: 5, horsepower: 408, engine: 'Hybride', image: 'https://cdn.motor1.com/images/mgl/A8zbL/s1/volvo-xc40-recharge-2020.webp' },
  { model: 'Mini Cooper SE', plate: 'DE-567-EF', seats: 4, horsepower: 184, engine: 'Électrique', image: 'https://cdn.lesnumeriques.com/optim/gallery/12/12877/08c56992-hatch-3-portes-electric-yours__450_400.jpg' }
];


Car.insertMany(cars)
  .then(() => {
    console.log('Voitures ajoutées avec succès');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Erreur lors de l\'ajout des voitures', error);
    mongoose.connection.close();
  });
