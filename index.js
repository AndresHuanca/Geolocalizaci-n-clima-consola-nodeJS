//DOTEN V
require('dotenv').config();

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {

    // instancias
    const busquedas =  new Busquedas();
    let opt;

    
    do {

        opt = await inquirerMenu();
        console.log(opt);

        switch ( opt ) {
            case 1:
                //mostrar mensaje 
                const termino = await leerInput();
                
                //Buscar los lugares
                const lugares = await busquedas.ciudad( termino );
                // console.log(lugares);

                //selccionar el lugar 
                const id = await listarLugares( lugares );
                // if( id === '0' ) continue;
                // console.log( {id} );
 
                // encontrar lugar selcionao usando el id
                const lugarSel = lugares.find( l => l.id === id);
                // console.log( lugarSel );
                
                // guardar BD
                busquedas.agregarHistorial( lugarSel.nombre );

                //clima
                const clima = await busquedas.climaLugar( lugarSel.lat, lugarSel.lng );
                // console.log(clima);

                //mostrar resultados
                console.log('\nInformacion de la ciudad\n');
                console.log('Ciudad: ', lugarSel.nombre );
                console.log('Lat: ', lugarSel.lat );
                console.log('Lng: ', lugarSel.lng );
                console.log('Temperatura Minima: ', clima.min );
                console.log('Temperatura Maxima: ', clima.max );
                console.log('Descripcion de temperatura: ', clima.desc );
                break;
            
            case 2:
                busquedas.historial.forEach( (lugar, i) => {
                    const idx = `${ i + 1}`.green;
                    console.log( `${ idx } ${ lugar }` );
                });
                break;
        }

        await pausa();
    

    } while ( opt !== 0 );

};

main();