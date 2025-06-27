import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button";

export default async function NavBarUserOrLogin() {

  const session = await auth.api.getSession({
    headers: await headers()
  });
  return <span>
    {session ? <form action={async () => {
      "use server";
      await auth.api.signOut({
        headers: await headers()
      });
      redirect("/");
    }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-9 w-9">
            <AvatarImage src={session.user.image as string} alt={`${session.user.name} profile image`} />
            <AvatarFallback className="text-black">{`${session.user.name.split(" ")[0].charAt(0).toUpperCase()}${session.user.name.split(" ")[1].charAt(0).toUpperCase()}`}</AvatarFallback>
            <span className="sr-only">Toggle user menu</span>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>My Account</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
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
                  <AlertDialogAction onClick={async () => {
                    "use server";
                    await auth.api.signOut({
                      headers: await headers()
                    });
                    redirect("/")
                  }}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </form> : <Link href='/sign-in' className={buttonVariants({ variant: 'default' })}>Sign In</Link>
    }
  </span >
  // return ()
}
