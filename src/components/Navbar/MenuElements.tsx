import { UilUser, UilChat, UilApps } from "@iconscout/react-unicons";
import { useRouter } from "next/router";

const MenuElements = () => {
  const router = useRouter();
  const active = router.pathname;
  const handleClick = (page: string) => {
    router.push(page);
  };
  const buttonActive =
    "flex h-[90px] cursor-pointer items-center gap-3 border-t-4 border-greenHighlight text-xl text-greenHighlight";
  const buttonInactive =
    "flex h-[90px] cursor-pointer items-center gap-3  text-xl text-gray-500";
  const buttonActiveMobile = "p-3 bg-greenHighlight text-gray-800 rounded-xl";

  return (
    <>
      {/* Menu items for desktop */}
      <div className="hidden items-center gap-12 md:flex">
        {active === "/profile" ? (
          <button className={buttonActive}>
            <UilUser className="-mt-[4px]" />
            <span className="-mt-[4px]">Profile</span>
          </button>
        ) : (
          <button
            className={buttonInactive}
            onClick={() => handleClick("profile")}
          >
            <UilUser />
            <span>Profile</span>
          </button>
        )}
        {active === "/" ? (
          <button className={buttonActive}>
            <UilChat className="-mt-[4px]" />
            <span className="-mt-[4px]">Chats</span>
          </button>
        ) : (
          <button className={buttonInactive} onClick={() => handleClick("/")}>
            <UilChat />
            <span>Chats</span>
          </button>
        )}
        {active === "/settings" ? (
          <button className={buttonActive}>
            <UilApps className="-mt-[4px]" />
            <span className="-mt-[4px]">Settings</span>
          </button>
        ) : (
          <button
            className={buttonInactive}
            onClick={() => handleClick("/settings")}
          >
            <UilApps />
            <span>Settings</span>
          </button>
        )}
      </div>
      {/* Menu Items for mobile */}
      <div className="flex w-[100%] items-center justify-around md:hidden">
        {active === "/profile" ? (
          <button className={buttonActiveMobile}>
            <UilUser />
          </button>
        ) : (
          <button className="p-3" onClick={() => handleClick("profile")}>
            <UilUser />
          </button>
        )}
        {active === "/" ? (
          <button className={buttonActiveMobile}>
            <UilChat />
          </button>
        ) : (
          <button className="p-3" onClick={() => handleClick("/")}>
            <UilChat />
          </button>
        )}
        {active === "/settings" ? (
          <button className={buttonActiveMobile}>
            <UilApps />
          </button>
        ) : (
          <button className="p-3" onClick={() => handleClick("/settings")}>
            <UilApps />
          </button>
        )}
      </div>
    </>
  );
};

export default MenuElements;
