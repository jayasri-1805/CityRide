import { useState } from 'react';
import { User } from '../types/auth';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { LogoutConfirmation } from './LogoutConfirmation';
import { 
  User as UserIcon, 
  Settings, 
  LogOut, 
  Bell,
  Shield,
  Menu,
  ChevronDown
} from 'lucide-react';

interface UserMenuProps {
  user: User;
  variant?: 'compact' | 'full';
  showUserInfo?: boolean;
}

export function UserMenu({ user, variant = 'compact', showUserInfo = true }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
    setIsOpen(false);
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (variant === 'compact') {
    return (
      <>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-2 p-2 hover:bg-accent"
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {getUserInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <UserIcon className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>

            {user.role === 'operator' && (
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Shield className="h-4 w-4" />
                <span>Operator Tools</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem 
              className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogoutClick}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <LogoutConfirmation
          isOpen={showLogoutConfirmation}
          onClose={() => setShowLogoutConfirmation(false)}
        />
      </>
    );
  }

  // Full variant with user info visible
  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-3 p-3 h-auto">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {getUserInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            {showUserInfo && (
              <div className="text-left">
                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
              </div>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          
          <DropdownMenuSeparator />

          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <UserIcon className="h-4 w-4" />
            <span>View Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <Settings className="h-4 w-4" />
            <span>Account Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </DropdownMenuItem>

          {user.role === 'operator' && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Shield className="h-4 w-4" />
                <span>Operator Dashboard</span>
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem 
            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
            onClick={handleLogoutClick}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
      />
    </>
  );
}