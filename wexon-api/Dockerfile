#Builder
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app
COPY . .
RUN chmod +x ./gradlew
RUN ./gradlew bootJar

#Runner
FROM bellsoft/liberica-openjdk-debian:21 AS runner
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8083
EXPOSE 8080

CMD ["java", "-jar", "/app/app.jar"]
