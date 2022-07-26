FROM openjdk:8-jre
COPY ./backend/ app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]