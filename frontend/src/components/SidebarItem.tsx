import { IconType } from "react-icons";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active,
  href
}) => {
  return (
    <Link
      href={href}
      className={twMerge(`
        flex
        items-center
        gap-x-4
        text-sm
        font-bold
        text-neutral-400
        hover:text-white
        transition
        py-2
        uppercase
      `,
        active && "text-white"
      )}
    >
      <Icon size={20} />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default SidebarItem;