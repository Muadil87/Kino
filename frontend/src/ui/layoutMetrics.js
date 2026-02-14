export const compactMetricsStyles = (width) => {
  const baseGap = 8
  const container = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: `${baseGap}px`,
    alignItems: 'flex-start',
    marginTop: `${baseGap}px`,
  }
  const item = {
    display: 'flex',
    flexDirection: 'column',
    minWidth: width >= 1024 ? '180px' : width >= 768 ? '160px' : '140px',
    gap: '4px',
  }
  const badge = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'rgba(20,20,20,0.85)',
    color: 'var(--foreground)',
  }
  const icon = {
    width: 16,
    height: 16,
  }
  return { container, item, badge, icon, baseGap }
}
