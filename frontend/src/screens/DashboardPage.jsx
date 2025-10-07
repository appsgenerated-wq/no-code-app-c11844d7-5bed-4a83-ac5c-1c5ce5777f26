import React, { useState, useEffect } from 'react';
import { PhotoIcon, PlusCircleIcon, PencilIcon, TrashIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import config from '../constants.js';

const DashboardPage = ({ user, onLogout, manifest }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('restaurants'); // 'restaurants', 'menuItems'
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showRestaurantForm, setShowRestaurantForm] = useState(false);
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    setIsLoading(true);
    const response = await manifest.from('Restaurant').find({ include: ['owner'] });
    setRestaurants(response.data);
    setIsLoading(false);
  };

  const loadMenuItems = async (restaurantId) => {
    setIsLoading(true);
    const response = await manifest.from('MenuItem').find({ filter: { restaurantId }, include: ['restaurant'] });
    setMenuItems(response.data);
    setIsLoading(false);
  };

  const handleSelectRestaurant = (restaurant) => {
    setSelectedRestaurant(restaurant);
    loadMenuItems(restaurant.id);
    setView('menuItems');
  };

  const handleBackToRestaurants = () => {
    setSelectedRestaurant(null);
    setMenuItems([]);
    setView('restaurants');
  };

  const userIsAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FlavorFusion</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, <span className="font-semibold">{user.name}</span>! {userIsAdmin && <span className="text-xs bg-indigo-100 text-indigo-700 font-bold py-1 px-2 rounded-full">ADMIN</span>}</span>
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-indigo-600">Admin Panel</a>
            <button onClick={onLogout} className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors">Logout</button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'restaurants' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-gray-800">Restaurants</h2>
              <button onClick={() => setShowRestaurantForm(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Restaurant
              </button>
            </div>
            {showRestaurantForm && <RestaurantForm manifest={manifest} onFormClose={() => { setShowRestaurantForm(false); loadRestaurants(); }} />}
            {isLoading ? <p>Loading restaurants...</p> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {restaurants.map(restaurant => (
                  <div key={restaurant.id} className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-transform duration-300" onClick={() => handleSelectRestaurant(restaurant)}>
                    <img src={restaurant.coverImage?.card?.url || 'https://placehold.co/400x250'} alt={restaurant.name} className="w-full h-48 object-cover" />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900">{restaurant.name}</h3>
                      <p className="text-sm text-gray-500 mt-2">Owner: {restaurant.owner?.name || 'N/A'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'menuItems' && selectedRestaurant && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <button onClick={handleBackToRestaurants} className="text-sm text-indigo-600 hover:underline mb-2"> &larr; Back to Restaurants</button>
                <h2 className="text-3xl font-semibold text-gray-800">{selectedRestaurant.name}'s Menu</h2>
              </div>
               {selectedRestaurant.ownerId === user.id && (
                <button onClick={() => setShowMenuItemForm(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                    Add Menu Item
                </button>
               )}
            </div>
            {showMenuItemForm && <MenuItemForm manifest={manifest} restaurantId={selectedRestaurant.id} onFormClose={() => { setShowMenuItemForm(false); loadMenuItems(selectedRestaurant.id); }} />}
            {isLoading ? <p>Loading menu items...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.map(item => <MenuItemCard key={item.id} item={item} />)}
                </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};

const RestaurantForm = ({ manifest, onFormClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageUpload = (file) => {
        setCoverImage(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await manifest.from('Restaurant').create({ name, description, coverImage });
        onFormClose();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-medium">New Restaurant</h3>
                <input type="text" placeholder="Restaurant Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded-md" required />
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded-md" />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                    <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md`}>
                        <div className="space-y-1 text-center">
                            {preview ? <img src={preview} alt="Preview" className="mx-auto h-24 w-auto rounded-md" /> : <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />}
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload-restaurant" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                    <span>Upload a file</span>
                                    <input id="file-upload-restaurant" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={onFormClose} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm">Create</button>
                </div>
            </form>
        </div>
    );
};

const MenuItemForm = ({ manifest, restaurantId, onFormClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('main');
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const categories = ['appetizer', 'main', 'dessert', 'drink'];

    const handleImageUpload = (file) => {
        setPhoto(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await manifest.from('MenuItem').create({ name, description, price: parseFloat(price), category, photo, restaurantId });
        onFormClose();
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-medium">New Menu Item</h3>
                <input type="text" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded-md" required />
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border rounded-md" />
                <input type="number" placeholder="Price (USD)" value={price} onChange={e => setPrice(e.target.value)} className="w-full p-2 border rounded-md" step="0.01" min="0" />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <div className="flex space-x-2 mt-1">
                         {categories.map(cat => (
                            <button key={cat} type="button" onClick={() => setCategory(cat)} className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors ${category === cat ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Photo</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                             {preview ? <img src={preview} alt="Preview" className="mx-auto h-24 w-auto rounded-md" /> : <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />}
                             <div className="flex text-sm text-gray-600">
                                 <label htmlFor="file-upload-menuitem" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                     <span>Upload a file</span>
                                     <input id="file-upload-menuitem" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])} />
                                 </label>
                             </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end space-x-2">
                    <button type="button" onClick={onFormClose} className="px-4 py-2 border rounded-md text-sm">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm">Create</button>
                </div>
            </form>
        </div>
    );
};

const MenuItemCard = ({ item }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
            <img src={item.photo?.thumbnail?.url || 'https://placehold.co/150x150'} alt={item.name} className="w-full h-40 object-cover" />
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg text-gray-800">{item.name}</h4>
                    <span className="font-semibold text-lg text-green-600">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 flex-grow">{item.description}</p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs font-semibold uppercase px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">{item.category}</span>
                    <div className="flex items-center">
                        <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                        <span className="text-gray-600 text-sm ml-1">4.5 (12 reviews)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
