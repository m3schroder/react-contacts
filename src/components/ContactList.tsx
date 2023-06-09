import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Contact } from "../types";
import { Transition } from "@headlessui/react";
import { HeartIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";

interface ContactListProps {
  contact: Contact | undefined;
  setEditing: Dispatch<SetStateAction<Contact | undefined>>;
}

export default function ContactList({ contact, setEditing }: ContactListProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [query, setQuery] = useState<string | undefined>(undefined);

  useEffect(() => {
    if(contact)
    updateContacts(contact);
  }, [contact]);

  const updateContacts = (contact: Contact) => {
    if (contact && contact.name) {
      if (contacts.find((x) => x.name == contact.name || x.email === contact.email)) {
        let updatedContacts = [
          ...contacts.filter((x) => x.name !== contact.name && x.email !== contact.email),
          contact,
        ];
        console.log(updatedContacts)
        setContacts(updatedContacts);
      } else {
        let updatedContacts = [...contacts, contact];
        setContacts(updatedContacts);
      }
    }
  };

  useEffect(() => {
    filter();
  }, [query, contacts]);

  const removeContact = (contact: Contact) => {
    let updatedContacts = [...contacts.filter((x) => x !== contact)];
    setContacts(updatedContacts);
  };

  const filter = () => {
    if (query !== undefined && query !== "") {
      // @ts-ignore
      let filtered = [...contacts].filter((contact) => {
        return Object.values(contact).some((value) => typeof(value) === 'string' && value.includes(query));
      });
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  };

  return (
    <div className="py-12 lg:py-32 sm:pb-32 max-w-md z-20">
      <div className="flex mx-auto flex-row gap-5 w-[70%] h-10 mb-5">
        {contacts.length > 0 && (
          <div className="flex flex-col gap-5 w-full">
            <HeartIcon className="text-red-400 h-6 w-6 bg-rose-500" />
            {contacts.length > 0 && (
              <input
                value={query}
                placeholder="Search contacts..."
                onChange={(e) => setQuery(e.target.value)}
                className="grow block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-600 sm:text-sm sm:leading-6"
              />
            )}
            <div className="flex flex-col gap-5 w-full">
              {filteredContacts.map((contact, idx) => (
                <Transition
                  key={contact.name}
                  appear={true}
                  show={true}
                  enter="transition ease-out duration-500"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-500"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div className="flex flex-row transform-gpu gap-5 w-full group h-full px-2">
                    <div className="text-start grow rounded-2xl py-10 px-6 bg-slate-200 group-hover:bg-slate-300 transition-colors cursor-pointer">
                      <h3 className="text-base font-semibold leading-7 text-gray-900">
                        {contact.name}
                      </h3>
                      <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                        <div>
                          <dt className="sr-only">City</dt>
                          <dd>{contact.city}</dd>
                        </div>
                        <div className="mt-1">
                          <dt className="sr-only">State</dt>
                          <dd>{contact.state}</dd>
                        </div>
                      </dl>
                    </div>
                    <div className="shrink w-11 opacity-0 group-hover:opacity-100 transition-all py-2 gap-2 justify-center items-center flex flex-col h-full transform-gpu">
                      <HeartIcon
                        className={classNames(
                          contact.isFavorite
                            ? "text-rose-400"
                            : "text-slate-400",
                          "bg-slate-100 hover:bg-slate-200 rounded-lg p-2 cursor-pointer"
                        )}
                        onClick={() => updateContacts({...contact, isFavorite: !contact.isFavorite})}
                      />
                      <PencilIcon
                        className="text-slate-400 bg-slate-100 hover:bg-slate-200 rounded-lg p-2 cursor-pointer"
                        onClick={() => setEditing(contact)}
                      />
                      <TrashIcon
                        className="text-rose-400 rounded-lg bg-slate-100 hover:bg-slate-200 p-2 cursor-pointer"
                        onClick={() => removeContact(contact)}
                      />
                    </div>
                  </div>
                </Transition>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
