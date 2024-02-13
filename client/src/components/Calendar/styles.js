export default function() {
  return {
    root: {
      padding: 40,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 40,
      padding: 20,
      background: '#eee',
      marginBottom: 4
    },
    dateChanger: {
      display: 'flex',
      alignItems: 'center',
      gap: 30
    },
    controls: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 30
    },
    weekDay: {
      padding: 8,
      borderRadius: 4,
      marginBottom: 4,
      background: '#eee'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gridGap: 2
    },
    cell: {
      display: 'grid',
      alignContent: 'start',
      gridGap: 4,
      minHeight: 100,
      borderRadius: 4,
      padding: 8,
      background: '#ccc',
      cursor: 'pointer'
    },
    cellOther: {
      background: '#eee'
    }
  }
}