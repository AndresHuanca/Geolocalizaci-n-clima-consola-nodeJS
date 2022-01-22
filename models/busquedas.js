//files system
const fs = require('fs');
//importando axios
const axios = require('axios');



class Busquedas {
    
    
    constructor() {
        this.historial = [];
        this.dbPath = './db/database.json';
        this.leerBD();
    }

    //parametros de la peticion 
    get paramsMapbox() {
        return {
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY
        };
    }

    async ciudad( lugar = '' ) {

        try {
            //Peticion http
            const intance = axios.create({
                baseURL: `https://api.mapbox.com`,
                params: this.paramsMapbox
            });

            const resp = await intance.get(`geocoding/v5/mapbox.places/${lugar}.json`);
            
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

            // console.log(resp.data.features);
            // ({}) retorna un objeto de forma implicita
        
        } catch (error) {
            
            return []; 
        }

    }

      //parametros de la peticion  aOpene wheather
    get paramsOpenWheather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang: 'es'
        };
    }

    async climaLugar( lat, lon ) {

        try {
            //instance axios.create
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org`,
                params: {...this.paramsOpenWheather, lat, lon }
            });

            const resp = await instance.get(`data/2.5/weather`);
            const { weather, main } = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp

            };
            
        } catch (error) {
            console.log(error);
        }
    }

    // metodo
    agregarHistorial( lugar = '' ) {
        
        if( this.historial.includes( lugar.toLocaleLowerCase() ) ) {
            return;
        }

        this.historial.unshift( lugar.toLocaleLowerCase() );

        //grabar en DB
        this.guardarDB();
    }

    guardarDB() {

        const payload = {
            historial: this.historial
        };

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) );
    }

    leerBD() {

        if( !fs.existsSync( this.dbPath ) ) return;

        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' } );
        const data = JSON.parse( info );

        this.historial = data.historial;

    }

}

module.exports = Busquedas;