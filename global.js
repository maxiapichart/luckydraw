const { execute } = require('./database/oracledb')

exports.devs = ['apichart.l']

exports.getUser = async (username) => {
  let query, db
  if (+username) {
    db = 'LUCK'
    query = TABLE_S + ' WHERE S.STUDENT_ID = :student_id'
  } else {
    db = 'NORA'
    query = TABLE_P + ' WHERE A.USERNAME = :username'
  }
  const data = await execute(db, query, [username])
  return data.rows[0] ? toLowerKeys(data.rows[0]) : null
}

exports.getUsers = async (usernames) => {
  const whereIn = `(('${usernames.join("', 0), ('")}', 0))`

  const queryStudent = TABLE_S + ' WHERE (S.STUDENT_ID, 0) IN ' + whereIn
  const resStudent = await execute('LUCK', queryStudent)
  const students = resStudent.rows ? toLowerKeys(resStudent.rows) : []

  const queryPersonnel = TABLE_P + ' WHERE (A.USERNAME, 0) IN ' + whereIn
  const resPersonnel = await execute('NORA', queryPersonnel)
  const personnels = resPersonnel.rows ? toLowerKeys(resPersonnel.rows) : []

  return students.concat(personnels)
}

const toLowerKeys = (data) =>
  Array.isArray(data) ? data.map((v) => objLowerKey(v)) : objLowerKey(data)
const objLowerKey = (obj) => {
  const keys = Object.keys(obj)
  const newObj = {}

  let key
  let n = keys.length
  while (n--) {
    key = keys[n]
    newObj[key.toLowerCase()] = obj[key]
  }
  return newObj
}

const TABLE_S = `SELECT S.STUDENT_ID AS USERNAME,
  T.TITLE_NAME_THAI || S.STUD_NAME_THAI || ' ' || S.STUD_SNAME_THAI AS NAME,
  F.FAC_NAME_THAI AS UNIT
FROM (
  SELECT S.* FROM REGIST2005_NEW.STUDENT S WHERE S.STUDENT_ID LIKE '__1%'
  UNION ALL
  SELECT S.* FROM REGIST2005_NEW.STUDENT@reis S WHERE S.STUDENT_ID LIKE '__2%'
  UNION ALL
  SELECT S.* FROM REGIST2005_NEW.STUDENT@stud_phuket S WHERE S.STUDENT_ID LIKE '__3%'
  UNION ALL
  SELECT S.* FROM REGIST2005_NEW.STUDENT@stud_surat S WHERE S.STUDENT_ID LIKE '__4%'
  UNION ALL
  SELECT S.* FROM REGIST2005_NEW.STUDENT@stud_trang S WHERE S.STUDENT_ID LIKE '__5%'
) S
LEFT JOIN REGIST2005_NEW.TITLE T ON T.TITLE_ID = S.TITLE_ID
LEFT JOIN REGIST2005_NEW.FACULTY F ON F.FAC_ID = S.FAC_ID`

const TABLE_P = `SELECT A.USERNAME AS USERNAME,
  C.TITLE_NAME_THAI || P.STAFF_NAME_THAI || ' ' || P.STAFF_SNAME_THAI AS NAME,
  D.DEPT_NAME_THAI AS UNIT
FROM (
  SELECT *
  FROM PERSONEL.V_STAFF
  WHERE STAFF_ID IN (
    SELECT MAX(P.STAFF_ID) AS STAFF_ID
    FROM PERSONEL.V_STAFF P
    GROUP BY P.STAFF_PERS_ID
  )
) P
LEFT JOIN DIR_SERVICE.AD_STAFF A ON A.CITIZENID = P.STAFF_PERS_ID
LEFT JOIN CENTRAL.C_TITLE C ON C.TITLE_ID = P.TITLE_ID
LEFT JOIN CENTRAL.C_DEPT D ON D.DEPT_ID = P.DEPT_ID`
