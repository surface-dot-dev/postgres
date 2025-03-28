import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, grayScaleLightTheme } from '@surface.dev/ui';
import { PostgresDataTable } from './components';
import { select } from './tools';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const columns = [
  { name: 'first_name', type: 'varchar' },
  { name: 'last_name', type: 'varchar' },
  { name: 'age', type: 'int' },
];

const rows = [
  { first_name: 'John', last_name: 'Doe', age: 30 },
  { first_name: 'Jane', last_name: 'Smith', age: 25 },
  { first_name: 'Michael', last_name: 'Johnson', age: 35 },
  { first_name: 'Emily', last_name: 'Brown', age: 28 },
  { first_name: 'William', last_name: 'Davis', age: 42 },
  { first_name: 'Sarah', last_name: 'Miller', age: 31 },
  { first_name: 'James', last_name: 'Wilson', age: 39 },
  { first_name: 'Emma', last_name: 'Moore', age: 26 },
  { first_name: 'David', last_name: 'Taylor', age: 45 },
  { first_name: 'Olivia', last_name: 'Anderson', age: 29 },
  { first_name: 'Daniel', last_name: 'Thomas', age: 33 },
  { first_name: 'Sophia', last_name: 'Jackson', age: 27 },
  { first_name: 'Joseph', last_name: 'White', age: 38 },
  { first_name: 'Isabella', last_name: 'Harris', age: 24 },
  { first_name: 'Matthew', last_name: 'Martin', age: 41 },
  { first_name: 'Mia', last_name: 'Thompson', age: 30 },
  { first_name: 'Andrew', last_name: 'Garcia', age: 36 },
  { first_name: 'Charlotte', last_name: 'Martinez', age: 28 },
  { first_name: 'Christopher', last_name: 'Robinson', age: 44 },
  { first_name: 'Ava', last_name: 'Clark', age: 25 },
  { first_name: 'Joshua', last_name: 'Rodriguez', age: 37 },
  { first_name: 'Amelia', last_name: 'Lewis', age: 32 },
  { first_name: 'Ryan', last_name: 'Lee', age: 40 },
  { first_name: 'Harper', last_name: 'Walker', age: 23 },
  { first_name: 'Nathan', last_name: 'Hall', age: 34 },
  { first_name: 'Evelyn', last_name: 'Allen', age: 29 },
  { first_name: 'Kevin', last_name: 'Young', age: 43 },
  { first_name: 'Victoria', last_name: 'King', age: 31 },
  { first_name: 'Justin', last_name: 'Wright', age: 35 },
  { first_name: 'Grace', last_name: 'Lopez', age: 26 },
  { first_name: 'Brandon', last_name: 'Hill', age: 39 },
  { first_name: 'Chloe', last_name: 'Scott', age: 28 },
  { first_name: 'Benjamin', last_name: 'Green', age: 42 },
  { first_name: 'Zoe', last_name: 'Adams', age: 27 },
  { first_name: 'Samuel', last_name: 'Baker', age: 36 },
  { first_name: 'Lily', last_name: 'Nelson', age: 30 },
  { first_name: 'Tyler', last_name: 'Carter', age: 41 },
  { first_name: 'Hannah', last_name: 'Mitchell', age: 25 },
  { first_name: 'Nicholas', last_name: 'Perez', age: 38 },
  { first_name: 'Layla', last_name: 'Roberts', age: 29 },
  { first_name: 'Christian', last_name: 'Turner', age: 43 },
  { first_name: 'Aubrey', last_name: 'Phillips', age: 24 },
  { first_name: 'Jonathan', last_name: 'Campbell', age: 37 },
  { first_name: 'Aria', last_name: 'Parker', age: 31 },
  { first_name: 'Dylan', last_name: 'Evans', age: 40 },
  { first_name: 'Scarlett', last_name: 'Edwards', age: 28 },
  { first_name: 'Adam', last_name: 'Collins', age: 35 },
  { first_name: 'Riley', last_name: 'Stewart', age: 26 },
  { first_name: 'Lucas', last_name: 'Sanchez', age: 44 },
  { first_name: 'Luna', last_name: 'Morris', age: 32 },
  { first_name: 'Isaac', last_name: 'Rogers', age: 39 },
  { first_name: 'Bella', last_name: 'Reed', age: 27 },
];

const App = () => {
  useEffect(() => {
    const performQuery = async () => {
      try {
        const results = await select({ query: 'SELECT * FROM customers' }, { source: 'mcp' });
        console.log(results);
      } catch (error) {
        console.error(error);
      }
    };

    performQuery();
  }, []);

  return (
    <ThemeProvider theme={grayScaleLightTheme}>
      <main>
        <div style={{ display: 'block', height: 600, width: 800 }}>
          <PostgresDataTable columns={columns} rows={rows} />
        </div>
      </main>
    </ThemeProvider>
  );
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
