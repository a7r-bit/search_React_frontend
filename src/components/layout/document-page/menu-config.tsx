import type { ContextMenuItem } from "@/components/ui/ContextMenu";
import {
  FolderArchive,
  Move,
  Pencil,
  Shield,
  Trash,
  Upload,
} from "lucide-react";

const DOCUMENT_PAGE_MENU_ITEMS: ContextMenuItem[] = [
  {
    id: "create-directory",
    label: "Create Directory",
    icon: <FolderArchive size={18} />,
    permission: "WRITE",
  },
  {
    id: "upload-file",
    label: "Upload File",
    icon: <Upload size={18} />,
    permission: "WRITE",
  },
  {
    id: "move",
    label: "Move",
    icon: <Move size={18} />,
    permission: "WRITE",
  },
  {
    id: "rename",
    label: "Rename",
    icon: <Pencil size={18} />,
    permission: "WRITE",
  },
  {
    id: "manage-access",
    label: "Manage Access",
    icon: <Shield size={18} />,
    permission: "ADMIN",
  },
  {
    id: "delete",
    label: "Delete",
    icon: <Trash size={18} />,
    danger: true,
    permission: "DELETE",
  },
];
export default DOCUMENT_PAGE_MENU_ITEMS;
