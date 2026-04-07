"use client";

import { User } from "@/lib/types/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Building2, MapPin, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface UserDetailProps {
  user: User;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function UserDetail({ user, onEdit, onDelete }: UserDetailProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary/10 text-primary text-lg">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <Badge variant="secondary" className="font-mono text-xs">
            ID: {user.id}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Email:</span>
          <span className="font-medium">{user.email}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Phone:</span>
          <span className="font-medium">{user.phone || "Not specified"}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Company:</span>
          <span className="font-medium">{user.company || "Not specified"}</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">City:</span>
          <span className="font-medium">{user.city || "Not specified"}</span>
        </div>
      </div>


      {(onEdit || onDelete) && (
        <>
          <Separator />
          <div className="flex gap-2">
            {onEdit && (
              <Button variant="outline" className="flex-1" onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="outline" 
                className="flex-1 text-destructive hover:text-destructive" 
                onClick={onDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
