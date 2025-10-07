import React, { useState } from 'react';
import config from '../constants.js';
import { BuildingStorefrontIcon, CurrencyDollarIcon, StarIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const LandingPage = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuthAction = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onSignup(name, email, password);
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5 text-2xl font-bold text-gray-900">FlavorFusion</a>
          </div>
          <div className="lg:flex lg:flex-1 lg:justify-end">
             <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">Admin Panel <span aria-hidden="true">&rarr;</span></a>
          </div>
        </nav>
      </header>

      <main className="relative isolate pt-14">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
            <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'}}></div>
        </div>

        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Discover Your Next Favorite Meal</h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">FlavorFusion connects you with the best local restaurants and dishes. Create your culinary profile, review dishes, and share your discoveries.</p>
            </div>

            <div className="mt-16 flow-root sm:mt-24">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                 <div className="mx-auto max-w-md p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-900">{isLogin ? 'Welcome Back' : 'Join FlavorFusion'}</h2>
                    <form onSubmit={handleAuthAction} className="mt-8 space-y-6">
                      {!isLogin && (
                        <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Your Name" required className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                      )}
                      <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email Address" required className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                      <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" required className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                      {error && <p className="text-sm text-red-600">{error}</p>}
                      <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">{isLogin ? 'Log In' : 'Sign Up'}</button>
                      </div>
                       <button type="button" onClick={() => onLogin('user@manifest.build', 'password')} className="mt-2 w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">Log In as Demo User</button>
                    </form>
                    <p className="mt-6 text-center text-sm text-gray-500">
                      {isLogin ? 'Not a member?' : 'Already have an account?'}
                      <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-medium text-indigo-600 hover:text-indigo-500 ml-1">{isLogin ? 'Sign up' : 'Log in'}</button>
                    </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
