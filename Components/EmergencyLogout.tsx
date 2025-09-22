import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LogOut, AlertTriangle, Clock, Shield, Zap } from 'lucide-react';

interface EmergencyLogoutProps {
  isOpen: boolean;
  onClose: () => void;
  autoLogoutSeconds?: number;
}

export function EmergencyLogout({ 
  isOpen, 
  onClose, 
  autoLogoutSeconds = 10 
}: EmergencyLogoutProps) {
  const { logout, auth } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [countdown, setCountdown] = useState(autoLogoutSeconds);
  const [autoLogoutEnabled, setAutoLogoutEnabled] = useState(false);

  // Reset countdown when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(autoLogoutSeconds);
      setAutoLogoutEnabled(false);
      setIsLoggingOut(false);
    }
  }, [isOpen, autoLogoutSeconds]);

  // Countdown timer for auto-logout
  useEffect(() => {
    if (isOpen && autoLogoutEnabled && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isOpen && autoLogoutEnabled && countdown === 0) {
      handleLogout();
    }
  }, [isOpen, autoLogoutEnabled, countdown]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      logout();
      onClose();
    } catch (error) {
      console.error('Emergency logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleInstantLogout = () => {
    setAutoLogoutEnabled(false);
    handleLogout();
  };

  const handleAutoLogout = () => {
    setAutoLogoutEnabled(true);
    setCountdown(autoLogoutSeconds);
  };

  const handleCancel = () => {
    setAutoLogoutEnabled(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Quick Logout Options
          </DialogTitle>
          <DialogDescription>
            Choose how you'd like to sign out of your CityTransit account.
            {auth.user && (
              <div className="mt-3 p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {auth.user.firstName} {auth.user.lastName}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {auth.user.role}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {auth.user.email}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last login: {new Date(auth.user.lastLogin).toLocaleString()}
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Auto-logout section */}
          {autoLogoutEnabled && (
            <div className="p-4 border-2 border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Auto-logout in progress
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-yellow-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${((autoLogoutSeconds - countdown) / autoLogoutSeconds) * 100}%` 
                    }}
                  />
                </div>
                <span className="text-sm font-mono text-yellow-700">
                  {countdown}s
                </span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                You will be automatically signed out unless you cancel.
              </p>
            </div>
          )}

          {/* Warning for unsaved work */}
          <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-orange-700">
              <p className="font-medium">Before you logout:</p>
              <ul className="mt-1 space-y-0.5 list-disc list-inside">
                <li>Any unsaved tracking preferences will be lost</li>
                <li>You'll need to login again to access your account</li>
                <li>Your session will be completely cleared</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoggingOut}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          
          {!autoLogoutEnabled && (
            <Button
              variant="secondary"
              onClick={handleAutoLogout}
              disabled={isLoggingOut}
              className="flex-1 sm:flex-none"
            >
              <Clock className="w-4 h-4 mr-2" />
              Auto Logout ({autoLogoutSeconds}s)
            </Button>
          )}

          <Button
            variant="destructive"
            onClick={handleInstantLogout}
            disabled={isLoggingOut}
            className="flex-1 sm:flex-none"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out Now
              </>
            )}
          </Button>
        </DialogFooter>

        {/* Keyboard shortcut hint */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            💡 Quick tip: Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl</kbd> + 
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs mx-1">Shift</kbd> + 
            <kbd className="px-1 py-0.5 bg-muted rounded text-xs">L</kbd> to open this dialog
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}