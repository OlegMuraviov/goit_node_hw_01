const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.resolve("./db/contacts.json");
const newId = require("bson-objectid");

async function listContacts() {
  try {
    const contacts = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(contacts);
  } catch (error) {
    throw error;
  }
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  try {
    const idx = contacts.findIndex((item) => item.id === contactId);
    if (idx === -1) {
      return console.log("There is no contact in list");
    }
    const oneContact = contacts[idx];
    return oneContact;
  } catch (error) {
    console.log(error);
  }
}

async function addContact({ name, email, phone }) {
  try {
    const contacts = await listContacts();
    const searchedName = name.toLowerCase();
    if (contacts.some((item) => item.name.toLowerCase() === searchedName))
      return console.log(`${name} is already in list`);
    contacts.push({ name, email, phone, id: `${newId()}` });
    await fs.writeFile(contactsPath, JSON.stringify(contacts, {}, 2));
    return console.log(`${name} have been added to list`);
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();
    if (contacts.every((item) => item.id !== contactId)) {
      return console.log("There is no such contact in list");
    }
    const newContacts = contacts.filter((item) => item.id !== contactId);
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, {}, 2));
    return console.log("Contact removed successfully");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
};
