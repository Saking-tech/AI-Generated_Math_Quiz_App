"use client";

import DotGrid from './DotGrid';

export default function SimpleBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gray-900">
      <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor="#2A7E89"
          activeColor="#77FF00"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
    </div>
  );
}
