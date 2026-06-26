import { NavLink } from "react-router-dom";

const items = [
  { name: "All Tiles", link: "/" },
  { name: "Floor", link: "/category/FLOOR" },
  { name: "Wall", link: "/category/WALL" },
  { name: "Bathroom", link: "/category/BATHROOM" },
  { name: "Kitchen", link: "/category/KITCHEN" },
  { name: "Living Room", link: "/category/LIVING ROOM" },
  { name: "Outdoor", link: "/category/OUTDOOR" },
  { name: "Parking", link: "/category/PARKING" },
  { name: "Ceramic", link: "/category/CERAMIC" },
  { name: "Stone", link: "/category/STONE" },
];

function SecondNavbar() {
  return (
    <div className="bg-[#1a1a1a] py-2.5">
      <div className="max-w-[1250px] mx-auto px-4">
        <ul className="flex gap-6 overflow-x-auto scrollbar-none list-none m-0 p-0 [&::-webkit-scrollbar]:hidden">
          {items.map((item, index) => (
            <li key={index} className="shrink-0">
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `text-sm font-bold whitespace-nowrap no-underline transition-colors duration-200 ${isActive ? "text-blue-400" : "text-white hover:text-orange-400"
                  }`
                }
                end={item.link === "/"}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SecondNavbar;