import React, { useState, useEffect } from 'react';
import { X } from 'react-feather';
import { FaFilter } from 'react-icons/fa';
import { useSpring, animated } from 'react-spring';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import api from '@/api';

export default function Filter({ onApplyFilters, priceRange }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPriceRange, setCurrentPriceRange] = useState(priceRange);
  const [isPriceFilterEnabled, setPriceFilterEnabled] = useState(false);
  const [isMobileFilterVisible, setMobileFilterVisible] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      const uniqueCategories = await api.fetchUniqueCategories();
      setCategories(uniqueCategories);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPriceRange(priceRange);
  }, [priceRange]);

  const handleApplyFilters = () => {
    onApplyFilters({ 
      category: selectedCategory, 
      priceRange: isPriceFilterEnabled ? currentPriceRange : priceRange, 
      isPriceFilterEnabled 
    });
    setMobileFilterVisible(false);
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setCurrentPriceRange(priceRange);
    setPriceFilterEnabled(false);
    onApplyFilters({ category: '', priceRange, isPriceFilterEnabled: false });
    setMobileFilterVisible(false);
  };

  const mobileFilterAnimation = useSpring({
    transform: isMobileFilterVisible ? 'translateY(0%)' : 'translateY(100%)',
    opacity: isMobileFilterVisible ? 1 : 0,
  });

  return (
    <>
      <div className="hidden lg:block w-100 p-4 bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Price Range</label>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={isPriceFilterEnabled}
              onChange={(e) => setPriceFilterEnabled(e.target.checked)}
            />
            <span className="ml-2">Enable Price Filter</span>
          </div>
          <div className="flex space-x-2 mb-2">
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={currentPriceRange[0]}
              onChange={(e) => setCurrentPriceRange([Number(e.target.value), currentPriceRange[1]])}
              disabled={!isPriceFilterEnabled}
              placeholder="Min Price"
            />
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              value={currentPriceRange[1]}
              onChange={(e) => setCurrentPriceRange([currentPriceRange[0], Number(e.target.value)])}
              disabled={!isPriceFilterEnabled}
              placeholder="Max Price"
            />
          </div>
          <Slider
            range
            min={priceRange[0]}
            max={priceRange[1]}
            value={currentPriceRange}
            onChange={setCurrentPriceRange}
            disabled={!isPriceFilterEnabled}
          />
        </div>
        <button className="w-full bg-blue-500 text-white py-2 rounded" onClick={handleApplyFilters}>Apply</button>
        <button className="w-full bg-gray-500 text-white py-2 rounded mt-2" onClick={handleResetFilters}>Reset</button>
      </div>

      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button className="bg-blue-500 text-white p-4 rounded-full" onClick={() => setMobileFilterVisible(true)}>
          <FaFilter className="text-white" />
        </button>
      </div>

      {isMobileFilterVisible && (
        <animated.div style={mobileFilterAnimation} className="fixed inset-0 bg-white z-50 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Filters</h2>
            <button onClick={() => setMobileFilterVisible(false)}>
              <X />
            </button>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Category</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-2">Price Range</label>
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={isPriceFilterEnabled}
                onChange={(e) => setPriceFilterEnabled(e.target.checked)}
              />
              <span className="ml-2">Enable Price Filter</span>
            </div>
            <div className="flex space-x-2 mb-2">
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={currentPriceRange[0]}
                onChange={(e) => setCurrentPriceRange([Number(e.target.value), currentPriceRange[1]])}
                disabled={!isPriceFilterEnabled}
                placeholder="Min Price"
              />
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                value={currentPriceRange[1]}
                onChange={(e) => setCurrentPriceRange([currentPriceRange[0], Number(e.target.value)])}
                disabled={!isPriceFilterEnabled}
                placeholder="Max Price"
              />
            </div>
            <Slider
              range
              min={priceRange[0]}
              max={priceRange[1]}
              value={currentPriceRange}
              onChange={setCurrentPriceRange}
              disabled={!isPriceFilterEnabled}
            />
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded mb-2" onClick={handleApplyFilters}>Apply</button>
          <button className="w-full bg-gray-500 text-white py-2 rounded" onClick={handleResetFilters}>Reset</button>
        </animated.div>
      )}
    </>
  );
}