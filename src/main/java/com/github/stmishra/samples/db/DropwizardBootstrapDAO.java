package com.github.stmishra.samples.db;

import org.skife.jdbi.v2.sqlobject.Bind;
import org.skife.jdbi.v2.sqlobject.SqlQuery;
import org.skife.jdbi.v2.sqlobject.SqlUpdate;

import java.util.List;
import java.util.Map;

/**
 * Created by santoshm1 on 6/2/14.
 */
public interface DropwizardBootstrapDAO {




   /* @SqlQuery("select * from sample")
    ImmutableList<Map<String, Object>> fetchAll();
*/
    /*@SqlQuery("update sample set content = :content, update_date= date('now') where id = :id")
    void updateContent();

    @SqlQuery("select * from sample where create_date = :date")
    ImmutableList<Map<String, Object>> fetchByDate();

    @SqlQuery("select * from sample where id = :id")
    ImmutableList<Map<String, Object>> fetchById(); */

    @SqlUpdate("insert into sample (title, create_date, update_date, content) values( :title, date('now'), date('now'), :content) ")
    void insertContent(@Bind("title") String title, @Bind("content") String content);

    @SqlQuery("select * from sample")
    List<Map<String, Object>> getAll();
}
