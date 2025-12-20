const searchForm = document.querySelector('.search-form');
const input = document.querySelector('input');
const dictionaryApp = document.querySelector('.dictionary-app');

async function searchWord(word) {
    if (!word) return;

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        if (!response.ok) {
            throw new Error('Word not found');
        }

        const data = await response.json();
        renderResult(data[0]);

    } catch (error) {
        alert("Sorry, we couldn't find that word.");
        console.error(error);
    }
}

function renderResult(data) {
    const results = document.querySelectorAll('.result');
    const audioContainer = document.querySelector('.property:nth-child(3)');

    results[0].textContent = data.word;

    results[1].textContent = data.phonetic || (data.phonetics[1] ? data.phonetics[1].text : 'N/A');

    audioContainer.innerHTML = '<span>Audio:</span>';
    const audioSrc = data.phonetics.find(p => p.audio !== '')?.audio;

    if (audioSrc) {
        const audioBtn = document.createElement('audio');
        audioBtn.controls = true;
        audioBtn.src = audioSrc;
        audioContainer.appendChild(audioBtn);
    } else {
        const noAudio = document.createElement('span');
        noAudio.textContent = "No audio available";
        audioContainer.appendChild(noAudio);
    }

    const definition = data.meanings[0].definitions[0].definition;
    results[2].textContent = definition;

    const example = data.meanings[0].definitions[0].example;
    results[3].textContent = example ? `"${example}"` : "No example available";

    results[4].textContent = data.meanings[0].partOfSpeech;
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    searchWord(input.value.trim());
});

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWord(input.value.trim());
    }

});
