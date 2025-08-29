import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useDataMode, getModeIndicatorText, getModeIndicatorColor, getModeIndicatorBgColor } from '@/hooks/useDataMode';
import { Database, Zap } from 'lucide-react';

interface ModeIndicatorProps {
  showToggle?: boolean;
  variant?: 'badge' | 'switch' | 'button';
  className?: string;
}

export const ModeIndicator: React.FC<ModeIndicatorProps> = ({
  showToggle = true,
  variant = 'badge',
  className = ''
}) => {
  const { mode, toggleMode, isMockMode, isApiMode } = useDataMode();

  const modeText = getModeIndicatorText(mode);
  const modeColor = getModeIndicatorColor(mode);
  const modeBgColor = getModeIndicatorBgColor(mode);

  if (variant === 'switch') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Database className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">Demo Mode</span>
        <Switch
          checked={isApiMode}
          onCheckedChange={toggleMode}
          aria-label="Toggle data mode"
        />
        <Zap className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">Live Mode</span>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={toggleMode}
        className={`${modeBgColor} ${modeColor} border-current hover:opacity-80 ${className}`}
      >
        {isMockMode ? (
          <>
            <Database className="h-4 w-4 mr-2" />
            {modeText}
          </>
        ) : (
          <>
            <Zap className="h-4 w-4 mr-2" />
            {modeText}
          </>
        )}
      </Button>
    );
  }

  // Default badge variant
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge
        variant="secondary"
        className={`${modeBgColor} ${modeColor} border-current`}
      >
        {isMockMode ? (
          <>
            <Database className="h-3 w-3 mr-1" />
            {modeText}
          </>
        ) : (
          <>
            <Zap className="h-3 w-3 mr-1" />
            {modeText}
          </>
        )}
      </Badge>
      
      {showToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMode}
          className="h-6 px-2 text-xs"
        >
          Switch
        </Button>
      )}
    </div>
  );
};

// Compact version for header/sidebar
export const CompactModeIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { mode, isMockMode } = useDataMode();
  const modeColor = getModeIndicatorColor(mode);

  return (
    <div className={`flex items-center justify-center w-6 h-6 rounded-full ${className}`}>
      {isMockMode ? (
        <Database className="h-3 w-3 text-orange-600" />
      ) : (
        <Zap className="h-3 w-3 text-green-600" />
      )}
    </div>
  );
};

// Tooltip version with more info
export const TooltipModeIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { mode, isMockMode } = useDataMode();
  const modeText = getModeIndicatorText(mode);
  const modeColor = getModeIndicatorColor(mode);

  return (
    <div className={`group relative ${className}`}>
      <div className={`flex items-center space-x-1 cursor-help ${modeColor}`}>
        {isMockMode ? (
          <Database className="h-4 w-4" />
        ) : (
          <Zap className="h-4 w-4" />
        )}
        <span className="text-xs font-medium">{modeText}</span>
      </div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
        {isMockMode 
          ? 'Using mock data for demonstration'
          : 'Connected to live API'
        }
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};
