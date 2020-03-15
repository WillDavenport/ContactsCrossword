export function trimContactsData (data) {
    let formattedContacts = [];
    for(let i =0;i<data.length;i++) {
        let formattedContact = {
            possibleWords : [],
            possibleHints: []
        }
        const contact = data[i];
        if (contact.firstName) {
            let firstNameField = contact.firstName.split(" ");
            if (firstNameField.length > 1) {
                if (contact.lastName) {
                    if (firstNameField[0].length > 1) {
                        formattedContact.possibleWords.push(firstNameField[0]);
                    }
                    if (contact.lastName.length > 1) {
                        formattedContact.possibleWords.push(contact.lastName);
                    }
                }
                else { // assume last word in firstNameField is last name
                    if (firstNameField[0].length > 1) {
                        formattedContact.possibleWords.push(firstNameField[0]);
                    }
                    if (firstNameField[firstNameField.length - 1].length > 1) {
                        formattedContact.possibleWords.push(firstNameField[firstNameField.length - 1]);
                    }
                }
            } else {
                if (firstNameField[0].length > 1) {
                    formattedContact.possibleWords.push(firstNameField[0]);
                }
                if (contact.lastName && contact.lastName.length > 1) {
                    formattedContact.possibleWords.push(contact.lastName);
                }
            }
        } else if (contact.lastName) {
            if (contact.lastName.length > 1) {
                formattedContact.possibleWords.push(contact.lastName);
            }
        } 
        
        // start adding possible hints
        if (contact.nickname && contact.nickname.length > 1) {
            formattedContact.possibleHints.push('Goes by "',contact.nickname,'"');
        }
        if (contact.company && contact.company.length > 1) {
            if (contact.jobTitle && contact.jobTitle.length > 1) {
                formattedContact.possibleHints.push(contact.jobTitle,' at ',contact.company);
            } else {
                formattedContact.possibleHints.push('Works at ',contact.company);
            }
        }

        // if valid, add to formatted contacts
        if (formattedContact.possibleWords.length == 1) {
            if (formattedContact.possibleHints.length > 0) {
                formattedContacts.push(formattedContact);
            }
        }
        if (formattedContact.possibleWords.length > 1) {
            formattedContacts.push(formattedContact);
        }
    }
    return formattedContacts;
}