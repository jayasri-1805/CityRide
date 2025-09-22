import { useState } from 'react';
import { User } from '../types/auth';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { LogoutConfirmation } from './LogoutConfirmation';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Settings, 
  LogOut, 
  Bell,
  MapPin,
  ChevronDown
} from 'lucide-react';

interface UserProfileProps {
  user: User;
  variant?: 'dropdown' | 'full';
}

export function UserProfile({ user, variant = 'dropdown' }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirmation(true);
    setIsOpen(false); // Close dropdown when opening confirmation
  };

  const getUserInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 text-white';
      case 'operator':
        return 'bg-blue-500 text-white';
      case 'passenger':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (variant === 'dropdown') {
    return (
      <>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-sm">
                  {getUserInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{user.firstName}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {getUserInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
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
                <span>Operator Dashboard</span>
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
        
        {/* Logout Confirmation Dialog */}
        <LogoutConfirmation
          isOpen={showLogoutConfirmation}
          onClose={() => setShowLogoutConfirmation(false)}
        />
      </>
    );
  }

  // Full profile view
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Profile
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* User Avatar and Basic Info */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {getUserInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <Badge className={`mt-1 ${getRoleBadgeColor(user.role)}`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="font-medium">Contact Information</h4>
          
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{user.email}</span>
          </div>
          
          {user.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>

        <Separator />

        {/* Account Details */}
        <div className="space-y-3">
          <h4 className="font-medium">Account Details</h4>
          
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
            <span>Last login {new Date(user.lastLogin).toLocaleString()}</span>
          </div>
        </div>

        {/* Preferences */}
        {user.preferences.favoriteRoutes.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Favorite Routes</h4>
              <div className="flex flex-wrap gap-2">
                {user.preferences.favoriteRoutes.map((route) => (
                  <Badge key={route} variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {route}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Button>
          
          <Button variant="outline" className="w-full justify-start" onClick={() => {}}>
            <Bell className="h-4 w-4 mr-2" />
            Notification Preferences
          </Button>
          
          <Button 
            variant="destructive" 
            className="w-full justify-start" 
            onClick={handleLogoutClick}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
      
      {/* Logout Confirmation Dialog */}
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={() => setShowLogoutConfirmation(false)}
      />
    </Card>
  );
}