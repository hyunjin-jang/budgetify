import { useState } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router";

type MenuItem = {
  name: string;
  to: string;
  items?: { name: string; to: string }[];
};

const menus: MenuItem[] = [
  {
    name: "대시보드",
    to: "/dashboard",
  },
  {
    name: "예산",
    to: "/budget",
  },
  {
    name: "지출",
    to: "/expenses",
  },
  {
    name: "목표",
    to: "/goals",
  },
  // {
  //   name: "설정",
  //   to: "/settings",
  //   items: [
  //     {
  //       name: "프로필 설정",
  //       to: "/settings/profile",
  //     },
  //   ],
  // },
  {
    name: "로그아웃",
    to: "auth/logout",
  },
];

export default function Sidebar({ isRoot }: { isRoot: boolean }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = (name: string) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  return (
    <>
      {/* 모바일 햄버거 메뉴 */}
      {!isOpen && !isRoot && (
        <div className="fixed top-4 left-4 z-50 md:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-md bg-neutral-800 hover:bg-neutral-700"
          >
            <Menu className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
      {/* 사이드바 */}
      <div
        className={`
          w-64 bg-neutral-800 shadow-lg transform 
          transition-transform duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:fixed md:left-0 md:top-0 md:h-screen
          fixed top-0 left-0 h-screen
          z-40
        `}
      >
        <nav className="p-4 flex flex-col gap-2 border-r h-full">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="text-white text-2xl font-bold">
              머니도비
            </Link>
            {/* 모바일에서만 보이는 닫기 버튼 */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md hover:bg-neutral-700 md:hidden"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

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
