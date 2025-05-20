import { Link } from "react-router";
import { Separator } from "~/common/components/ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "~/lib/utils";
import { LogOutIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  BarChart3Icon,
  BellIcon,
  MessageCircleIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const menus = [
  {
    name: "대시보드",
    to: "/dashboard",
    items: [
      {
        name: "예산 설정 및 내역",
        description:
          "수입에 맞춘 예산 설정 및 금액대를 설정하여 초심자 중급자 고급자 레벨에 맞는 예산 설정을 할 수 있습니다.",
        to: "/dashboard/budget",
      },
      // {
      //   name: "수입 설정",
      //   description: "수입을 설정할 수 있습니다.",
      //   to: "/dashboard/income",
      // },
      {
        name: "지출 설정 및 내역",
        description:
          "지출 내역의 확인 및 지출 내역을 추가할 수 있으며 지출의 설정을 조정할 수 있습니다.",
        to: "/dashboard/expenses",
      },
      {
        name: "목표 설정 및 내역",
        description:
          "목표금액을 설정할 수 있으며 목표 달성 내역을 확인 및 목표 달성 내역을 추가할 수 있습니다.",
        to: "/dashboard/goals",
      },
    ],
  },
  // {
  //   name: "Jobs",
  //   to: "/jobs",
  //   items: [
  //     {
  //       name: "Remote Jobs",
  //       description: "Find a remote job in our community",
  //       to: "/jobs?location=remote",
  //     },
  //     {
  //       name: "Full-Time Jobs",
  //       description: "Find a full-time job in our community",
  //       to: "/jobs?type=full-time",
  //     },
  //     {
  //       name: "Freelance Jobs",
  //       description: "Find a freelance job in our community",
  //       to: "/jobs?type=freelance",
  //     },
  //     {
  //       name: "Internships",
  //       description: "Find an internship in our community",
  //       to: "/jobs?type=internship",
  //     },
  //     {
  //       name: "Submit a Job",
  //       description: "Submit a job to our community",
  //       to: "/jobs/submit",
  //     },
  //   ],
  // },
  // {
  //   name: "Community",
  //   to: "/community",
  //   items: [
  //     {
  //       name: "All Posts",
  //       description: "See all posts in our community",
  //       to: "/community",
  //     },
  //     {
  //       name: "Top Posts",
  //       description: "See the top posts in our community",
  //       to: "/community?sort=top",
  //     },
  //     {
  //       name: "New Posts",
  //       description: "See the new posts in our community",
  //       to: "/community?sort=new",
  //     },
  //     {
  //       name: "Create a Post",
  //       description: "Create a post in our community",
  //       to: "/community/create",
  //     },
  //   ],
  // },
  // {
  //   name: "IdeasGPT",
  //   to: "/ideas",
  // },
  // {
  //   name: "Teams",
  //   to: "/teams",
  //   items: [
  //     {
  //       name: "All Teams",
  //       description: "See all teams in our community",
  //       to: "/teams",
  //     },
  //     {
  //       name: "Create a Team",
  //       description: "Create a team in our community",
  //       to: "/teams/create",
  //     },
  //   ],
  // },
];

export default function Navigation({
  isLoggedIn,
  hasNotifications,
  hasMessages,
}: {
  isLoggedIn: boolean;
  hasNotifications: boolean;
  hasMessages: boolean;
}) {
  return (
    <nav className="flex px-20 h-16 items-center justify-between backdrop-blur fixed top-0 left-0 right-0 z-50 bg-background/50">
      <div className="flex items-center">
        <Link to="/" className="font-bold tracking-tighter text-lg">
          Budgetify
        </Link>
        <Separator orientation="vertical" className="h-6 mx-4" />
        <NavigationMenu>
          <NavigationMenuList>
            {menus.map((menu) => (
              <NavigationMenuItem key={menu.name}>
                {menu.items ? (
                  <>
                    <Link to={menu.to}>
                      <NavigationMenuTrigger>{menu.name}</NavigationMenuTrigger>
                    </Link>
                    <NavigationMenuContent>
                      <ul className="grid w-[600px] font-light gap-3 p-4 grid-cols-2">
                        {menu.items?.map((item) => (
                          <NavigationMenuItem
                            key={item.name}
                            className={cn([
                              "select-none rounded-md transition-colors focus:bg-accent  hover:bg-accent",
                              item.to === "/products/promote" &&
                                "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                              item.to === "/jobs/submit" &&
                                "col-span-2 bg-primary/10 hover:bg-primary/20 focus:bg-primary/20",
                            ])}
                          >
                            <NavigationMenuLink asChild>
                              <Link
                                className="p-3 space-y-1 block leading-none no-underline outline-none"
                                to={item.to}
                              >
                                <span className="text-sm font-medium leading-none">
                                  {item.name}
                                </span>
                                <p className="text-sm leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <Link className={navigationMenuTriggerStyle()} to={menu.to}>
                    {menu.name}
                  </Link>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" asChild className="relative">
            <Link to="/my/notifications">
              <BellIcon className="size-4" />
              {hasNotifications && (
                <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
              )}
            </Link>
          </Button>
          <Button size="icon" variant="ghost" asChild className="relative">
            <Link to="/my/messages">
              <MessageCircleIcon className="size-4" />
              {hasMessages && (
                <div className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full" />
              )}
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* <Avatar>
                <AvatarImage src="https://github.com/serranoarevalo.png" />
                <AvatarFallback>N</AvatarFallback>
              </Avatar> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span className="font-medium">John Doe</span>
                <span className="text-xs text-muted-foreground">@username</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/dashboard">
                    <BarChart3Icon className="size-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/profile">
                    <UserIcon className="size-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/my/settings">
                    <SettingsIcon className="size-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/auth/logout">
                  <LogOutIcon className="size-4 mr-2" />
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          {/* <Button asChild variant="secondary">
            <Link to="/auth/login">Login</Link>
          </Button> */}
          <Button asChild>
            <Link to="/auth/join">Join</Link>
          </Button>
        </div>
      )}
    </nav>
  );
}
