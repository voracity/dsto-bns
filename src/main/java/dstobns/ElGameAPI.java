package dstobns;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiMethod.HttpMethod;
//import com.google.api.server.spi.response.NotFoundException;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;

import static dstobns.OfyService.ofy;

import com.googlecode.objectify.Key;

import dstobns.domain.BNVariable;
import dstobns.domain.Profile;
import dstobns.forms.NewVariableForm;

import javax.inject.Named;

/**
 * Defines v1 of Elicitation Game API (elgameapi), which provides ...
 */
@Api(
    name = "elgameapi",
    version = "v1",
    scopes = {Constants.EMAIL_SCOPE},
    clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID, Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
    audiences = {Constants.ANDROID_AUDIENCE}
)
public class ElGameAPI {

  @ApiMethod(name = "setDisplayName", path = "setDisplayName")
  public Profile setDisplayName(final User user, @Named("name") String name) throws UnauthorizedException {
	  
	  if (user == null) {
		  throw new UnauthorizedException("Authorization required");
	  }
	  
	  String userId = user.getUserId();
	  
	  // Get the Profile from the datastore if it exists, otherwise create a new one
      Profile profile = ofy().load().key(Key.create(Profile.class, userId)).now();
      if (profile == null) profile = new Profile(user); 
      
	  profile.setDisplayName(name);
	  
	  // Save the entity in the datastore
      ofy().save().entity(profile).now();
      
	  return profile;
	  
  }
  
  @ApiMethod(name = "storeVariable", path = "storeVariable", httpMethod = "post")
  public BNVariable storeVariable(final User user, BNVariable variable) throws UnauthorizedException {
	  
	  if (user == null) {
		  throw new UnauthorizedException("Authorization required");
	  }
	  
	  // Save the entity in the datastore
      ofy().save().entity(variable).now();
	  
	  return variable;
	  
  }
  
  // Declare this method as a method available externally through Endpoints
  @ApiMethod(name = "saveVariable", path = "put-variable", httpMethod = HttpMethod.POST)
  // The request that invokes this method should provide data that
  // conforms to the fields defined in NewVariableForm
  public BNVariable saveVariable(final User user, NewVariableForm newVariableForm)
          throws UnauthorizedException {

      // If the user is not logged in, throw an UnauthorizedException
      if (user == null) {
          throw new UnauthorizedException("Authorization required");
      }
      
      BNVariable variable = new BNVariable(newVariableForm); 
      
      // Save the entity in the datastore
      ofy().save().entity(variable).now();

      // Return the profile
      return variable;
  }

  @ApiMethod(name = "getProfile", path = "getProfile")
  public Profile getProfile(final User user) throws UnauthorizedException {
    if (user == null) {
      throw new UnauthorizedException("Authorization required");
    }
    
    String userId = user.getUserId();
    Key key = Key.create(Profile.class, userId);

    // Get the Profile from the datastore if it exists, otherwise create a new one
    Profile profile = (Profile) ofy().load().key(key).now();
    if (profile == null) {
    	profile = new Profile(user); 
    	// Save the entity in the datastore
        ofy().save().entity(profile).now();
    }
    
    return profile;
    
  }

  
  
}
