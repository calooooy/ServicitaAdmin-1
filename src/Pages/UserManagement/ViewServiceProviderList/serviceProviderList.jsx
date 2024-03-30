import React, { useState } from 'react';
import SearchBar from './searchBar';
import ProviderList from './providerList';

function ViewServiceProviderList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortTerm, setSortTerm] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');
  const [flagged, setFlagged] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // New state to track selected user
  const [isUserSelected, setIsUserSelected] = useState(false);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  const handleSort = (sortByValue) => {
    if (sortBy === sortByValue) {
      setSortBy(null);
    } else {
      if (sortByValue === 'asc') {
        setSortTerm('asc');
      } else if (sortByValue === 'desc') {
        setSortTerm('desc');
      }
    }
  }

  const handleCategory = (category) => {
    setCategory(category);
  }

  const handleCity = (city) => {
    setCity(city);
    setBarangay('');
  }
  
  const handleBarangay = (barangay) => {
    setBarangay(barangay);
  }

  const handleFlagged = (flagged) => {
    setFlagged(flagged);
  }

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsUserSelected(true);
  }

  const handleBackButtonClick = () => {
    setSelectedUser(null);
    setIsUserSelected(false); // Set isUserSelected to false when the back button is clicked
  }


  return (
    <div style={{ width: '100%' }}>
      <h1 className='DashboardHeader'>View Service Provider List</h1>
      <hr className='Divider' style={{ width: '1185px' }} />
      {!isUserSelected && ( // Render the SearchBar only if a user is not selected
        <div style={{ width: '1150px' }}>
          <SearchBar onSearch={handleSearch} onSort={handleSort} findByCategory={handleCategory} findByCity={handleCity} findByBarangay={handleBarangay} findByFlag={handleFlagged} />
        </div>
      )}
      <div>
        <ProviderList searchTerm={searchTerm} sortTerm={sortTerm} category={category} city={city} barangay={barangay} flagged={flagged} onSelectUser={handleUserSelect} toggleSearchBarVisibility={setIsUserSelected} />
      </div>
    </div>
  );
}

export default ViewServiceProviderList;
