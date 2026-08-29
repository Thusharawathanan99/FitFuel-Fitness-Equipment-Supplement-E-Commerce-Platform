import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../common/Icon';

export default function SearchBar({ placeholder = 'Search whey, racks, dumbbells…' }) {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  return (
    <form
      className="ff-searchbar" role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        if (term) navigate(`/search?q=${encodeURIComponent(term)}`);
      }}
    >
      <Icon name="search" size={20} stroke="var(--ff-gray-500)" strokeWidth={2} />
      <label className="ff-sr" htmlFor="site-search">Search products</label>
      <input
        id="site-search" type="search" value={q} placeholder={placeholder}
        onChange={(e) => setQ(e.target.value)} autoComplete="off"
      />
    </form>
  );
}
