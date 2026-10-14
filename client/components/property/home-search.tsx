'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HomeSearch() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (location.trim()) params.set('location', location.trim());
    if (type) params.set('type', type);
    if (category) params.set('category', category);
    router.push(`/listings${params.size ? `?${params.toString()}` : ''}`);
  }
  return (
    <form className="home-search-card" onSubmit={search}>
      <label className="home-search-field">
        <span>LOCATION</span>
        <span className="input-with-icon">
          <MapPin size={15} />
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City, state, or neighbourhood"
            aria-label="Search by location"
          />
        </span>
      </label>
      <label className="home-search-field">
        <span>LOOKING FOR</span>
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          aria-label="Choose to buy or rent"
        >
          <option value="">Buy or rent</option>
          <option value="SALE">Buy a home</option>
          <option value="RENT">Rent a home</option>
        </select>
      </label>
      <label className="home-search-field">
        <span>PROPERTY TYPE</span>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Choose a property type"
        >
          <option value="">Any property</option>
          <option value="APARTMENT">Apartment</option>
          <option value="HOUSE">House</option>
          <option value="VILLA">Villa</option>
          <option value="DUPLEX">Duplex</option>
          <option value="LAND">Land</option>
        </select>
      </label>
      <Button type="submit" className="home-search-submit">
        <Search size={17} />
        <span>Find a home</span>
        <ArrowUpRight size={15} />
      </Button>
    </form>
  );
}
