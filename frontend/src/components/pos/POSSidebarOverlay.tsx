type Props = {
  open: boolean;
  onClose: () => void;
};

export default function POSSidebarOverlay({ open, onClose }: Props) {
  if (!open) return null;
  return <div className="pos-sidebar-overlay" onClick={onClose} />;
}
