type POSMenuButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function POSMenuButton({ onClick }: POSMenuButtonProps) {
  return (
    <button className="pos-menu-btn" onClick={onClick}>
      ☰
    </button>
  );
}
