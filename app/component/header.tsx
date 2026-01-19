export default function Header() {
  return (
    <header className="bg-indigo-700 text-white p-4">
      <nav className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-xl font-bold"><img src="/logo.jpg" alt="VGroupApp Logo" className="h-8" /></div>
        <ul className="flex space-x-6">
          <li><a href="#" className="hover:text-gray-200 transition-colors">Home</a></li>
          <li><a href="#" className="hover:text-gray-200 transition-colors">Videos</a></li>
          <li><a href="#" className="hover:text-gray-200 transition-colors">Gallery</a></li>
          <li><a href="#" className="hover:text-gray-200 transition-colors">Contact Us</a></li>
          <li><a href="#" className="hover:text-gray-200 transition-colors">About Us</a></li>
        </ul>
      </nav>
    </header>
  );
}