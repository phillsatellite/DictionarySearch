// DOM elements
var form = document.getElementById('searchForm');
var input = document.getElementById('searchInput');
var definitionDiv = document.getElementById('definition');
var searchHistory = []; 
var historyBtn = document.getElementById('historyButton');
var historyModal = document.getElementsByClassName('history')[0];
var clearBtn = document.getElementById('clearInput');

// Prevents elements from being focused when page loads from a link
document.addEventListener('DOMContentLoaded', function() {
  // Remove focus from any currently focused element
  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur();
  }
  
  // Optional: Add event listeners to prevent programmatic focus
  const focusableElements = document.querySelectorAll('input, button, [tabindex]');
  focusableElements.forEach(el => {
    el.addEventListener('mousedown', function(e) {
      // Prevent focus on mouse click, but allow it on keyboard navigation
      this.style.outline = 'none';
    });
  });
});

// Function to clear results
function clearResults() {
  definitionDiv.innerHTML = '';
}

// Show the clear button when there's text
input.addEventListener('input', function() {
  if (input.value.trim() !== '') {
    clearBtn.style.display = 'block';
  } else {
    clearBtn.style.display = 'none';
  }
});

// Clear input when clicking the X
clearBtn.addEventListener('click', function() {
  input.value = '';
  clearBtn.style.display = 'none';
  definitionDiv.innerHTML = 'Search for a word above.';

  // Reset autofill border/shadow if any
  input.style.border = "";
  input.style.boxShadow = "";
});

// Function to show errors
function showError(msg) {
  clearResults();
  definitionDiv.innerHTML = '<p class="error">' + msg + '</p>';
  console.error('Error shown to user:', msg);
}

// Display results function
function displayResults(entry) {
  if (!entry) {
    showError('No entry found.');
    return;
  }

  clearResults();

  // Word and phonetic
  definitionDiv.innerHTML = '<h3>' + entry.word + '</h3>';
  if (entry.phonetic) {
    definitionDiv.innerHTML += '<p><em>' + entry.phonetic + '</em></p>';
  }

  // Loop through meanings
  for (var i = 0; i < entry.meanings.length; i++) {
    var meaning = entry.meanings[i];
    definitionDiv.innerHTML += '<h4>' + meaning.partOfSpeech + '</h4>';

    // Loop through definitions
    for (var j = 0; j < meaning.definitions.length; j++) {
      var def = meaning.definitions[j];
      definitionDiv.innerHTML += '<p>• ' + def.definition + '</p>';
      if (def.example) {
        definitionDiv.innerHTML += '<p><em>Example: ' + def.example + '</em></p>';
      }
    }
  }
}

// Fetch word data
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
      searchHistory.push(word);
      console.log('Search history:', searchHistory);
    })
    .catch(function(err) {
      showError(err.message || 'Fetch error');
    });
}

// Form submit listener
form.addEventListener('submit', function (e) {
  e.preventDefault();
  var word = input.value.trim();
  console.log('Search submitted:', word);

  if (!word) {
    showError('Please enter a word to search.');
    return;
  }

  fetchWordData(word);

  // Reset autofill border + shadow after search
  input.style.border = "1px solid #374151";
  input.style.boxShadow = "none";
});

// History toggle function
function toggleHistory() {
  // If the history is currently hidden
  if (historyModal.style.display === 'none' || historyModal.style.display === '') {
    if (searchHistory.length === 0) {
      historyModal.textContent = "No history to show";
    } else {
      historyModal.innerHTML = ''; // clear previous
      searchHistory.forEach(word => {
        const p = document.createElement('p');
        p.textContent = word;
        historyModal.appendChild(p);
      });
    }
    historyModal.style.display = 'flex';
    historyBtn.textContent = "Close History Log";
  } else {
    // Close history
    historyModal.style.display = 'none';
    historyBtn.textContent = "Open History Log";
  }
}

// Attach click listener to history button
historyBtn.addEventListener('click', toggleHistory);

// Initialize history as hidden on page load
historyModal.style.display = 'none';
historyBtn.textContent = "Open History Log";