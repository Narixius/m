import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

export const Navbar = () => {
  return (
    <NavigationMenu className="mx-auto p-1 hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink href="#hero" className="px-4">
            Home
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#features" className="px-4">
            Features
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#how-it-works" className="px-4">
            How it works
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#pricing" className="px-4">
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
