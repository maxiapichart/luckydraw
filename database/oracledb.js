const oracledb = require('oracledb')
const { user, pw_luck, pw_nora, ORACLE_LUCK, ORACLE_NORA } = process.env

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

const connect = async (db) => {
  try {
    return await oracledb.getConnection({
      user,
      password: db === 'LUCK' ? pw_luck : pw_nora,
      connectString: db === 'LUCK' ? ORACLE_LUCK : ORACLE_NORA,
    })
  } catch (err) {
    console.log(err)
  }
}

exports.execute = async (db, query, bind = []) => {
  const connection = await connect(db)
  try {
    return await connection.execute(query, bind)
  } catch (err) {
    console.log(err)
  } finally {
    if (connection) {
      try {
        await connection.close()
      } catch (err) {
        console.error(err)
      }
    }
  }
}

exports.luck = (query, bind = []) => execute('LUCK', query, bind)
exports.nora = (query, bind = []) => execute('NORA', query, bind)
