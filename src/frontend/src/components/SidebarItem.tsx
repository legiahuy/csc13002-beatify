import { IconType } from "react-icons";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
  onClick?: () => void;
  extra?: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active,
  href,
  onClick,
  extra
}) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={twMerge(`
          flex
          w-full
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
        {extra && <span className="ml-auto">{extra}</span>}
      </button>
    );
  }

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
      {extra && <span className="ml-auto">{extra}</span>}
    </Link>
  );
}

export default SidebarItem;