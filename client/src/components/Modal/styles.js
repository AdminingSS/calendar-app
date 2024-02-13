export default function() {
  return {
    root: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '60%'
    },
    content: {
      background: '#fff',
      borderRadius: 8,
      padding: 40,
      boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.75)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 40,
      marginBottom: 16
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      alignItems: 'flex-start',
      gap: 30,
      padding: '20px 0'
    },
    labelBox: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 20
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 20,
      paddingTop: 24,
      borderTop: '1px solid #ccc'
    }
  }
}