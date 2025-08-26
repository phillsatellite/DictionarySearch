# DictionarySearch
This is a simple dictionary search app built using JavaScript

To use this its quite simple you type in a word to search and the application will display the word, pronunciation, meanings, and example sentences.

It listens for form submission when the user presses search and/or the enter key. 

If the user tries to look up something that is not a word or enters a blank word an error will appear "Please enter a word to search" or "word not found or API error(status 404).

When the user enters a word the page will stop from refreshing and calls the "fetchWordData" function to fetch and display the results. During this it should display "Loading..."

In the "displayResults" function there are two loops. The outer loop handles the categories of the word (noun, verb, adjetive) while the inner loop should handle the specific definitions inside each category. 

After a word is searched it gets sent to an array (searchHistory) and is available to view upon the users request. 