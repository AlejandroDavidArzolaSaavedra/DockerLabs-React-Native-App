import database from './database';

export const addVirtualMachine = async (vm) => {
  try {
    return await database.withTransactionAsync(async () => {
      const db = await database.getConnection();
      const result = await db.runAsync(
        'INSERT INTO VirtualMachines (name, difficulty, desired, done) VALUES (?, ?, ?, ?)',
        [vm.name, vm.difficulty, vm.desired ? 1 : 0, vm.done ? 1 : 0]
      );
      return result;
    });
  } catch (error) {
    console.error('Error adding VM:', error);
    throw error;
  }
};

export const updateVirtualMachineByName = async (name, vm) => {
  try {
    return await database.withTransactionAsync(async () => {
      const db = await database.getConnection();
      const result = await db.runAsync(
        'UPDATE VirtualMachines SET difficulty = ?, desired = ?, done = ? WHERE name = ?',
        [vm.difficulty, vm.desired ? 1 : 0, vm.done ? 1 : 0, name]
      );
      return result;
    });
  } catch (error) {
    console.error('Error updating VM by name:', error);
    throw error;
  }
}




export const updateVirtualMachine = async (vm) => {
  try {
    return await database.withTransactionAsync(async () => {
      const db = await database.getConnection();
      const result = await db.runAsync(
        'UPDATE VirtualMachines SET difficulty = ?, desired = ?, done = ? WHERE name = ?',
        [vm.difficulty, vm.desired ? 1 : 0, vm.done ? 1 : 0, vm.name]
      );
      return result;
    });
  } catch (error) {
    console.error('Error updating VM:', error);
    throw error;
  }
};

export const getVirtualMachinesFiltered = async (filterType, value) => {
  if (filterType !== 'desired' && filterType !== 'done') {
    throw new Error("Filter must be either 'desired' or 'done'");
  }

  try {
    const db = await database.getConnection();
    const valInt = value ? 1 : 0;
    const result = await db.getAllAsync(
      `SELECT * FROM VirtualMachines WHERE ${filterType} = ?`,
      [valInt]
    );
    return result;
  } catch (error) {
    console.error('Error getting filtered VMs:', error);
    throw error;
  }
};

export const getVirtualMachineByName = async (name) => {
  try {
    const db = await database.getConnection();
    const result = await db.getFirstAsync(
      'SELECT * FROM VirtualMachines WHERE name = ?',
      [name]
    );
    return result;
  } catch (error) {
    console.error('Error getting VM by name:', error);
    throw error;
  }
};
export const getAllVirtualMachines = async () => {
  try {
    const db = await database.getConnection();
    const result = await db.getAllAsync('SELECT * FROM VirtualMachines');
    return result;
  } catch (error) {
    console.error('Error getting all VMs:', error);
    throw error;
  }
};
