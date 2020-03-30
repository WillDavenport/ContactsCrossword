export function createGameWords(formattedContacts, gridRows, gridColumns) {
    let words = [];
    for(let i =0; i<formattedContacts.length; i++) {
        const contact = formattedContacts[i];
        if (contact.possibleWords.length > 1) {
            const wordIndex = Math.floor(Math.random() * Math.floor(2));
            let word = contact.possibleWords[wordIndex].toUpperCase();
            word.replace(/[^A-Z]/g, ''); // get rid of all non-letters
            
            contact.possibleHints.push(contact.possibleWords[Math.abs(wordIndex - 1)]);
            const hintIndex = Math.floor(Math.random() * Math.floor(contact.possibleHints.length));

            if (word.length <= gridRows && word.length <= gridColumns) {
                if (word.toUpperCase() != contact.possibleHints[hintIndex].toUpperCase()) {
                    words.push({text: word.split(''), hint: contact.possibleHints[hintIndex]});
                }
            }
        } else {
            let word = contact.possibleWords[0].toUpperCase();
            word.replace(/[^A-Z]/g, ''); // get rid of all non-letters

            const hintIndex = Math.floor(Math.random() * Math.floor(contact.possibleHints.length));
            // console.log('hint Index: ', hintIndex);
            if (word.length <= gridRows && word.length <= gridColumns) {
                console.log('SET HINT: ',contact.possibleHints[hintIndex])
                if (word.toUpperCase() != contact.possibleHints[hintIndex].toUpperCase()) {
                    words.push({text: word.split(''), hint: contact.possibleHints[hintIndex]});
                }
            }
        }
    }

    return words;
} 