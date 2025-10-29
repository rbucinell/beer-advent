import Link from "next/link";
import { signOutAction } from "@/app/actions/sign-out";
import { redirectToAccount } from "@/app/actions/redirect";
import { Session } from '@/lib/auth-client';
import { 
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator  
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from "@/components/ui/alert-dialog"


interface NavProps {
  session: Session | null;
}

export default function NavBarUserOrLogin({ session }: NavProps) {
  console.log( session );
  return (
    <span className="">
      {session ? <form action={async () => await signOutAction() }>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9">
              <AvatarImage src={session.user.image as string} alt={`${session.user.name} profile image`} />
              <AvatarFallback className="text-black">{`${session.user.name.split(" ")[0].charAt(0).toUpperCase()}${session.user.name.split(" ")[1].charAt(0).toUpperCase()}`}</AvatarFallback>
              <span className="sr-only">Toggle user menu</span>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={async () => await redirectToAccount()} >My Account</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <AlertDialog >
                <AlertDialogTrigger asChild>
                  <div className="text-destructive">Logout</div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                    <AlertDialogDescription>This will sign you out of your account.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={async () =>  await signOutAction()}>Logout</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </form> : 
        <h6 className={`h-6 flex flex-grow uppercase font-bold`}>
          <Link href='/sign-in'>Sign In</Link>
        </h6>
      }
    </span >
  )
}
