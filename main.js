//Selectores del DOM
const searchForm = document.querySelector('.search-form');
const input = document.querySelector('input');
const dictionaryApp = document.querySelector('.dictionary-app');

//LOGICA API
// Funcion asincrona para obtener datos de la API externa
async function searchWord(word) {
    if (!word) return;

    try {
        //Peticion a la API del diccionario
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        //Verificacion si la peticion fue exitosa
        if (!response.ok) {
            throw new Error('Word not found');
        }

        //Convertimos la respuesta en un json manipulable
        const data = await response.json();
        renderResult(data[0]);

        //Manejo de errores
    } catch (error) {
        alert("Sorry, we couldn't find that word.");
        console.error(error);
    }
}

//LOGICA DE INTERFAZ (UI)
//Funcion encargada de actualizar el HTML con los datos recibidos desde la API
function renderResult(data) {
    const results = document.querySelectorAll('.result');
    const audioContainer = document.querySelector('.property:nth-child(3)');

    //Insertamos la palabra principal
    results[0].textContent = data.word;

    //Insertamos la fonetica o uno alternativo
    results[1].textContent = data.phonetic || (data.phonetics[1] ? data.phonetics[1].text : 'N/A');

    //Manejo de audio: Limpiamos contenedor y buscamos archivo de audio
    audioContainer.innerHTML = '<span>Audio:</span>';
    const audioSrc = data.phonetics.find(p => p.audio !== '')?.audio;

    //Si existe audio, creamos el elemento audio
    if (audioSrc) {
        const audioBtn = document.createElement('audio');
        audioBtn.controls = true;
        audioBtn.src = audioSrc;
        audioContainer.appendChild(audioBtn);

        //Si no hay audio, informamos al usuario
    } else {
        const noAudio = document.createElement('span');
        noAudio.textContent = "No audio available";
        audioContainer.appendChild(noAudio);
    }

    //Insertamos la definicion
    const definition = data.meanings[0].definitions[0].definition;
    results[2].textContent = definition;

    //Insertamos el ejemplo
    const example = data.meanings[0].definitions[0].example;
    results[3].textContent = example ? `"${example}"` : "No example available";

    //Insertamos la categoria gramatical
    results[4].textContent = data.meanings[0].partOfSpeech;
}

//ESCUCHADORES
//Escuchamos envio del formulario
searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); //Prevenir recarga de la pagina
    searchWord(input.value.trim()); //Eliminamos espacios accidentales
});

//Soporte para la tecla Enter
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWord(input.value.trim());
    }
});