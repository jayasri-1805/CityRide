import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner@2.0.3';
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
import { LogOut, AlertTriangle } from 'lucide-react';

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: React.ReactNode;
}

export function LogoutConfirmation({ isOpen, onClose, trigger }: LogoutConfirmationProps) {
  const { logout, auth } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      logout();
      onClose();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      {trigger}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirm Logout
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to sign out of your CityTransit account?
            {auth.user && (
              <div className="mt-2 p-3 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Signed in as:</strong> {auth.user.firstName} {auth.user.lastName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {auth.user.email} • {auth.user.role}
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Quick logout button component that can be used anywhere
interface QuickLogoutButtonProps {
  variant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  children?: React.ReactNode;
  showHoverToast?: boolean;
}

export function QuickLogoutButton({ 
  variant = 'destructive', 
  size = 'default',
  showIcon = true,
  children,
  showHoverToast = false
}: QuickLogoutButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleMouseEnter = () => {
    if (showHoverToast) {
      toast('💡 Click to sign out securely', {
        description: 'Your session will be completely cleared',
        duration: 2000,
      });
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowConfirmation(true)}
        onMouseEnter={handleMouseEnter}
        className="flex items-center gap-2"
      >
        {showIcon && <LogOut className="w-4 h-4" />}
        {children || 'Sign Out'}
      </Button>
      
      <LogoutConfirmation
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
      />
    </>
  );
}