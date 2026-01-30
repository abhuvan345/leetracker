import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, List, Settings, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getStreak } from '@/lib/storage';
import { useEffect, useState } from 'react';
import faviconImg from '/favicon.png';

const Header = () => {
  const location = useLocation();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getStreak());
  }, [location]);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/questions', label: 'All Questions', icon: List },
    { path: '/admin', label: 'Admin', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={faviconImg} alt="LeetTrack" className="h-10 w-10 rounded-lg" />
            <span className="text-xl font-bold text-foreground">LeetTrack</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-accent px-4 py-2">
              <Flame className="h-5 w-5 text-accent-foreground" />
              <span className="font-bold text-accent-foreground">{streak}</span>
              <span className="text-sm text-accent-foreground/80">day streak</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex items-center gap-1 pb-3 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="flex-1">
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className="w-full gap-2"
                  size="sm"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
