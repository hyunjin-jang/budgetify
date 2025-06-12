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
import { cn, formatTimeAgo } from "~/lib/utils";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";

const menus = [
  {
    name: "머니도비에 대하여",
    to: "/about",
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
];

const notificationTypeMap = {
  budget: {
    icon: <BellIcon className="size-4 text-primary" />,
    iconBg: "bg-primary/10",
  },
  goal: {
    icon: <BarChart3Icon className="size-4 text-green-500" />,
    iconBg: "bg-green-500/10",
  },
  expense: {
    icon: <SettingsIcon className="size-4 text-yellow-500" />,
    iconBg: "bg-yellow-500/10",
  },
  etc: {
    icon: <BellIcon className="size-4 text-muted-foreground" />,
    iconBg: "bg-muted",
  },
};

type Notification = {
  id: string;
  user_id: string | null;
  type: string;
  title: string;
  description: string;
  created_at: string;
  read: boolean;
};

export default function Navigation({
  isRoot,
  isLoggedIn,
  hasNotifications,
  hasMessages,
  notifications,
}: {
  isRoot: boolean;
  isLoggedIn: boolean;
  hasNotifications: boolean;
  hasMessages: boolean;
  notifications: Notification[];
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <nav
      className="
      flex px-8 h-16 items-center justify-between fixed 
      top-0 left-0 right-0 md:px-16 backdrop-blur-sm
      bg-background/50 z-10
      "
    >
      <div className="flex items-center">
        {isRoot && (
          <Link to="/" className="font-bold tracking-tighter text-lg">
            머니도비
          </Link>
        )}
        <Separator orientation="vertical" className="h-6 mx-4" />
        <NavigationMenu></NavigationMenu>
      </div>
      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger>
              <div className="relative">
                <BellIcon className="size-4" />
                {notifications.length > 0 && (
                  <div className="absolute bottom-3 left-3.5 size-2 bg-red-500 rounded-full" />
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent align="end">
              <div className="flex flex-col ">
                {notifications.length > 0 ? (
                  <>
                    <div className="px-4 py-3 border-b">
                      <h4 className="font-medium text-sm">알림</h4>
                    </div>
                    <div className="flex flex-col divide-y">
                      {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 p-6">
                          <div className="rounded-full bg-muted p-3">
                            <BellIcon className="size-6 text-muted-foreground" />
                          </div>
                          <div className="text-center">
                            <p className="font-medium text-sm">
                              알림이 없습니다
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              새로운 알림이 오면 여기에 표시됩니다
                            </p>
                          </div>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => {
                          const typeInfo =
                            notificationTypeMap[
                              n.type as keyof typeof notificationTypeMap
                            ] || notificationTypeMap.etc;
                          return (
                            <div
                              key={n.id}
                              className="flex gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                              <div
                                className={`w-10 h-10 flex items-center justify-center rounded-full ${typeInfo.iconBg}`}
                              >
                                {typeInfo.icon}
                              </div>
                              <div className="flex-1 space-y-1">
                                <p className="text-sm font-medium">{n.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {n.description}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatTimeAgo(n.created_at)}
                                </p>
                              </div>
                              {!n.read && (
                                <span
                                  className="mt-1 ml-2 w-2 h-2 rounded-full bg-primary block"
                                  title="읽지 않음"
                                />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div className="p-2 border-t">
                      <Link
                        to="/notification"
                        className="
                          block w-full text-center text-sm 
                          text-muted-foreground hover:text-foreground 
                          transition-colors py-2
                        "
                        onClick={() => setPopoverOpen(false)}
                      >
                        모든 알림 보기
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 p-6">
                    <div className="rounded-full bg-muted p-3">
                      <BellIcon className="size-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-sm">알림이 없습니다</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        새로운 알림이 오면 여기에 표시됩니다
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
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
