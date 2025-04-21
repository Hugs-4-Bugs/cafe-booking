
# Use the official OpenJDK image to build and run the application
FROM openjdk:17-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file from the target directory to the container
COPY target/cafe-management-system-0.0.1-SNAPSHOT.jar app.jar

# Expose the port your Spring Boot app runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]





### Explanation:

# - Base Image: We use `openjdk:17-jdk-slim` to ensure the application runs on Java 17 (adjust this based on your project).
# - Working Directory: `/app` is created as the working directory in the container.
# - Copy JAR: The JAR file from the `target` folder (after building the project) is copied into the container.
# - Expose Port: Port `8080` is exposed, which is the default port for Spring Boot apps.
# - Run Command: The `ENTRYPOINT` specifies the command to run the JAR file.



### How to Build and Run:

# 1. Build the JAR:
#    mvn clean package
#
# 2. Build the Docker Image:
#    docker build -t cafe-management-system .
#
# 3. Run the Container:
#    docker run -p 8080:8080 cafe-management-system

