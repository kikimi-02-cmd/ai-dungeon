const apps = [
  { name: 'ポケモジ', url: 'https://pokemoji.vercel.app/' },
  { name: 'ふたりの記念日', url: 'https://futari-kinenbi.vercel.app/' },
  { name: 'AIなぞなぞ', url: 'https://ai-nazonazo.vercel.app/' },
  { name: 'Mine Rogue', url: 'https://mine-rogue.vercel.app/' },
  { name: 'ふたり旅プランナー', url: 'https://futari-trip.vercel.app/' },
];

export default function CrossPromo() {
  return (
    <div className="mt-8 border-t border-[#4C1D95] pt-6">
      <p className="text-xs font-semibold text-[#A78BFA] mb-3 text-center">おすすめアプリ</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {apps.map((app) => (
          <a
            key={app.name}
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#A78BFA] border border-[#4C1D95] rounded-full px-3 py-1 hover:bg-[#4C1D95] transition-colors"
          >
            {app.name}
          </a>
        ))}
      </div>
    </div>
  );
}
