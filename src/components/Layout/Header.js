import React, { useState, useEffect, useRef } from 'react';
import { Bell, Menu } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const Header = () => {
  const { data: userSession } = useSession();
  const router = useRouter();

  const [avatarUrl, setAvatarUrl] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenu, setIsMobileMenu] = useState(false);
const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);


  const menuRef = useRef(null);

  useEffect(() => {
    const seed = Math.random().toString(36).substring(2, 10);
    const url = `https://api.dicebear.com/8.x/thumbs/svg?seed=${seed}`;
    setAvatarUrl(url);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
        setIsMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full h-[70px] border-b bg-white border-gray-200 flex items-center justify-between px-4 sm:px-10 lg:px-20 relative">
      
      {/* Left: Logo */}
      <div className="flex items-center cursor-pointer">
        <Image
          src="/formlogo.png"
          alt="Logo"
          width={100}
          height={100}
          onClick={() => router.push('/')}
          className="w-[100px] object-contain"
        />
      </div>

      {/* Desktop Menu */}
      <div
        className="hidden md:flex items-center gap-5 relative"
        ref={menuRef}
      >
        <div className="relative">
  <button
    onClick={() => setNotificationMenuOpen((prev) => !prev)}
    className="p-2 rounded-lg hover:bg-gray-200 transition-colors relative cursor-pointer"
  >
    <Bell size={20} className="text-gray-600" />

    {/* Unread indicator (optional) */}
    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
  </button>

  {notificationMenuOpen && (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl ring-1 ring-black/5 border border-gray-100 z-50">
      <h3 className="px-4 pt-3 pb-2 text-gray-700 font-semibold">Notifications</h3>

      <ul className="max-h-80 overflow-y-auto">
        <li className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
          <p className="font-medium text-gray-800 text-sm">New Submission</p>
          <p className="text-xs text-gray-500">Your form got a new response.</p>
        </li>

        <li className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
          <p className="font-medium text-gray-800 text-sm">Form Closed</p>
          <p className="text-xs text-gray-500">A form you own was closed.</p>
        </li>

        <li className="px-4 py-3 hover:bg-gray-50">
          <p className="font-medium text-gray-800 text-sm">New Template Available</p>
          <p className="text-xs text-gray-500">Check the template gallery.</p>
        </li>
      </ul>
    </div>
  )}
</div>

        <h1 className="text-sm font-medium whitespace-nowrap">
          Hi, {userSession?.user?.name}
        </h1>

        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 cursor-pointer"
          aria-label="User Profile"
        >
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt="User Avatar"
              width={35}
              height={35}
              className="object-cover"
              unoptimized
            />
          )}
        </button>

        {/* Desktop Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-12 right-0 w-[170px] bg-white border border-gray-200 shadow-lg rounded-md z-50 text-sm">
            <ul className="flex flex-col py-2">
              <li className="hover:bg-gray-100 cursor-pointer flex flex-col border-b border-gray-200">
                <div className="px-2 py-1">
                  <span className="font-medium">{userSession?.user?.name}</span>
                  <span className="text-gray-500">{userSession?.user?.email}</span>
                </div>
              </li>

              <li
                className="hover:bg-gray-100 cursor-pointer border-b border-gray-200"
                onClick={() => router.push('/account')}
              >
                <div className="px-2 py-1">Account Settings</div>
              </li>

              <li className="hover:bg-gray-100 cursor-pointer border-b border-gray-200">
                <div className="px-2 py-1">Refer & Earn</div>
              </li>

              <li className="hover:bg-gray-100 cursor-pointer">
                <div className="px-2 py-2" onClick={() => signOut()}>
                  Sign Out
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsMobileMenu((prev) => !prev)}
        className="md:hidden p-2 rounded-md hover:bg-gray-100"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Menu Drawer */}
      {isMobileMenu && (
        <div
          ref={menuRef}
          className="absolute top-[70px] right-0 w-[230px] bg-white border border-gray-200 shadow-lg rounded-md z-50 md:hidden"
        >
          <ul className="flex flex-col py-3 text-sm">

            <li className="px-3 py-2 border-b border-gray-200">
              <span className="font-medium block">{userSession?.user?.name}</span>
              <span className="text-gray-500 text-[12px]">
                {userSession?.user?.email}
              </span>
            </li>

            <li className="px-3 py-2 hover:bg-gray-100 border-b border-gray-200">
              <button
                onClick={() => router.push('/account')}
                className="w-full text-left"
              >
                Account Settings
              </button>
            </li>

            <li className="px-3 py-2 hover:bg-gray-100 border-b border-gray-200">
              Refer & Earn
            </li>

            <li className="px-3 py-2 hover:bg-gray-100">
              <button className="w-full text-left" onClick={() => signOut()}>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
