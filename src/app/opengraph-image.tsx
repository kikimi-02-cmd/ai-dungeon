import { ImageResponse } from 'next/og';

export const alt = 'AIダンジョン — AIが紡ぐテキストアドベンチャーRPG';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'radial-gradient(120% 80% at 50% -10%, #2a2150, #0a0912 60%)',
          color: '#ece9f4',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }}
        >
          {/* 剣のモチーフ */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 14, height: 200, background: '#d8b04a', borderRadius: 4 }} />
            <div style={{ width: 72, height: 14, background: '#d8b04a', borderRadius: 4, marginTop: -8 }} />
            <div style={{ width: 20, height: 34, background: '#8a6d2a', borderRadius: 4, marginTop: 2 }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 120, fontWeight: 700, color: '#d8b04a', letterSpacing: 4 }}>
              AI DUNGEON
            </div>
            <div style={{ fontSize: 38, color: '#a39bb8', marginTop: 8 }}>
              An AI-woven Text Adventure RPG
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 18,
            marginTop: 56,
            fontSize: 26,
            color: '#6f6786',
          }}
        >
          <span>Story Mode</span>
          <span>·</span>
          <span>AI Endless Dungeon</span>
          <span>·</span>
          <span>Daily Quest</span>
        </div>
      </div>
    ),
    size
  );
}
