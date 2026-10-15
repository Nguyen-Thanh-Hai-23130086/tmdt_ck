#!/bin/sh
# Requires Maven/JDK17 and downloaded jakarta.servlet-api dependency. Does not touch MySQL.
set -eu
cd "$(dirname "$0")/.."
mvn -q -DskipTests package
SERVLET_JAR="$HOME/.m2/repository/jakarta/servlet/jakarta.servlet-api/6.0.0/jakarta.servlet-api-6.0.0.jar"
if [ ! -f "$SERVLET_JAR" ]; then echo "Missing $SERVLET_JAR" >&2; exit 1; fi
mkdir -p target/tm-test-classes
javac --release 17 -encoding UTF-8 -cp "target/classes:$SERVLET_JAR" -d target/tm-test-classes tests/JavaCoreTest.java tests/WorkServiceTest.java tests/controller/ApiSmokeTest.java
CP="target/classes:target/tm-test-classes:$SERVLET_JAR"
java -cp "$CP" JavaCoreTest
java -cp "$CP" WorkServiceTest
java -cp "$CP" controller.ApiSmokeTest
node tests/frontend_data_test.js
python3 tests/browser_static_test.py
python3 tests/seed_integrity_test.py
