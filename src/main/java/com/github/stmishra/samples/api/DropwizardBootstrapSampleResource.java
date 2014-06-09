package com.github.stmishra.samples.api;

import com.github.stmishra.samples.db.DropwizardBootstrapDAO;
import com.yammer.metrics.annotation.Timed;

import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/")
public class DropwizardBootstrapSampleResource {

    private static final List<Map<String, Object>> contacts = new ArrayList<Map<String, Object>>(500);
    static
    {
	for (int i = 1; i< 8 ; i++ ) {
	    Map<String, Object> temp = new HashMap<>();
	    temp.put("id", i);
	    temp.put("name", "contact - " + temp.get("id"));
	    temp.put("address", "address - " + temp.get("id"));
	    temp.put("tel", "919191919"+i);
	    temp.put("email", "backbone@example.com");
	    if ((i%2) == 0) {
		temp.put("type", "friend");
	    }
	    else
	    {
		temp.put("type", "enemy");
	    }
	    contacts.add((Integer) temp.get("id") - 1, temp);
	}
    }

    private DropwizardBootstrapDAO dao;

    public DropwizardBootstrapSampleResource(DropwizardBootstrapDAO dropwizardBootstrapDAO) {

        this.dao = dropwizardBootstrapDAO;
    }

    @GET
    @Timed
    @Path("/")
    @Produces("application/json")
    public List<Map<String, Object>> getAll()
    {
        return dao.getAll();
    }

    @GET
    @Timed
    @Path("/contact/{id}")
    @Produces("application/json")
    public Response getContact(@PathParam("id")Integer id)
    {
	if (null != DropwizardBootstrapSampleResource.contacts.get(id-1)) {
	    return Response.ok(DropwizardBootstrapSampleResource.contacts.get(id - 1)).build();
	}
	return Response.status(500).build();
    }

    @GET
    @Timed
    @Path("/contacts")
    @Produces("application/json")
    public List< Map<String,Object>> getContacts()
    {
	return DropwizardBootstrapSampleResource.contacts;
    }

    @POST
    @Timed
    @Path("/contact")
    @Consumes("application/json")
    @Produces("application/json")
    public Map<String, Object> postContacts(Map<String, Object> contact)
    {
	contact.put("id", contacts.size()+1);
	contacts.add((Integer) contact.get("id")-1, contact);
	return contacts.get((Integer) contact.get("id")-1);
    }

    @PUT
    @Timed
    @Path("/contact/{id}")
    @Consumes("application/json")
    @Produces("application/json")
    public Map<String, Object> putContacts(@PathParam("id") Integer id, Map<String, Object> contact)
    {
	id =  id -1 ;
	if (null == id || id < -1) throw new IllegalArgumentException();
	Map<String, Object> oldObj = contacts.get(id);
	if (oldObj.size() == 0) throw new IllegalArgumentException();
	for (Map.Entry<String, Object> entry : contact.entrySet())
	{
	    oldObj.put(entry.getKey(), entry.getValue());
	}
	return oldObj;
    }

    @DELETE
    @Timed
    @Path("/contact/{id}")
    @Consumes("application/json")
    @Produces("application/json")
    public Map<String, Object> deleteContact(@PathParam("id") Integer id){
	Map<String , Object> result = DropwizardBootstrapSampleResource.contacts.get(id -1 );
	DropwizardBootstrapSampleResource.contacts.remove(id -1 );
	return result;
    }
}
