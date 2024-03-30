import React, { useState } from 'react';
import SearchBar from './searchBar';
import SeekerList from './seekerList';

function ViewServiceSeekerList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortTerm, setSortTerm] = useState('');
  const [city, setCity] = useState('');
  const [barangay, setBarangay] = useState('');
  const [flagged, setFlagged] = useState(false);

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

  return (
    <div style={{ width: '100%' }}>
      <h1 className='DashboardHeader'>View Service Seeker List</h1>
      <hr className='Divider' style={{ width: '1185px' }} />
      <div style={{ width: '1150px' }}>
        <SearchBar onSearch={handleSearch} onSort={handleSort} findByCity={handleCity} findByBarangay={handleBarangay} findByFlag={handleFlagged} />
      </div>
      <div>
        <SeekerList searchTerm={searchTerm} sortTerm={sortTerm} city={city} barangay={barangay} flagged={flagged} />
      </div>
    </div>
  );
}

export default ViewServiceSeekerList;
