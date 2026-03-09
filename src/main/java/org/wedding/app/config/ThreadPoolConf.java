package org.wedding.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
public class ThreadPoolConf {
    public static final String THREAD_POOL_NAME = "my-wedding-thread-pool";

    @Bean(name = THREAD_POOL_NAME)
    Executor executor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(8);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix(THREAD_POOL_NAME);
        executor.initialize();
        return executor;
    }


}
