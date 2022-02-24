CREATE EVENT deleteExpiredJobs
    ON SCHEDULE
      EVERY 1 DAY
    COMMENT 'Deletes expired job each day.'
    DO
      DELETE FROM jobs WHERE jobs.deadline < current_date();