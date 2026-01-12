import { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

interface TutorialStep {
  title: string;
  content: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: 'Welcome to Canadian Tax Planner! 🍁',
    content: 'This app helps you estimate your Canadian taxes, track income and expenses, optimize RRSP contributions, and generate reports. Let\'s take a quick tour!',
    position: 'center',
  },
  {
    title: 'Select Your Tax Year & Province',
    content: 'Start by selecting your tax year and province in the header. Tax rates vary by province and year, so this ensures accurate calculations.',
    target: 'header',
    position: 'bottom',
  },
  {
    title: 'Track Your Income',
    content: 'Add your T4 employment income, T5 investment income, self-employment earnings, and other income sources. The app calculates your total and tracks tax already withheld.',
    target: 'income',
    position: 'right',
  },
  {
    title: 'Log Business Expenses',
    content: 'If you\'re self-employed, track your business expenses here. Each category maps to the correct T2125 line number for easy tax filing.',
    target: 'expenses',
    position: 'right',
  },
  {
    title: 'Optimize Your RRSP',
    content: 'The RRSP Optimizer shows your tax brackets and calculates the optimal contribution to maximize your tax savings. See exactly how much you\'ll save!',
    target: 'rrsp',
    position: 'right',
  },
  {
    title: 'Tax Credits & Family',
    content: 'Track medical expenses, donations, and family members. These affect your tax credits and benefits like the Canada Child Benefit.',
    target: 'credits',
    position: 'right',
  },
  {
    title: 'GST/HST for Business',
    content: 'If you\'re registered for GST/HST, track your collected taxes and input tax credits here. The app calculates your remittance.',
    target: 'gst-hst',
    position: 'right',
  },
  {
    title: 'Generate Reports',
    content: 'Export your data to CSV or JSON, view tax summaries, and see breakdowns by category. Perfect for tax time!',
    target: 'reports',
    position: 'right',
  },
  {
    title: 'You\'re All Set! 🎉',
    content: 'Your data is saved locally in your browser. Start by adding your income on the Dashboard. Need help? Click the lightbulb icon anytime to restart this tutorial.',
    position: 'center',
  },
];

interface TutorialOverlayProps {
  onComplete: () => void;
  isOpen: boolean;
}

export function TutorialOverlay({ onComplete, isOpen }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
    if (isOpen) setCurrentStep(0);
  }, [isOpen]);

  if (!isVisible) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      setIsVisible(false);
      onComplete();
    } else {
      setCurrentStep(c => c + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirst) setCurrentStep(c => c - 1);
  };

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleSkip} />
      
      {/* Tutorial Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-fade-in">
        {/* Progress Bar */}
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {TUTORIAL_STEPS.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close tutorial"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h2>
          <p className="text-gray-600 leading-relaxed">{step.content}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip tutorial
          </button>
          
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              {isLast ? 'Get Started' : 'Next'}
              {!isLast && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TutorialButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
      title="Show tutorial"
    >
      <Lightbulb className="w-4 h-4" />
      <span className="hidden sm:inline">Help</span>
    </button>
  );
}
