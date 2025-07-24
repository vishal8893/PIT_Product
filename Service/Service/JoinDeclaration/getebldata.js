const { Connection, Request } = require('tedious');

const config = {
  server: '10.250.2.99',
  authentication: {
    type: 'default',
    options: {
      userName: 'Id_uat',
      password: '12@Iduat',
    }
  },
  options: {
    database: 'NKYCKYC',
    encrypt: true,
    // connectTimeout: 15000
  }
};

async function runQuery(query) {
  return new Promise((resolve, reject) => {
    const connection = new Connection(config);

    connection.on('connect', err => {
      if (err) {
        console.error('Error connecting to SQL Server:', err.message);
        reject(err);
      } else {
        console.log('Connected to SQL Server.');
        const request = new Request(query, (err, rowCount, rows) => {
          if (err) {
            console.error('Error running query:', err.message);
            reject(err);
          } else {
            console.log(`Query executed successfully. ${rowCount} rows returned.`);

            const result = [];
            rows.forEach(columns => {
              const row = {};
              columns.forEach(column => {
                row[column.metadata.colName] = column.value;
              });
              result.push(row);
            });

            console.log("data",result);

            resolve(result);
          }
          connection.close();
        });

        connection.execSql(request);
      }
    });

    connection.on('error', err => {
      console.error('Connection error:', err.message);
      reject(err);
    });
  });
}

// Function to check SQL Server connection and run query
async function checkSqlServerConnectionAndRunQuery() {
  const query = 'SELECT * FROM dbo.btvwSOSClientMaster';

  try {
    const result = await runQuery(query);
    console.log('Query result:', result);
    return result;
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

// Export the function to be called from other modules
module.exports.checkSqlServerConnectionAndRunQuery = checkSqlServerConnectionAndRunQuery;
