import type { TreeNodeEntity } from "@/api/model/tree/tree-entity";
import type { ContextMenuAction } from "@/components/ui/ContextMenu";
import type { MouseEvent } from "react";
import { useState } from "react";

type NodeContextMenuState = {
  x: number;
  y: number;
  node: TreeNodeEntity | null;
} | null;

export function useNodeContextMenu() {
  const [menu, setMenu] = useState<NodeContextMenuState>(null);

  const handleContextMenu = (node: TreeNodeEntity, event: MouseEvent) => {
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY, node });
  };

  const closeMenu = () => {
    setMenu(null);
  };

  const handleMenuAction = (action: ContextMenuAction) => {
    if (!menu?.node) return;

    switch (action) {
      case "rename":
        console.log("Rename node:", menu.node.id);
        break;
      case "delete":
        console.log("Delete node:", menu.node.id);
        break;
      default:
        console.log("Context action:", action, "for node:", menu.node.id);
    }
  };

  return {
    menu,
    handleContextMenu,
    closeMenu,
    handleMenuAction,
  };
}
