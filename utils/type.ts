export type HeaderProps = {
    name: string;
    visible: boolean;
    openMenu: () => void;
    closeMenu: () => void;
    onRename: (newName: string) => void;
    onDelete: () => void;
  };
  
  export type RenameModalProps = {
    visible: boolean;
    onClose: () => void;
    onSubmit: (newName: string) => void;
  };

  export interface ChangePasswordPayload {
    userId: string;
    currentPassword: string;
    newPassword: string;
  }