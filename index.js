var form = document.getElementById('searchForm');
var input = document.getElementById('searchInput');
var definitionDiv = document.getElementById('definition');

//function for clearing the results
function clearResults() {
  definitionDiv.innerHTML = '';
}

//function used for showing errors
function showError(msg) {
  clearResults();
  definitionDiv.innerHTML = '<p class="error">' + msg + '</p>';
  console.error('Error shown to user:', msg);
}

//main display function
function displayResults(entry) {
  if (!entry) {
    showError('No entry found.');
    return;
  }

  clearResults();

  //show the word and phonetic (if available)
  definitionDiv.innerHTML = '<h3>' + entry.word + '</h3>';
  if (entry.phonetic) {
    definitionDiv.innerHTML += '<p><em>' + entry.phonetic + '</em></p>';
  }

  //loop through the meanings
  for (var i = 0; i < entry.meanings.length; i++) {
    var meaning = entry.meanings[i];
    definitionDiv.innerHTML += '<h4>' + meaning.partOfSpeech + '</h4>';

    //loop through the definitions
    for (var j = 0; j < meaning.definitions.length; j++) {
      var def = meaning.definitions[j];
      definitionDiv.innerHTML += '<p>• ' + def.definition + '</p>';
      if (def.example) {
        definitionDiv.innerHTML += '<p><em>Example: ' + def.example + '</em></p>';
      }
    }
  }
}

//function that fetches the word data
function fetchWordData(word) {
  var url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(word);
  console.log('Fetching:', url);

  definitionDiv.innerHTML = 'Loading...';

  fetch(url)
    .then(function(response) {
      console.log('Fetch response status:', response.status);
      if (!response.ok) {
        throw new Error('Word not found or API error (status ' + response.status + ')');
      }
      return response.json();
    })
    .then(function(data) {
      console.log('API data received:', data);
      if (!data || data.length === 0) {
        showError('No results returned.');
        return;
      }
      displayResults(data[0]);
    })
    .catch(function(err) {
      showError(err.message || 'Fetch error');
    });
}

//event listener
form.addEventListener('submit', function (e) {
  e.preventDefault();
  var word = input.value.trim();
  console.log('Search submitted:', word);

  if (!word) {
    showError('Please enter a word to search.');
    return;
  }

  fetchWordData(word);
});