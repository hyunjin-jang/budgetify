import { useState } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router";

type MenuItem = {
  name: string;
  to: string;
  items?: { name: string; to: string }[];
};

export default function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menus: MenuItem[] = [
    {
      name: "대시보드",
      to: "/dashboard",
    },
    {
      name: "예산",
      to: "/budget",
      // items: [
      //   {
      //     name: "예산 내역",
      //     to: "/budget/history",
      //   },
      //   {
      //     name: "예산 설정",
      //     to: "/budget/settings",
      //   },
      // ],
    },
    {
      name: "지출",
      to: "/expenses",
      // items: [
      //   {
      //     name: "지출 내역",
      //     to: "/expenses/history",
      //   },
      //   {
      //     name: "지출 설정",
      //     to: "/expenses/settings",
      //   },
      // ],
    },
    {
      name: "목표",
      to: "/goals",
      // items: [
      //   {
      //     name: "목표 내역",
      //     to: "/goals/history",
      //   },
      //   {
      //     name: "목표 설정",
      //     to: "/goals/settings",
      //   },
      // ],
    },
    {
      name: "설정",
      to: "/settings",
      items: [
        {
          name: "프로필 설정",
          to: "/settings/profile",
        },
        // {
        //   name: "알림 설정",
        //   to: "/settings/notifications",
        // },
        // {
        //   name: "계정 설정",
        //   to: "/settings/account",
        // },
      ],
    },
    {
      name: "로그아웃",
      to: "auth/logout",
    },
  ];

  const toggleMenu = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  return (
    <>
      {/* 사이드바 */}
      <div
        className={`
          w-64 bg-neutral-800 shadow-lg transform 
          transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:shadow-none md:block
          h-full md:h-auto
          fixed md:static z-40 md:z-0
        `}
      >
        <nav className="p-4 flex flex-col gap-2 border-r min-h-full">
          <Link to="/" className="text-white text-2xl font-bold mb-4">
            머니도비
          </Link>

          {menus.map((menu) => (
            <div key={menu.name}>
              <div
                onClick={() =>
                  menu.items ? toggleMenu(menu.name) : setIsOpen(false)
                }
                className="flex justify-between items-center w-full text-white hover:bg-neutral-700 p-2 rounded-md transition-colors cursor-pointer"
              >
                {menu.items ? (
                  <span className="flex-1 text-left">{menu.name}</span> // ✅ items가 있는 경우 span으로
                ) : (
                  <Link to={menu.to} className="flex-1 text-left">
                    {menu.name}
                  </Link> // ✅ items가 없을 때만 링크 이동
                )}
                {menu.items &&
                  (openMenu === menu.name ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  ))}
              </div>

              {/* 하위 메뉴 */}
              {menu.items && openMenu === menu.name && (
                <div className="pl-4 flex flex-col gap-1 mt-1">
                  {menu.items.map((sub) => (
                    <Link
                      key={sub.name}
                      to={sub.to}
                      onClick={() => setIsOpen(false)}
                      className={`text-sm text-white p-2 rounded-md hover:bg-neutral-700 transition-colors`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
