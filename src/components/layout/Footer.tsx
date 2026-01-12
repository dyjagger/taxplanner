import { AlertTriangle, ExternalLink } from 'lucide-react';
import { useTaxDataStore } from '../../stores/taxDataStore';

export function Footer() {
  const { data, dataAge } = useTaxDataStore();

  const getDataAgeColor = () => {
    if (dataAge < 30) return 'text-green-600';
    if (dataAge < 180) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDataAgeIcon = () => {
    if (dataAge < 30) return '✓';
    if (dataAge < 180) return '⚠️';
    return '❌';
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="px-4 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-start gap-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <p className="text-xs">
              <strong>Disclaimer:</strong> This tool provides estimates only and is not professional tax advice.
              Always verify with CRA-certified software or a licensed tax professional.
            </p>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            {data && (
              <span className={`flex items-center gap-1 ${getDataAgeColor()}`}>
                {getDataAgeIcon()} Tax data: {data.source}
                {dataAge > 0 && ` (${dataAge} days old)`}
              </span>
            )}
            <a
              href="https://www.canada.ca/en/revenue-agency.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
            >
              CRA Website
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
