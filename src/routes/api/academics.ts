import express from 'express';
import connection from '@utils/dbSetup';
import { academicQualifications } from '@typings/AcademicQualifications';
import { FieldPacket, RowDataPacket } from 'mysql2';

const router = express.Router();

let qualifications: academicQualifications;
async function updateLocalQualifications() {
  const [result]: [RowDataPacket[][], FieldPacket[]] = await connection.query(
    'CALL getQualifications()',
  );
  if (!Array.isArray(result)) {
    throw new Error('Invalid result for academic qualifications!');
  }
  const newQualifications: academicQualifications = {};
  result[0].forEach((row) => {
    newQualifications[row.level] = row.data;
  });
  qualifications = newQualifications;
  return newQualifications;
}

async function getDBQualifications() {
  if (!qualifications) {
    await updateLocalQualifications();
  }
  return qualifications;
}

router.get('/', async (req, res) => {
  const allQualifications = await getDBQualifications();
  const levels = req.query.level as string[] | undefined;
  const disciplines = req.query.discipline as string[] | undefined;
  const filters = { levels, disciplines };
  let temp: academicQualifications = {};
  let filteredQualifications: academicQualifications = {};
  if (levels && Array.isArray(levels)) {
    Object.keys(allQualifications).forEach((level) => {
      if (levels.includes(level)) {
        temp[level] = allQualifications[level];
      }
    });
  } else {
    temp = allQualifications;
  }
  if (disciplines && Array.isArray(disciplines)) {
    Object.entries(temp).forEach(([level, levelData]) => {
      filteredQualifications[level] = {};
      Object.entries(levelData).forEach(([discipline, disciplineData]) => {
        if (disciplines.includes(discipline)) {
          filteredQualifications[level][discipline] = disciplineData;
        }
      });
    });
  } else {
    filteredQualifications = temp;
  }
  res.json({ query: filteredQualifications, filters, success: true });
});

export default router;
