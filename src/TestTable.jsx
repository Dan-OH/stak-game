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
      <pre>{JSON.stringify(rows, null, 2)}</pre>
    </div>
  );
}

export default TestTable;
