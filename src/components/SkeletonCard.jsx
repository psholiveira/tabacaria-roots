// Skeleton placeholders para enquanto os produtos carregam do Supabase

export function SkeletonCard() {
  return (
    <div className="r-card" style={{ padding: 12, overflow: 'hidden' }}>
      <div className="skel" style={{ aspectRatio: '1', borderRadius: 6, marginBottom: 10 }}/>
      <div className="skel" style={{ height: 13, width: '78%', borderRadius: 4, marginBottom: 6 }}/>
      <div className="skel" style={{ height: 11, width: '48%', borderRadius: 4, marginBottom: 10 }}/>
      <div className="skel" style={{ height: 17, width: '36%', borderRadius: 4 }}/>
    </div>
  );
}

export function SkeletonGrid({ count = 4, columns = 2, gap = 12 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap,
    }}>
      {Array.from({ length: count }, (_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
