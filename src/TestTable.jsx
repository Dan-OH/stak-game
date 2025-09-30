import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

function TestTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from('test-table').select('*'); // fetch all columns

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setRows(data);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h2>Data from test-table</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Created At</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.created_at}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TestTable;
