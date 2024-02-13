export default function() {
  return {
    root: {
      display: 'grid',
      gridGap: 8,
      background: '#fff',
      borderRadius: 4,
      padding: 8
    },
    labels: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8
    },
    label: {
      padding: 4,
      borderRadius: 4,
      height: 2,
      width: 32
    }
  }
}