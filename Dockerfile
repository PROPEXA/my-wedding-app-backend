# ==============================================================================
# Dockerfile - My Wedding Backend
# Enterprise-grade, multi-stage build with security best practices
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Stage
# Uses Maven to build the application with all dependencies cached
# ------------------------------------------------------------------------------
FROM eclipse-temurin:17-jdk-alpine AS builder

# Build arguments for flexibility
ARG MAVEN_VERSION=3.9.9

# Install Maven
RUN apk add --no-cache curl \
    && curl -fsSL https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
    | tar -xzC /opt \
    && ln -s /opt/apache-maven-${MAVEN_VERSION} /opt/maven

ENV MAVEN_HOME=/opt/maven
ENV PATH="${MAVEN_HOME}/bin:${PATH}"

WORKDIR /build

# Copy only POM first to leverage Docker layer caching for dependencies
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Download dependencies (this layer is cached unless pom.xml changes)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application (skip tests for faster builds - tests should run in CI)
RUN mvn clean package -DskipTests -B \
    && mkdir -p target/dependency \
    && cd target/dependency \
    && jar -xf ../*.jar

# ------------------------------------------------------------------------------
# Stage 2: Production Runtime Stage
# Minimal image with only JRE and application
# ------------------------------------------------------------------------------
FROM eclipse-temurin:17-jre-alpine AS production

# Labels for container metadata (OCI standard)
LABEL org.opencontainers.image.title="My Wedding Backend" \
      org.opencontainers.image.description="Backend API for My Wedding App" \
      org.opencontainers.image.version="0.0.1" \
      org.opencontainers.image.vendor="Wedding App" \
      org.opencontainers.image.authors="Alexander Machic <rmachicm>" \
      org.opencontainers.image.source="https://github.com/rmachicm/my-wedding-backend" \
      org.opencontainers.image.base.name="eclipse-temurin:17-jre-alpine"

# Environment variables with secure defaults
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:InitialRAMPercentage=50.0 \
               -XX:+UseG1GC \
               -XX:+UseStringDeduplication \
               -Djava.security.egd=file:/dev/./urandom \
               -Dspring.profiles.active=prod" \
    APP_HOME=/app \
    APP_USER=wedding \
    APP_GROUP=wedding \
    TZ=America/Guatemala

# Install required packages and create non-root user
RUN apk add --no-cache \
        curl \
        tzdata \
        dumb-init \
    && cp /usr/share/zoneinfo/${TZ} /etc/localtime \
    && echo "${TZ}" > /etc/timezone \
    && addgroup -S ${APP_GROUP} \
    && adduser -S ${APP_USER} -G ${APP_GROUP} \
    && mkdir -p ${APP_HOME} \
    && chown -R ${APP_USER}:${APP_GROUP} ${APP_HOME} \
    && rm -rf /var/cache/apk/* \
    && rm -rf /tmp/*

WORKDIR ${APP_HOME}

# Copy application using layered approach for optimal caching
# This enables faster incremental builds when only code changes
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} /build/target/dependency/BOOT-INF/lib ./lib
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} /build/target/dependency/META-INF ./META-INF
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} /build/target/dependency/BOOT-INF/classes ./classes

# Switch to non-root user (security best practice)
USER ${APP_USER}

# Expose application port
EXPOSE 8080

# Health check using Spring Boot Actuator
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Use dumb-init to properly handle signals (PID 1 problem)
ENTRYPOINT ["dumb-init", "--"]

# Run the application with optimized JVM settings
CMD ["sh", "-c", "java ${JAVA_OPTS} -cp classes:lib/* org.wedding.app.WeddingInvitationsAppApplication"]

