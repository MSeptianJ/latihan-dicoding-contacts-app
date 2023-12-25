import { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContactList from '../components/ContactList';
import SearchBar from '../components/SearchBar';
import LocaleContext from '../contexts/localeContext';
import { deleteContact, getContacts } from '../utils/api';

const HomePage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [contacts, setContacts] = useState([]);
	const [keyword, setKeyword] = useState(() => {
		return searchParams.get('keyword') || '';
	});
	const { locale } = useContext(LocaleContext);

	useEffect(() => {
		getContacts().then(({ data }) => {
			setContacts(data);
		});
	}, []);

	async function onDeleteHandler(id) {
		await deleteContact(id);
		// update the contacts state from network.js
		const { data } = await getContacts();
		setContacts(data);
	}

	function onKeywordChangeHandler(keyword) {
		setKeyword(keyword);
		setSearchParams({ keyword });
	}

	const filteredContacts = contacts.filter((contact) => {
		return contact.name.toLowerCase().includes(keyword.toLowerCase());
	});

	return (
		<section>
			<SearchBar keyword={keyword} keywordChange={onKeywordChangeHandler} />
			<h2>{locale === 'id' ? 'Daftar Kontak' : 'Contacts List'}</h2>
			<ContactList contacts={filteredContacts} onDelete={onDeleteHandler} />
		</section>
	);
};

HomePage.propTypes = {};
export default HomePage;
