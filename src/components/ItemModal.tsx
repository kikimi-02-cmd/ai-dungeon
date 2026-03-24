interface Props {
  items: string[];
  onClose: () => void;
}

export default function ItemModal({ items, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1E1533] border border-[#4C1D95] rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[#A78BFA] font-bold text-lg">💼 所持アイテム</h2>
          <button onClick={onClose} className="text-[#6B7280] hover:text-[#E5E7EB] text-xl">✕</button>
        </div>
        {items.length === 0 ? (
          <p className="text-[#6B7280] text-sm text-center py-4">アイテムがありません</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-[#E5E7EB] text-sm bg-[#0F0A1A] rounded-lg px-3 py-2">
                <span className="text-[#F59E0B]">◆</span>
                {item}
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-[#6B7280] mt-3 text-center">{items.length}/5 スロット使用中</p>
      </div>
    </div>
  );
}
