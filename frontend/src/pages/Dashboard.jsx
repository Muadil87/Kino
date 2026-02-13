// src/pages/Dashboard.jsx
import Navbar from '../components/Navbar';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome back, Movie Buff.</h1>
        
        {/* Search & Filter Section (Visual Only for now) */}
        <div className="flex gap-4 mb-8">
            <input 
                type="text" 
                placeholder="Search movies..." 
                className="p-2 rounded bg-gray-800 text-white w-full border border-gray-700"
            />
            <select className="p-2 rounded bg-gray-800 text-white border border-gray-700">
                <option>All Genres</option>
                <option>Action</option>
                <option>Drama</option>
            </select>
        </div>

        {/* Movie Grid Placeholder */}
        <div className="p-10 border-2 border-dashed border-gray-700 text-center text-gray-500 rounded-xl">
            Movie Grid Will Load Here (Day 3)
        </div>
      </div>
    </div>
  );
};

export default Dashboard;