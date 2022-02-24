DROP EVENT IF EXISTS deleteExpiredJobsEvent;
CREATE EVENT deleteExpiredJobsEvent
    ON SCHEDULE
      EVERY 1 DAY
    COMMENT 'Deletes expired job each day.'
    DO
      CALL deleteExpiredJobs();