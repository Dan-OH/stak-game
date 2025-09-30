import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';

function TestTable() {
  const [rows, setRows] = useState([]);
  const [newValue, setNewValue] = useState('');

  // Fetch rows on mount
  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel('public:test-table')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'test-table' },
        (payload) => {
          console.log('Realtime change:', payload);

          if (payload.eventType === 'INSERT') {
            setRows((prev) => [...prev, payload.new]);
          }
          if (payload.eventType === 'UPDATE') {
            setRows((prev) =>
              prev.map((row) => (row.id === payload.new.id ? payload.new : row))
            );
          }
          if (payload.eventType === 'DELETE') {
            setRows((prev) => prev.filter((row) => row.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchData() {
    const { data, error } = await supabase
      .from('test-table')
      .select('*')
      .order('id');
    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setRows(data);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!newValue.trim()) return;

    const { data, error } = await supabase
      .from('test-table')
      .insert([{ value: newValue }])
      .select(); // return inserted rows

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      setRows([...rows, ...data]); // append new rows
      setNewValue(''); // clear input
    }
  }

  return (
    <div>
      <h2>Data from test-table</h2>

      {/* Add new value */}
      <form onSubmit={handleAdd}>
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Enter value"
          required
        />
        <button type="submit">Add</button>
      </form>

      {/* Table */}
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
