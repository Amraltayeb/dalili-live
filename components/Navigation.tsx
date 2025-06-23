'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserIcon,
  CogIcon,
  ArrowLeftIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Custom Compass Icon Component
const CompassIcon = ({ className = "h-6 w-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
    <path d="M12 2v4M22 12h-4M12 22v-4M2 12h4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16.24 7.76l-1.41 1.41M16.24 16.24l-1.41-1.41M7.76 16.24l1.41-1.41M7.76 7.76l1.41 1.41" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // 1. Check for PWA mode
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInApp = (window.navigator as any).standalone === true;
      setIsPWA(isStandalone || isInApp);
    };

    checkPWA();
    window.addEventListener('resize', checkPWA);

    // 2. Fetch initial session and set user
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user ?? null);
      if (user) {
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        setUserRole(userData?.role || '');
      }
    };
    
    fetchUser();

    // 3. Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user;
      setUser(currentUser ?? null);
      
      if (currentUser) {
        // On SIGNED_IN, re-fetch role if not present
        if (event === 'SIGNED_IN' && !userRole) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', currentUser.id)
            .single();
          setUserRole(userData?.role || '');
        }
      } else {
        // On SIGNED_OUT, clear role
        setUserRole('');
      }
    });

    // 4. Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', checkPWA);
      subscription.unsubscribe();
    };
  }, [userRole, router]); // Dependency on userRole ensures re-check if needed

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // The onAuthStateChange listener will handle the state updates
    setIsMenuOpen(false);
    router.push('/login');
  };

  const canGoBack = pathname !== '/' && !pathname.startsWith('/login') && !pathname.startsWith('/signup');

  const navigationItems = [
    { name: 'Home', href: '/', icon: HomeIcon, show: true },
    { name: 'Search', href: '/search', icon: MagnifyingGlassIcon, show: true },
    { name: 'Submit Business', href: '/submit-business', icon: PlusIcon, show: !!user },
    { name: 'Profile', href: '/profile', icon: UserIcon, show: !!user },
    { name: 'Admin Dashboard', href: '/admin', icon: CogIcon, show: userRole === 'admin' },
    { name: 'Admin Submissions', href: '/admin/submissions', icon: DocumentTextIcon, show: userRole === 'admin' },
  ].filter(item => item.show);

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Back button or Logo */}
            <div className="flex items-center">
              {canGoBack ? (
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
              ) : (
                <Link href="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                  <CompassIcon className="h-8 w-8" />
                  <span className="text-xl font-bold">DALILI</span>
                </Link>
              )}
            </div>

            {/* Center - Page title (for PWA mode) */}
            {isPWA && (
              <div className="flex-1 text-center">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  {pathname === '/' && 'Home'}
                  {pathname.startsWith('/search') && 'Search'}
                  {pathname.startsWith('/business/') && 'Business Details'}
                  {pathname.startsWith('/submit-business') && 'Submit Business'}
                  {pathname.startsWith('/profile') && 'Profile'}
                  {pathname.startsWith('/admin') && 'Admin'}
                  {pathname.startsWith('/login') && 'Login'}
                  {pathname.startsWith('/signup') && 'Sign Up'}
                </h1>
              </div>
            )}

            {/* Right side - Menu button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {user ? (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Signed in as: {user.email}
                    </div>
                    {userRole && (
                      <div className="px-3 py-1">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          userRole === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {userRole === 'admin' ? 'Admin' : 'User'}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 w-full mt-2"
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:block fixed left-0 top-16 h-full w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            
            {user && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="px-3 py-2 text-sm text-gray-500">
                  Signed in as: {user.email}
                </div>
                {userRole && (
                  <div className="px-3 py-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      userRole === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {userRole === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 w-full mt-2"
                >
                  <UserIcon className="h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 