const handleInput = e => {
    const inputValue = e.target.textContent;
    const inputViewer = document.querySelector('.input-viewer');
    if (inputViewer.textContent.length >= 9) return;
    inputViewer.textContent = (inputViewer.textContent + inputValue).trim();
  };
  const numbers = document.querySelectorAll('.number');
  Array.from(numbers).forEach(num => num.addEventListener('click', handleInput));
  
  const callNumber = () => {
    const number = document.querySelector('.input-viewer').textContent;
    if (number.length !== 9) return;
    const localData = getLocalStorage();
    const found = localData.find(data => data.phone === number);
    const infoToShow = found ? found.name : number;
    const type = found ? 'contact' : 'number';
    showPopUp(infoToShow, type);
  };
  const showPopUp = (data, type) => {
    const popup = document.querySelector('.popup');
    const popupNumber = document.querySelector('.call-phone-number');
    const typeText = type === 'contact' ? 'a' : 'al número';
    popupNumber.textContent = `${typeText} ${data}`;
    popup.classList.add('show');
  };
  const hidePopUp = () => {
    const popup = document.querySelector('.popup');
    const popupNumber = document.querySelector('.call-phone-number');
    popupNumber.textContent = '';
    popup.classList.remove('show');
  }
  const clearNumber = () => {
    const inputViewer = document.querySelector('.input-viewer');
    inputViewer.textContent = '';
    hidePopUp();
  };
  const clearButton = document.querySelector('.clear');
  const callButton = document.querySelector('button.call');
  callButton.addEventListener('click', callNumber);
  clearButton.addEventListener('click', clearNumber);
  
  const getLocalStorage = () => {
    const contactList = localStorage.getItem('userContacts');
    return JSON.parse(contactList) || [];
  };
  const saveLocalStorage = data => {
    let contactList = getLocalStorage();
    if (contactList.length >= 3) return false;
    contactList = contactList ? contactList : [];
    contactList.push(data);
    localStorage.setItem('userContacts', JSON.stringify(contactList));
    return true;
  };
  const showContacts = () => {
    const contactSection = document.querySelector('.contact');
    const padSection = document.querySelector('.pad');
    contactSection.classList.toggle('hide');
    padSection.classList.toggle('hide');
  }
  const showContactsButton = document.querySelector('.change-section');
  showContactsButton.addEventListener('click', showContacts);
  
  const clearContactForm = () => {
    const form = document.querySelector('#contact-form');
    form.reset();
  };
  
  const showErrorPopup = () => {
    const errorPopup = document.querySelector('.error');
    errorPopup.classList.toggle('hide');
    window.setTimeout(() => errorPopup.classList.toggle('hide'), 2000);
  };
  const saveContact = e => {
    /**@type {HTMLFormElement} */
    const form = document.querySelector('#contact-form');
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    };
    const contactData = Object.fromEntries([...new FormData(form)]);
    if (contactIsDuplicate(contactData.phone)) {
      showDuplicatePopup();
      return;
    };
    const canSave = saveLocalStorage(contactData);
    if (!canSave) {
      showErrorPopup();
      return;
    };
    addToContactList(contactData);
    clearContactForm();
  };
  const contactIsDuplicate = number => {
    const contactList = getLocalStorage();
    return contactList.find(contact => contact.phone === number);
  };
  const showDuplicatePopup = () => {
    const popup = document.querySelector('.error-duplicate');
    popup.classList.toggle('hide');
    window.setTimeout(() => popup.classList.toggle('hide'), 2000);
  };
  const saveContactButton = document.querySelector('.save-contact');
  saveContactButton.addEventListener('click', saveContact);
  
  const addToContactList = contactData => {
    const contactParentNode = document.querySelector('.contact-list');
    const contactNode = createContactNode(contactData);
    contactParentNode.append(contactNode);
  };
  const populateContactList = () => {
    const contactParentNode = document.querySelector('.contact-list');
    const contactListData = getLocalStorage();
    if (!contactListData.length) return;
  
    const contactListNodes = contactListData.map(contact => createContactNode(contact));
    contactParentNode.append(...contactListNodes);
  };
  const createContactNode = contactData => {
    const contactNode = document.createElement('li');
    const deleteButton = document.createElement('button');
    const contactName = document.createElement('p');
    const contactPhone = document.createElement('p');
    contactName.textContent = `${contactData.name} ${contactData.lastname}` ;
    contactPhone.textContent = contactData.phone;
  
    deleteButton.textContent = 'Borrar';
    deleteButton.dataset.index = contactData.phone;
    deleteButton.addEventListener('click', deleteContact);
    deleteButton.classList.add('action');
    contactNode.dataset.index = contactData.phone;
  
    contactNode.append(contactName, contactPhone,deleteButton);
    return contactNode;
  };
  const createFirstContact = () => {
    const contactList = getLocalStorage();
    if (!contactList.length) {
      saveLocalStorage({ name: "Natalia", lastname: "caiconte", phone: "987252331" });
      populateContactList();
    };
  };
  const deleteContact = e => {
    const contactList = getLocalStorage();
    const contactToDelete = e.target.dataset.index;
    const foundIndex = contactList.findIndex(contact => contact.phone === contactToDelete);
    const contactsParent = document.querySelector('.contact-list');
    Array.from(contactsParent.children).forEach(child => {
      if (child.dataset.index === contactToDelete) child.remove();
    });
    if (~foundIndex) {
      contactList.splice(foundIndex, 1);
      localStorage.setItem('userContacts', JSON.stringify(contactList));
    };
  };
  const deleteContactElement = index => {
  
  };
  window.addEventListener('load', populateContactList);
  window.addEventListener('load', createFirstContact);