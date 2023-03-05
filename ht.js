async function createTable(id) {
  const histories = dummydata;
  const columnSettings = [
      // id history
      {
          title: 'ID History',
          key: 'id',
          defaultData: 'newId',
          input: {
              dataType: 'string',
              type: 'text',
              readonly: true,
          }
      },
      // shift
      {
          title: 'Shift',
          key: 'shift',
          defaultData: '1',
          input: {
              dataType: 'number',
              type: 'select',
              style: 'width: 70px;',
              options: [
                  { title: '1', value: '1' },
                  { title: '2', value: '2' },
                  { title: '3', value: '3' },
              ] 
          }
      },
      // prev_kwh
      {
          title: 'Kwh Awal',
          key: 'prev_kwh',
          defaultData: 0,
          input: {
              dataType: 'number',
              type: 'number',
              step: 'any',
              readonly: true,
              validation: ({targetValue, prev, cur, next}) => {
                if (targetValue > cur.data['last_kwh']) {
                  return cur.data['last_kwh'];
                }
                return targetValue;
              }
          }
      },
      // last_kwh
      {
          title: 'Kwh Akhir',
          key: 'last_kwh',
          defaultData: 0,
          input: {
              dataType: 'number',
              type: 'number',
              step: 'any',
              readonly: (data) => data['type'] === 'pembelian',
              validation: ({targetValue, prev, cur, next}) => {
                let returnValue = targetValue;
    
                if (next) {
                  const maxValue = next.data['last_kwh'];
                  if (targetValue > maxValue) returnValue = maxValue;
                }

                if (prev) {
                  const minValue = prev.data['last_kwh'];
                  if (targetValue < minValue) returnValue = minValue;
                }

                if (cur.data['prev_kwh'] !== undefined) {
                  const minValue = cur.data['prev_kwh'];
                  if (targetValue < minValue) returnValue = minValue;
                }
  
                return returnValue;
              }
          },
      },
      // diff_kwh
      {
          title: 'Kwh',
          key: 'diff_kwh',
          defaultData: 0,
          input: {
              dataType: 'number',
              type: 'number',
              readonly: (data) => data['type'] === 'pemakaian',
          }
      },
      // type
      {
          title: 'Keterangan',
          key: 'type',
          defaultData: 'pemakaian',
          input: {
              dataType: 'string',
              type: 'select',
              style: 'width: 150px !important;',
              options: [
                  { title: 'Pemakaian', value: 'pemakaian' },
                  { title: 'Pembelian', value: 'pembelian' },
              ],
              onchange: (e) => {
                // console.log(e);
              }
          }
      },
      // created_at
      {
          title: 'Tanggal',
          key: 'created_at',
          input: {
              dataType: 'string',
              type: 'datetime-local',
          }
      },
  ];
  const relations = [
      {
          current: 'last_kwh',
          toNext: 'prev_kwh',
          aggregate: () => {},
      }
  ]
  const ht = new Historical({
      table: '#ht',
      unique: 'id',
      reversed: true,
      histories, 
      columnSettings,
      relations,
      recalculate: ({prev, cur, next}) => {
        if (cur.data['type'] === 'pemakaian') {
          cur.data['diff_kwh'] = Math.abs(cur.data['last_kwh'] - cur.data['prev_kwh']);
        }

        if (cur.data['type'] === 'pembelian') {
          cur.data['last_kwh'] = cur.data['prev_kwh'] + cur.data['diff_kwh'];
        }
      }
  });
  ht.draw();
}

async function fetchData(store) {
  let res =  await fetch('/histories/' + store);
  res = await res.json();
  return res.data;
}

function toISOStringWithTimezone(date) {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? '+' : '-';
  const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds())
};