import chalk from 'chalk';
import ModbusRTU from 'modbus-serial';
let client = new ModbusRTU();

let timeoutConnectRef = 100;
let retrying = false;

const options = {
  host: '127.0.0.1',
  port: 502,
  timeout: 5000,
  interval: 1000,
  unit_id: 1,
};

async function onConnect() {
  // clear pending timeouts
  clearTimeout(timeoutConnectRef);

  client.setTimeout(options.timeout);
  client.setID(options.unit_id);
  await client
    .connectTCP(options.host, { port: options.port })
    .then(() => {
      retrying = false;
      console.log(chalk.green('Modbus Connected...'));
    })
    .catch((e) => {
      // console.log(chalk.red(e.message));
    });
}

async function onReconnect(err) {
  if (err.errno) {
    // clear pending timeouts
    clearTimeout(timeoutConnectRef);

    // close connection
    client.close(() => {
      console.log('Reconnecting Modbus...');

      setTimeout(async () => {
        await onConnect();
      }, options.timeout);
    });

    // re open connection
    // if (!retrying) {
    //   retrying = true;
    //   console.log('Reconnecting Modbus...');
    // }

    // setTimeout(async () => {
    //   await onConnect();
    // }, options.timeout);
  }
}

/**
 * Test one
 */
// List of meters id
// const metersIdList = [0, 1];

// async function metersValue(meters) {
//   try {
//     for (let meter of meters) {
//       if (meter === 0) {
//         const val = await getMeterValue(meter);
//         console.log(`Minyak: ${val} kg`);
//       } else if (meter === 1) {
//         const val = await getMeterValue(meter);
//         console.log(`Bawang: ${val} kg`);
//       }
//     }
//   } catch (e) {
//     console.log(e);
//   } finally {
//     setImmediate(() => {
//       getMeterValue(metersIdList);
//     });
//   }
// }

/**
 * Read Coil Status (FC1)
 */
function readCoils(addr, len) {
  return new Promise((resolve, reject) => {
    // clear pending timeouts
    clearTimeout(timeoutConnectRef);
    client
      .readCoils(addr, len)
      .then((vl) => {
        resolve(vl.data[0]);
      })
      .catch((e) => {
        onReconnect(e);
      });
  });
}

/**
 * Read Input Status (FC2)
 */
function readInputStatus(addr, len) {
  return new Promise(async (resolve, reject) => {
    try {
      const value = await client.readDiscreteInputs(addr, len);
      resolve(value.data[0]);
    } catch (e) {
      onReconnect(e);
    }
  });
}

// Set interval to automatic update data
setInterval(() => {
  readCoils(0, 1).then((vl) => {
    console.log(vl);
  });
}, options.interval);

/**
 * Connect
 */
onConnect();
