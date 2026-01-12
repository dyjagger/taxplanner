import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useUserStore } from '../../stores/userStore';
import { useTaxDataStore } from '../../stores/taxDataStore';
import { useTutorialStore } from '../../stores/tutorialStore';
import { TutorialOverlay } from '../tutorial/TutorialOverlay';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile } = useUserStore();
  const { loadTaxData } = useTaxDataStore();
  const { hasSeenTutorial, showTutorial, openTutorial, closeTutorial } = useTutorialStore();

  useEffect(() => {
    loadTaxData(profile.taxYear);
  }, [profile.taxYear, loadTaxData]);

  useEffect(() => {
    if (!hasSeenTutorial) {
      openTutorial();
    }
  }, [hasSeenTutorial, openTutorial]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        onHelpClick={openTutorial}
      />
      
      <div className="flex flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      
      <Footer />
      
      <TutorialOverlay isOpen={showTutorial} onComplete={closeTutorial} />
    </div>
  );
}
