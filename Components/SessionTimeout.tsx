import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Clock, AlertTriangle, RefreshCw } from 'lucide-react';

interface SessionTimeoutProps {
  timeoutMinutes?: number;
  warningMinutes?: number;
}

export function SessionTimeout({ timeoutMinutes = 30, warningMinutes = 5 }: SessionTimeoutProps) {
  const { auth, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Reset activity timer on user interaction
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  // Session timeout logic
  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      const timeoutMs = timeoutMinutes * 60 * 1000;
      const warningMs = warningMinutes * 60 * 1000;
      const remainingMs = timeoutMs - timeSinceActivity;

      if (remainingMs <= 0) {
        // Session expired
        logout();
        setShowWarning(false);
      } else if (remainingMs <= warningMs && !showWarning) {
        // Show warning
        setShowWarning(true);
      } else if (remainingMs > warningMs && showWarning) {
        // Hide warning if user became active again
        setShowWarning(false);
      }

      setTimeLeft(Math.max(0, Math.floor(remainingMs / 1000)));
    }, 1000);

    return () => clearInterval(interval);
  }, [auth.isAuthenticated, lastActivity, timeoutMinutes, warningMinutes, showWarning, logout]);

  const extendSession = () => {
    setLastActivity(Date.now());
    setShowWarning(false);
  };

  const handleLogout = () => {
    logout();
    setShowWarning(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (timeLeft / (warningMinutes * 60)) * 100;

  if (!auth.isAuthenticated || !showWarning) {
    return null;
  }

  return (
    <AlertDialog open={showWarning} onOpenChange={() => {}}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            Session Expiring Soon
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              <span>Your session will expire due to inactivity.</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Time remaining:</span>
                <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <p className="text-sm text-muted-foreground">
              Click "Stay Signed In" to extend your session, or "Sign Out" to log out now.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel 
            onClick={handleLogout}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Sign Out
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={extendSession}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Stay Signed In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}