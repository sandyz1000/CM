package com.github.stmishra.samples.service;


import com.github.stmishra.samples.api.DropwizardBootstrapSampleResource;
import com.github.stmishra.samples.configuration.DropwizardBootstrapConfiguration;
import com.github.stmishra.samples.db.DropwizardBootstrapDAO;
import com.yammer.dropwizard.Service;
import com.yammer.dropwizard.assets.AssetsBundle;
import com.yammer.dropwizard.config.Bootstrap;
import com.yammer.dropwizard.config.Environment;
import com.yammer.dropwizard.db.DatabaseConfiguration;
import com.yammer.dropwizard.jdbi.DBIFactory;
import com.yammer.dropwizard.jdbi.ImmutableListContainerFactory;
import com.yammer.dropwizard.jdbi.ImmutableSetContainerFactory;
import com.yammer.dropwizard.migrations.MigrationsBundle;
import org.skife.jdbi.v2.DBI;
import org.skife.jdbi.v2.DefaultMapper;


public class DropwizardBootstrapSample extends Service<DropwizardBootstrapConfiguration> {
    public static void main(String[] args) throws Exception {
        new DropwizardBootstrapSample().run(args);
    }

    @Override
    public void initialize(Bootstrap<DropwizardBootstrapConfiguration> bootstrap) {
        bootstrap.setName("dropwizard-bootstrap-config");
        bootstrap.addBundle(new AssetsBundle("/assets/","/"));
        bootstrap.addBundle(new MigrationsBundle<DropwizardBootstrapConfiguration>() {
            @Override
            public DatabaseConfiguration getDatabaseConfiguration(DropwizardBootstrapConfiguration configuration) {
                return configuration.getDatabaseConfiguration();
            }
        });
    }

    @Override
    public void run(DropwizardBootstrapConfiguration configuration,
                    Environment environment) throws ClassNotFoundException {
        final DBIFactory factory = new DBIFactory();
        final DBI jdbi = factory.build(environment, configuration.getDatabaseConfiguration(), "sqlite");
        jdbi.registerMapper(new DefaultMapper());
        jdbi.registerContainerFactory(new ImmutableListContainerFactory());
        jdbi.registerContainerFactory(new ImmutableSetContainerFactory());
        final DropwizardBootstrapDAO dao = jdbi.onDemand(DropwizardBootstrapDAO.class);
        //dao.createSampleTable();
        dao.insertContent("santosh", "blah");

        environment.addResource(new DropwizardBootstrapSampleResource(dao));

    }
}
