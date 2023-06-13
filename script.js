// Class representing a single contact
class Contact {
  constructor(contactData) {
    this.data = contactData;
  }

  // Create a DOM element representing the contact
  createListItem() {
    // Creating contact list item
    let contactLi = document.createElement("Li");
    contactLi.classList.add("contact-details");

    // Creating contact image element
    let contactImg = document.createElement("img");
    contactImg.classList.add("contact-img");
    contactImg.src = this.data.imageURL;

    // Creating contact name element
    let contactName = document.createElement("span");
    contactName.classList.add("contact-name");
    contactName.textContent = this.data.title;

    // Creating order ID element
    let orderId = document.createElement("span");
    orderId.classList.add("contact-order-id");
    orderId.textContent = this.data.orderId;

    // Creating last message element
    let lastMsg = document.createElement("span");
    lastMsg.classList.add("contact-last-msg");
    let lastMessage = this.data.messageList[this.data.messageList.length - 1];
    lastMsg.textContent = lastMessage ? lastMessage.message : "";

    // Appending contact name, order ID, and last message to a container element
    let contactTitleOrderIdLi = document.createElement("Li");
    contactTitleOrderIdLi.classList.add("contact-name-orderid");
    contactTitleOrderIdLi.append(contactName, orderId, lastMsg);

    // Creating contact time element
    let contactTime = document.createElement("span");
    contactTime.classList.add("contact-date");
    let lastContactedDate = new Date(this.data.latestMessageTimestamp);
    contactTime.textContent = lastContactedDate.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    // Appending all elements to the contact list item
    contactLi.append(contactImg, contactTitleOrderIdLi, contactTime);
    contactLi.addEventListener("click", () => this.handleContactClick());
    return contactLi;
  }

  // Handle a click on the contact
  handleContactClick() {
    new Chat(this.data).renderChatMessages();
  }
}

// Class representing a chat with a contact
class Chat {
  constructor(contactData) {
    this.data = contactData;
  }

  // Render chat messages
  renderChatMessages() {
    let leftSection = document.querySelector(".left-section");
    let rightSection = document.querySelector(".right-section");

    leftSection.style.width = "40%";
    rightSection.style.display = "block";

    let contactNames = document.querySelector("#chat-header");
    let contactPics = document.querySelector("#chat-pic");
    let messageLists = document.querySelector("#chat-msg");

    messageLists.innerHTML = "";
    let reversedMessages = [...this.data.messageList].reverse();

    contactPics.src = this.data.imageURL;
    contactNames.textContent = this.data.title;

    reversedMessages.forEach((msg) => {
      let messageLi = document.createElement("Li");

      // Add appropriate class based on the sender of the message
      if (msg.sender == "CLIENT") {
        messageLi.classList.add("contact-sent-msg");
      } else if (msg.sender == "AI") {
        messageLi.classList.add("contact-received-msg");
      }

      // Create and append message content and timestamp elements
      let userTime = document.createElement("span");
      let messageTime = new Date(msg.timestamp);
      messageTime = messageTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      userTime.textContent = messageTime;
      let userMsg = document.createElement("span");
      userMsg.textContent = msg.message;

      messageLi.append(userMsg, userTime);
      messageLists.appendChild(messageLi);
    });

    // Add event listener to send button for sending messages
//     let sendButton = document.querySelector("#chat-send-btn");
//     let messageInput = document.querySelector("#chat-write-msg");
  
  }

   

// Class representing the search functionality
class Search {
  constructor() {
    this.searchInput = document.querySelector("#search-input");
    this.searchInput.addEventListener("input", () => this.handleSearch());
  }

  // Handle search input
  handleSearch() {
    let searchValue = this.searchInput.value.toLowerCase();

    let allContactsName = document.querySelectorAll(".contact-name");
    let allOrdersId = document.querySelectorAll(".contact-order-id");

    // Iterate through each contact name and order ID and show/hide contacts based on search value
    for (let i = 0; i < allContactsName.length; i++) {
      let contactName = allContactsName[i].textContent.toLowerCase();
      let orderId = allOrdersId[i].textContent.toLowerCase();

      if (contactName.includes(searchValue) || orderId.includes(searchValue)) {
        allContactsName[i].closest(".contact-details").style.display = "";
      } else {
        allContactsName[i].closest(".contact-details").style.display = "none";
      }
    }
  }
}

// Main class handling the chat application
class ChatApplication {
  constructor() {
    this.contactsData = null;
    this.fetchData();
    new Search();
  }

  async fetchData() {
    try {
      // Fetch data from JSON file
      const response = await fetch("data.json");
      const data = await response.json();
      this.contactsData = data.map((contact) => new Contact(contact));
      this.renderContactList();
    } catch (error) {
      console.log(error);
    }
  }

  // Render the contact list
  renderContactList() {
    let contactList = document.querySelector("#search");
    this.contactsData.forEach((contact) => {
      contactList.appendChild(contact.createListItem());
    });
  }
}

// Starting the application
new ChatApplication();
