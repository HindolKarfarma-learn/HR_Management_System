import { Outlet } from 'react-router-dom';
import { Drawer } from '../components/ui/Drawer';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { useUiStore } from '../store/uiStore';
import { cn } from '../utils/cn';

export default function AppLayout() {
  const { sidebarCollapsed, mobileMenuOpen, setMobileMenuOpen } = useUiStore();
  return (
    <div className="min-h-screen bg-slate-50">
      <a href="#main-content" className="sr-only z-[100] rounded-lg bg-white px-4 py-2 text-brand-700 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to main content</a>
      <aside className={cn('fixed inset-y-0 left-0 z-30 hidden border-r border-slate-200 transition-[width] duration-300 lg:block', sidebarCollapsed ? 'w-20' : 'w-64')}>
        <Sidebar />
      </aside>
      <Drawer open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Sidebar mobile onNavigate={() => setMobileMenuOpen(false)} />
      </Drawer>
      <div className={cn('transition-[padding] duration-300', sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64')}>
        <Navbar />
        <main id="main-content" className="p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px]"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}
