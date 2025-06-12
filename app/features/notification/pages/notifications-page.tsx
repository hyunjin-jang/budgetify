import { BellIcon, BarChart3Icon, SettingsIcon } from "lucide-react";
import type { Route } from "./+types/notifications-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedIsUserId } from "~/features/settings/queries";
import { getNotifications } from "../queries";
import { formatTimeAgo } from "~/lib/utils";

// 알림 타입별 아이콘/배경색 매핑
const notificationTypeMap = {
  budget: {
    icon: <BellIcon className="size-5 text-primary" />,
    iconBg: "bg-primary/10",
  },
  goal: {
    icon: <BarChart3Icon className="size-5 text-green-500" />,
    iconBg: "bg-green-500/10",
  },
  expense: {
    icon: <SettingsIcon className="size-5 text-yellow-500" />,
    iconBg: "bg-yellow-500/10",
  },
  // 필요시 기타 타입 추가
  etc: {
    icon: <BellIcon className="size-5 text-muted-foreground" />,
    iconBg: "bg-muted",
  },
};
// const notifications = [
//   {
//     id: 1,
//     icon: <BellIcon className="size-5 text-primary" />,
//     iconBg: "bg-primary/10",
//     title: "새로운 예산 설정이 완료되었습니다",
//     description: "이번 달 예산이 성공적으로 설정되었습니다.",
//     time: "방금 전",
//     read: false,
//   },
//   {
//     id: 2,
//     icon: <BarChart3Icon className="size-5 text-green-500" />,
//     iconBg: "bg-green-500/10",
//     title: "목표 달성 축하합니다! 🎉",
//     description: "저축 목표 금액을 달성하셨습니다.",
//     time: "1시간 전",
//     read: false,
//   },
//   {
//     id: 3,
//     icon: <SettingsIcon className="size-5 text-yellow-500" />,
//     iconBg: "bg-yellow-500/10",
//     title: "지출 알림",
//     description: "이번 달 예산의 80%를 사용하셨습니다.",
//     time: "3시간 전",
//     read: true,
//   },
//   {
//     id: 4,
//     icon: <BellIcon className="size-5 text-primary" />,
//     iconBg: "bg-primary/10",
//     title: "새로운 알림 예시",
//     description: "이곳에 더 많은 알림이 표시됩니다.",
//     time: "어제",
//     read: true,
//   },
// ];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = await makeSSRClient(request);
  const userId = await getLoggedIsUserId(client);
  const notifications = await getNotifications(client, userId);

  return { notifications };
};

export default function NotificationPage({ loaderData }: Route.ComponentProps) {
  const { notifications } = loaderData;

  return (
    <div className="max-w-lg mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">알림함</h2>
      <div className="flex flex-col gap-3">
        {notifications.map((n) => {
          const typeInfo =
            notificationTypeMap[n.type as keyof typeof notificationTypeMap] ||
            notificationTypeMap.etc;
          return (
            <div
              key={n.id}
              className={`
                flex gap-4 items-start rounded-xl border 
                bg-card p-4 shadow-sm transition
                border-muted
                hover:shadow-md hover:bg-muted/30
              `}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full ${typeInfo.iconBg}`}
              >
                {typeInfo.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-base mb-1">{n.title}</div>
                <div className="text-sm text-muted-foreground">
                  {n.description}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatTimeAgo(n.created_at)}
                </div>
              </div>
              {!n.read && (
                <span
                  className="mt-1 ml-2 w-2 h-2 rounded-full bg-primary block"
                  title="읽지 않음"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
