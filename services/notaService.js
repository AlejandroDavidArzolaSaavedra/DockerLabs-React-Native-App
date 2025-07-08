import database from './database';

export const addNote = async (note) => {
  try {
    return await database.withTransactionAsync(async () => {
      const db = await database.getConnection();
      const result = await db.runAsync(
        `INSERT INTO Notes (title, description, date, time, vm_name, video_minute) VALUES (?, ?, ?, ?, ?, ?)`,
        [note.title, note.description, note.date, note.time, note.vm_name, note.video_minute]
      );

      return result;
    });
  } catch (error) {
    console.error('Error adding note:', error);
    throw error;
  }
};

export const deleteNote = async (id) => {
  try {
    return await database.withTransactionAsync(async () => {
      const db = await database.getConnection();
      return await db.runAsync('DELETE FROM Notes WHERE id = ?', [id]);
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

export const updateNote = async (note) => {
  try {
    return await database.withTransactionAsync(async () => {
      const db = await database.getConnection();
      return await db.runAsync(
        `UPDATE Notes SET title = ?, description = ?, date = ?, time = ?, vm_name = ?, video_minute = ? WHERE id = ?`,
        [note.title, note.description, note.date, note.time, note.vm_name, note.video_minute, note.id]
      );
    });
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export const getNotesByVM = async (vmName) => {
  try {
    const db = await database.getConnection();
    const result = await db.getAllAsync(
      'SELECT * FROM Notes WHERE vm_name = ? ORDER BY date DESC, time DESC',
      [vmName]
    );
    return result;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};