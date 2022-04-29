CONFIG_DIR='../config';
DB_NAME='online_job_portal_test';
cd $CONFIG_DIR;
echo "CREATE DATABASE IF NOT EXISTS $DB_NAME;" | mysql -u root -p$DB_PASSWORD
cat academicdump.sql sqldump.sql | mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME;
