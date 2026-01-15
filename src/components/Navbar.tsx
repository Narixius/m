import type { FC } from "react";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export const Navbar: FC<{ currentPathname: string }> = ({
  currentPathname,
}) => {
  return (
    <NavigationMenu className="mx-auto p-1 hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/#hero"
            className={cn("px-4", { active: currentPathname === "/" })}
          >
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/#features"
            className={cn("px-4", { active: currentPathname === "/#features" })}
          >
            Features
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/#how-it-works"
            className={cn("px-4", {
              active: currentPathname === "/#how-it-works",
            })}
          >
            How it works
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/#pricing"
            className={cn("px-4", { active: currentPathname === "/#pricing" })}
          >
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            href="/changelog"
            className={cn("px-4", { active: currentPathname === "/changelog" })}
          >
            Changelog
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
