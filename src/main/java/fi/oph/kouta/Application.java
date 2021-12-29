package fi.oph.kouta;

import ch.qos.logback.access.jetty.RequestLogImpl;
import org.eclipse.jetty.server.RequestLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.jetty.JettyServerCustomizer;
import org.springframework.boot.web.embedded.jetty.JettyServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public ConfigurableServletWebServerFactory webServerFactory(@Autowired UrlConfiguration configuration)
    {
        JettyServletWebServerFactory factory = new JettyServletWebServerFactory();
        factory.addServerCustomizers(new JettyServerCustomizer() {
            @Override
            public void customize(org.eclipse.jetty.server.Server server) {
                server.setRequestLog(requestLog());
            }
            
            private RequestLog requestLog() {
                RequestLogImpl requestLog = new RequestLogImpl();

                String logbackAccess = configuration.getOrElse("logback.access", null);
                if (logbackAccess != null) {
                    requestLog.setFileName(logbackAccess);
                } else {
                    System.out.println("JettyLauncher: Jetty access log is printed to console, use -Dlogback.access to set configuration file");
                    requestLog.setResource("/logback-access.xml");
                }
                requestLog.start();
                return requestLog;
            }
        });
        return factory;
    }
}
