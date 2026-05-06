"use client";

import { useUsers, useOldUsers } from "@/app/hooks/hooks";
import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IAuthUser } from "@/app/models/authuser";

/**
 * Old User
    "_id": "67258c6c1b3975a6bf5291f4",
    "firstName": "Ryan",
    "lastName": "Bucinell",
    "email": "rbucinell@gmail.com",
    "imageUrl": "https://lh3.googleusercontent.com/a/ACg8ocLcsELa-enTtJCAxwHzsSNGb5-dyFphkX3g8tFhVS0S1QGTc83wig=s88-w88-h88-c-k-no",
    "id": "67258c6c1b3975a6bf5291f4"
}
 */

export default function ConvertUsers() {
  const { users, usersError, usersLoading } = useUsers();
  const { oldUsers, oldUsersError, oldUsersLoading } = useOldUsers();

  const [oldUserOpen, setOldUserOpen] = React.useState(false);
  const [oldUserValue, setOldUserValue] = React.useState("");
  
  const [userOpen, setUserOpen] = React.useState(false);
  const [userValue, setUserValue] = React.useState("");

  const oldUserOptions =
    oldUsers?.map((user) => ({
      value: user._id,
      label: `${user.firstName} ${user.lastName} (${user.email})`,
    })) || [];

  const userOptions =
    users?.map((user:IAuthUser) => ({
      value: user._id,
      label: `${user.name} || ''} (${user.email || user._id})`.trim(),
    })) || [];

  const selectedOldUser = oldUsers?.find(user => user._id.toString() === oldUserValue);
  const selectedUser = users?.find(user => user._id.toString() === userValue);

  const [deleteOldUser, setDeleteOldUser] = React.useState(false);

  const handleConvert = () => {
    console.log('Converting users:', {
      oldUserId: oldUserValue,
      currentUserId: userValue,
      deleteOldUser: deleteOldUser
    });
    // Add your conversion logic here
  };

  return (
    <Card className="w-full p-4">
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Select an Old User:</Label>
            {oldUsersLoading && <p>Loading old users...</p>}
            {oldUsersError && (
              <p>Error loading old users: {oldUsersError.message}</p>
            )}
            <Popover open={oldUserOpen} onOpenChange={setOldUserOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={oldUserOpen} className="w-full justify-between">
                  {oldUserValue ? oldUserOptions.find((user) => user.value.toString() === oldUserValue)?.label : "Select old user..." }
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search old user..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      {oldUserOptions.map((user) => (
                        <CommandItem
                          key={user.value.toString()}
                          value={user.value.toString()}
                          onSelect={(currentValue) => {
                            setOldUserValue(currentValue === oldUserValue ? "" : currentValue);
                            setOldUserOpen(false);
                          }}
                        >
                          {user.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              oldUserValue === user.value.toString() ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {selectedOldUser && (
              <div className="space-y-2 mt-4">
                <Label>Selected Old User JSON:</Label>
                <Textarea 
                  readOnly 
                  value={JSON.stringify(selectedOldUser, null, 2)} 
                  className="font-mono text-sm min-h-[200px]"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Select a Current User:</Label>
            {usersLoading && <p>Loading users...</p>}
            {usersError && (
              <p>Error loading users: {usersError.message}</p>
            )}
            <Popover open={userOpen} onOpenChange={setUserOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={userOpen} className="w-full justify-between">
                  {userValue ? userOptions.find((user) => user.value.toString() === userValue)?.label : "Select current user..." }
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search current user..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      {userOptions.map((user) => (
                        <CommandItem
                          key={user.value.toString()}
                          value={user.value.toString()}
                          onSelect={(currentValue) => {
                            setUserValue(currentValue === userValue ? "" : currentValue);
                            setUserOpen(false);
                          }}
                        >
                          {user.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              userValue === user.value.toString() ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            
            {selectedUser && (
              <div className="space-y-2 mt-4">
                <Label>Selected Current User JSON:</Label>
                <Textarea 
                  readOnly 
                  value={JSON.stringify(selectedUser, null, 2)} 
                  className="font-mono text-sm min-h-[200px]"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="deleteOldUser"
                checked={deleteOldUser}
                onChange={(e) => setDeleteOldUser(e.target.checked)}
                className="w-4 h-4"
              />
              <Label htmlFor="deleteOldUser" className="cursor-pointer">
                Delete older user after convert?
              </Label>
            </div>
            <Button 
              onClick={handleConvert}
              disabled={!oldUserValue || !userValue}
              className="flex-1 h-12 text-lg font-semibold"
            >
              Convert Users
            </Button>
            
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
}