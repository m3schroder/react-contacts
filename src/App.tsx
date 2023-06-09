import React, { FormEvent, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import { Contact } from "./types";

function App() {
  const [contact, setContact] = useState<Contact | undefined>(undefined);
  const [editing, setEditing] = useState<Contact | undefined>(undefined);

  const processForm = (e: FormEvent<HTMLFormElement>) => {
    setEditing(undefined)
    e.preventDefault();
    let inputs = document.querySelectorAll("#contact-form input");
    let contact: Contact = {
      name: "",
      email: "",
      number: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      isFavorite: false
    };
    inputs.forEach((input) => {
      let key = input.getAttribute("name");
      if (key)
        // @ts-ignore
        contact[key as keyof Contact] = input.getAttribute("value");
    });
    // @ts-ignore
    setContact(contact);
  };
  return (
    <div className="App">
      <div className="grid lg:grid-cols-2 w-fit mx-auto">
        <ContactForm onSubmit={processForm} incomingContact={editing} />
        <ContactList contact={contact} setEditing={setEditing} />
      </div>
    </div>
  );
}

export default App;
